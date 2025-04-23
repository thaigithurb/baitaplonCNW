document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.querySelector('.filters-sidebar');
    const categoryFilters = document.querySelectorAll('input[type="checkbox"][id^="men"], input[type="checkbox"][id^="women"], input[type="checkbox"][id^="sports"]');
    const priceFilters = document.querySelectorAll('input[type="checkbox"][id^="price"]');
    const sizeButtons = document.querySelectorAll('.size-buttons button');
    const applyFiltersBtn = document.querySelector('.filters-sidebar .btn-primary');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.querySelector('.search-form input[name="keyword"]');
    const searchForm = document.querySelector('.search-form');

    let selectedFilters = {
        categories: [],
        priceRanges: [],
        sizes: [],
        searchTerm: ''
    };

    categoryFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            if (filter.checked) {
                selectedFilters.categories.push(filter.id);
            } else {
                selectedFilters.categories = selectedFilters.categories.filter(cat => cat !== filter.id);
            }
        });
    });

    priceFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            if (filter.checked) {
                selectedFilters.priceRanges.push(filter.id);
            } else {
                selectedFilters.priceRanges = selectedFilters.priceRanges.filter(price => price !== filter.id);
            }
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.classList.toggle('active');
        });
    });

    // Handle search input
    searchInput.addEventListener('input', () => {
        selectedFilters.searchTerm = searchInput.value.toLowerCase().trim();
    });

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });

    const applyFilters = () => {
        let visibleCount = 0;

        productCards.forEach(card => {
            const productCategory = card.getAttribute('data-category') || 'men';
            const productPrice = parseFloat(card.getAttribute('data-price')) || 99.99;
            const productSizes = (card.getAttribute('data-sizes') || '8,9,10').split(',');
            const productTitle = card.querySelector('.card-title').textContent.toLowerCase();
            const productPriceText = card.querySelector('.card-text').textContent.toLowerCase();

            let shouldShow = true;

            // Check category filter
            if (selectedFilters.categories.length > 0) {
                shouldShow = shouldShow && selectedFilters.categories.includes(productCategory);
            }

            // Check price filter
            if (selectedFilters.priceRanges.length > 0) {
                let priceMatch = false;
                selectedFilters.priceRanges.forEach(priceRange => {
                    switch (priceRange) {
                        case 'price1':
                            priceMatch = priceMatch || productPrice < 50;
                            break;
                        case 'price2':
                            priceMatch = priceMatch || (productPrice >= 50 && productPrice <= 100);
                            break;
                        case 'price3':
                            priceMatch = priceMatch || (productPrice > 100 && productPrice <= 200);
                            break;
                        case 'price4':
                            priceMatch = priceMatch || productPrice > 200;
                            break;
                    }
                });
                shouldShow = shouldShow && priceMatch;
            }

            // collected size 
            selectedFilters.sizes = Array.from(sizeButtons)
                .filter(button => button.classList.contains('active'))
                .map(button => button.textContent.trim());


            // Check size filter
            if (selectedFilters.sizes.length > 0) {
                shouldShow = shouldShow && selectedFilters.sizes.some(size => productSizes.includes(size));
            }

            // Check search term
            if (selectedFilters.searchTerm) {
                const searchMatch = productTitle.includes(selectedFilters.searchTerm) ||
                    productPriceText.includes(selectedFilters.searchTerm);
                shouldShow = shouldShow && searchMatch;
            }


            // Show/hide the product card's parent column
            const parentColumn = card.closest('.col-md-4');
            if (parentColumn) {
                if (shouldShow) {
                    parentColumn.style.display = 'block';
                    visibleCount++;
                } else {
                    parentColumn.style.display = 'none';
                }
            }
        });

        // if no match filters
        let noResultsMessage = document.querySelector('.no-results-message');

        if (visibleCount === 0) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results-message alert alert-info text-center mt-4';
                noResultsMessage.textContent = 'No products match the selected filters.';
                document.querySelector('.row.g-4').appendChild(noResultsMessage);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }

        // Update filter count
        updateFilterCount();
    };

    // update filter count
    const updateFilterCount = () => {
        const totalFilters = selectedFilters.categories.length +
            selectedFilters.priceRanges.length +
            selectedFilters.sizes.length;

        let filterCountElement = document.querySelector('.filter-count');

        if (totalFilters > 0) {
            if (!filterCountElement) {
                filterCountElement = document.createElement('span');
                filterCountElement.className = 'filter-count badge bg-primary ms-2';
                document.querySelector('.filters-sidebar h4').appendChild(filterCountElement);
            }
            filterCountElement.textContent = totalFilters;
        } else if (filterCountElement) {
            filterCountElement.remove();
        }
    };

    // Add reset filters button
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-outline-secondary w-100 mt-2';
    resetButton.textContent = 'Reset Filters';
    resetButton.addEventListener('click', () => {
        // Reset checkboxes
        categoryFilters.forEach(checkbox => checkbox.checked = false);
        priceFilters.forEach(checkbox => checkbox.checked = false);

        // Reset size buttons
        sizeButtons.forEach(button => button.classList.remove('active'));

        // Reset search input
        searchInput.value = '';

        // Reset selected filters
        selectedFilters = {
            categories: [],
            priceRanges: [],
            sizes: [],
            searchTerm: ''
        };

        // Show all products
        productCards.forEach(card => {
            const parentColumn = card.closest('.col-md-4');
            if (parentColumn) {
                parentColumn.style.display = 'block';
            }
        });

        // Remove no results message if exists
        const noResultsMessage = document.querySelector('.no-results-message');
        if (noResultsMessage) {
            noResultsMessage.remove();
        }

        // Update filter count
        updateFilterCount();
    });

    // Add reset button after apply filters button
    applyFiltersBtn.parentNode.insertBefore(resetButton, applyFiltersBtn.nextSibling);
}); 
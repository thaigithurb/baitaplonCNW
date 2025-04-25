const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");
const authLink = document.querySelector("#auth-link");
const newsletterForm = document.querySelector(".newsletter-form");
let userId = null;
const paymentForm = document.querySelector(".payment-form");
const forgetForm = document.querySelector(".forget-form");
const quantityInput = document.querySelector('input[value]');
const btnIncrease = document.querySelector(".btn-increase");
const btnDecrease = document.querySelector(".btn-decrease");
const sizeButtons = document.querySelectorAll('.size-buttons button');
const colorButtons = document.querySelectorAll('.color-options button');
const addToCartButton = document.querySelector(".btn-add-to-cart");


const getUsers = () => JSON.parse(localStorage.getItem('users')) || {};
const getSubscribers = () => JSON.parse(localStorage.getItem('subscribers')) || [];
// login, register
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const phone = e.target.phone.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password === confirmPassword) {
            const users = getUsers();
            
            // Check if email exists
            if (users[email]) {
                alert("Email already registered!");
                return;
            }

            // Create new user
            users[email] = {
                username: firstName + " " + lastName,
                email: email,
                phone: phone,
                password: password, 
                membership: false
            };

            localStorage.setItem('users', JSON.stringify(users));
            
            // Automatically log in the user after registration
            localStorage.setItem('currentUser', email);
            
            // Show success message
            const successAlert = document.createElement("div");
            successAlert.className = "alert alert-success";
            successAlert.role = "alert";
            successAlert.textContent = "Registration successful!";
            successAlert.style.position = "fixed";
            successAlert.style.top = "0";
            successAlert.style.left = "0";
            successAlert.style.width = "100%";
            successAlert.style.zIndex = "9999";
            document.body.prepend(successAlert);

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            alert("Passwords do not match!");
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const users = getUsers();

        if (users[email] && users[email].password === password) {
            localStorage.setItem('currentUser', email);
            window.location.href = "index.html";
        } else {
            alert("Invalid email or password!");
        }
    });
}

// check state
const checkAuthState = () => {
    const currentUser = localStorage.getItem('currentUser');
    const cartIcon = document.querySelector(".cart-icon");
    if (currentUser) {
        cartIcon.style.display = "block";
        authLink.textContent = "Logout";
        authLink.href = "#";
        authLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            const logoutAlert = document.createElement("div");
            logoutAlert.className = "alert alert-success";
            logoutAlert.role = "alert";
            logoutAlert.textContent = "You have successfully logged out!";
            document.body.prepend(logoutAlert);
            setTimeout(() => {
                logoutAlert.remove();
                window.location.reload();
            }, 1000);
        });
    } else {
        cartIcon.style.display = "none";
        authLink.textContent = "Login";
        authLink.href = "login.html";
    }
};

checkAuthState();

// select payment pro
if (paymentForm) {
    paymentForm.querySelectorAll(".pay-month, .pay-year").forEach((element) => {

        element.addEventListener("click", () => {
            if (element.classList.contains("pay-month")) {

                document.querySelector(".pay-month").classList.add("selected");
                document.querySelector(".pay-year").classList.remove("selected");
            } else if (element.classList.contains("pay-year")) {
                document.querySelector(".pay-year").classList.add("selected");
                document.querySelector(".pay-month").classList.remove("selected");
            }
        });
    });
}

// reset password
if (forgetForm) {
    forgetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const users = getUsers();

        if (users[email]) {
            const resetAlert = document.createElement("div");
            resetAlert.className = "alert alert-success";
            resetAlert.role = "alert";
            resetAlert.textContent = "Password reset instructions sent to your email!";
            document.body.prepend(resetAlert);
            setTimeout(() => {
                resetAlert.remove();
            }, 2000);
        } else {
            const resetAlert = document.createElement("div");
            resetAlert.className = "alert alert-danger";
            resetAlert.role = "alert";
            resetAlert.textContent = "Email not found!";
            document.body.prepend(resetAlert);
            setTimeout(() => {
                resetAlert.remove();
            }, 2000);
        }
    });
}

// subscribe newsletter
if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address!");
            return;
        }

        const subscribers = getSubscribers();
        
        if (subscribers.includes(email)) {
            const errorAlert = document.createElement("div");
            errorAlert.className = "alert alert-danger";
            errorAlert.role = "alert";
            errorAlert.textContent = "This email is already subscribed to our newsletter!";
            errorAlert.style.position = "fixed";
            errorAlert.style.top = "0";
            errorAlert.style.left = "0";
            errorAlert.style.width = "100%";
            errorAlert.style.zIndex = "9999";
            document.body.prepend(errorAlert);
            setTimeout(() => errorAlert.remove(), 2000);
            return;
        }

        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));

        const successAlert = document.createElement("div");
        successAlert.className = "alert alert-success";
        successAlert.role = "alert";
        successAlert.textContent = "Thank you for subscribing. We will send you the latest updates";
        successAlert.style.position = "fixed";
        successAlert.style.top = "0";
        successAlert.style.left = "0";
        successAlert.style.width = "100%";
        successAlert.style.zIndex = "9999";
        document.body.prepend(successAlert);
        e.target.reset();
        setTimeout(() => successAlert.remove(), 2000);
    });
}

// Handle size selection
let selectedSize = null;

if (sizeButtons.length > 0) {
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            selectedSize = button.textContent.trim();
        });
    });
}

// Handle color selection
let selectedColor = null;

if (colorButtons.length > 0) {
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            colorButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.boxShadow = 'none';
            });
            button.classList.add('active');
            button.style.boxShadow = '0 0 15px 5px rgba(0, 0, 0, 0.2)';

            selectedColor = button.style.backgroundColor;

        });
    });
}

if (btnIncrease && quantityInput) {
    btnIncrease.addEventListener("click", () => {
        let currentValue = parseInt(quantityInput.value) || 0;
        quantityInput.value = currentValue + 1;
    });
}

if (btnDecrease && quantityInput) {
    btnDecrease.addEventListener("click", () => {
        let currentValue = parseInt(quantityInput.value) || 0;
        if (currentValue > 0) {
            quantityInput.value = currentValue - 1;
        }
    });
}

const path = window.location.pathname;
const itemLink = path.substring(path.lastIndexOf('/') + 1);

// add to cart 
if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert("Please login before adding to cart!");
            window.location.href = "login.html";
            return;
        }

        if (!selectedSize) {
            alert("Please select a size!");
            return;
        }
        if (!selectedColor) {
            alert("Please select a color!");
            return;
        }

        const productName = document.querySelector('.product-name').textContent;
        const productPrice = document.querySelector('.product-detail h2').textContent;
        const quantity = quantityInput.value;
        const totalPrice = (parseFloat(productPrice.replace(/[^0-9.]/g, '')) * quantity).toFixed(2);
        const productImage = document.querySelector('.product-detail img').src;

        const product = {
            name: productName,
            price: productPrice,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
            totalPrice: totalPrice,
            itemLink: itemLink,
            productImage: productImage
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingProductIndex = cart.findIndex(item => 
            item.name === product.name && 
            item.size === product.size && 
            item.color === product.color
        );

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity = parseInt(cart[existingProductIndex].quantity) + parseInt(quantity);
            cart[existingProductIndex].totalPrice = (parseFloat(cart[existingProductIndex].price.replace(/[^0-9.]/g, '')) * cart[existingProductIndex].quantity).toFixed(2);
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart successfully!');
    });
}


const displayCart = () => {
    const cartList = document.querySelector('.cart-list');
    const subtotalElement = document.querySelector('#subtotal');
    const shippingElement = document.querySelector('#shipping');
    const totalElement = document.querySelector('#total');

    console.log('Cart List Element:', cartList); // Debug log

    if (!cartList) return;

    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart Data:', cart); // Debug log

    if (cart.length === 0) {
        cartList.innerHTML = '<div class="alert alert-info">Your cart is empty</div>';
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += parseFloat(item.totalPrice);
    });

    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    let cartHTML = '';
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart-items mb-3">
                <a href="${item.itemLink}" class="d-flex align-items-center gap-5">
                    <div class="cart-items-img">
                        <img src="${item.productImage}" alt="${item.name}">
                    </div>
                    <div class="cart-items-info">
                        <h3 class="cart-items-title">
                            ${item.name}
                        </h3>
                        <h5 class="price">
                            $${item.totalPrice}
                        </h5>
                        <p class="text-secondary">Size: ${item.size}</p>
                        <p class="text-secondary d-flex align-items-center">Color: <span style="display: inline-block; width: 20px; border: 1px solid black; margin-left: 8px; height: 20px; background-color: ${item.color}; border-radius: 50%;"></span></p>
                    </div>
                </a>
                <div class="item-actions d-flex align-items-center gap-5">
                    <div class="input-group">
                        <button class="btn btn-outline-secondary btn-decrease" type="button" data-index="${index}">
                            -
                        </button>
                        <input type="text" class="form-control text-center" name="quantity" value="${item.quantity}" readonly />
                        <button class="btn btn-outline-secondary btn-increase" type="button" data-index="${index}">
                            +
                        </button>
                    </div>
                    <i class="fa-solid fa-trash remove-item" data-index="${index}" style="cursor: pointer;"></i>
                </div>
            </div>
        `;
    });

    console.log('Generated HTML:', cartHTML); // Debug log
    cartList.innerHTML = cartHTML;

    // Add event listeners for quantity buttons
    document.querySelectorAll('.btn-decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            updateQuantity(index, -1);
        });
    });

    document.querySelectorAll('.btn-increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            updateQuantity(index, 1);
        });
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            removeFromCart(index);
        });
    });
};

// Update quantity
const updateQuantity = (index, change) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        const newQuantity = parseInt(cart[index].quantity) + change;
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            cart[index].totalPrice = (parseFloat(cart[index].price.replace(/[^0-9.]/g, '')) * newQuantity).toFixed(2);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    }
};

// Remove item
const removeFromCart = (index) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
};

// Call displayCart when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, checking for cart list...'); 
    if (document.querySelector('.cart-list')) {
        console.log('Cart list found, displaying cart...'); // Debug log
        displayCart();
    }
});
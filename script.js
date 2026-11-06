
/* ==========================================
   DRESIA PREMIUM FASHION
   COMPLETE SCRIPT.JS
========================================== */


/* ==========================================
   1. PRODUCT DATABASE
========================================== */

const PRODUCTS = {

    polo: {
        id: "polo",
        name: "Classic Polo Shirt",
        price: 1290,
        category: "men"
    },

    linen: {
        id: "linen",
        name: "Premium Linen Shirt",
        price: 2490,
        category: "men"
    },

    dress: {
        id: "dress",
        name: "Elegant Evening Dress",
        price: 3490,
        category: "women"
    },

    jacket: {
        id: "jacket",
        name: "Signature Jacket",
        price: 4990,
        category: "men"
    }

};


/* ==========================================
   2. CART SYSTEM
========================================== */

const CART_KEY = "dresia_cart";

let cart = [];

try {

    cart = JSON.parse(
        localStorage.getItem(CART_KEY)
    ) || [];

    if (!Array.isArray(cart)) {
        cart = [];
    }

} catch (error) {

    cart = [];

}


/* ==========================================
   3. DOM ELEMENTS
========================================== */

const cartCountElement =
    document.getElementById("count");

const cartItemsElement =
    document.getElementById("items");

const cartTotalElement =
    document.getElementById("total");

const cartDrawer =
    document.getElementById("drawer");

const cartOverlay =
    document.getElementById("overlay");

const cartCloseButton =
    document.getElementById("close");

const toastElement =
    document.getElementById("toast");

const menuButton =
    document.getElementById("menu");

const navMenu =
    document.getElementById("nav");

const searchButton =
    document.getElementById("search-btn");

const searchContainer =
    document.getElementById("search-container");

const searchInput =
    document.getElementById("search");


/* ==========================================
   4. PRICE FORMAT
========================================== */

function formatPrice(price) {

    return "৳" + Number(price).toLocaleString("en-BD");

}


/* ==========================================
   5. CART SAVE
========================================== */

function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* ==========================================
   6. CART CALCULATIONS
========================================== */

function getCartSubtotal() {

    return cart.reduce((total, item) => {

        return total +
            (Number(item.price) * Number(item.quantity));

    }, 0);

}


function getCartQuantity() {

    return cart.reduce((total, item) => {

        return total + Number(item.quantity);

    }, 0);

}


/* ==========================================
   7. TOAST NOTIFICATION
========================================== */

let toastTimer;

function showToast(message) {

    if (!toastElement) return;

    toastElement.textContent = message;

    toastElement.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toastElement.classList.remove("show");

    }, 2500);

}


/* ==========================================
   8. ADD TO CART
========================================== */

function addToCart(productId) {

    const product = PRODUCTS[productId];

    if (!product) {

        showToast("Product not found!");

        return;

    }

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1

        });

    }

    saveCart();

    renderCart();

    showToast(
        product.name + " added to bag!"
    );

}


/* ==========================================
   9. REMOVE CART ITEM
========================================== */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    renderCart();

    showToast("Product removed from bag!");

}


/* ==========================================
   10. CHANGE QUANTITY
========================================== */

function changeQuantity(productId, change) {

    const item = cart.find(
        item => item.id === productId
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }

    saveCart();

    renderCart();

}


/* ==========================================
   11. ESCAPE HTML
========================================== */

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"

    })[character]);

}


/* ==========================================
   12. RENDER CART
========================================== */

function renderCart() {

    /* CART COUNT */

    if (cartCountElement) {

        cartCountElement.textContent =
            getCartQuantity();

    }


    /* CART TOTAL */

    if (cartTotalElement) {

        cartTotalElement.textContent =
            formatPrice(getCartSubtotal());

    }


    /* CART ITEMS */

    if (!cartItemsElement) return;


    if (cart.length === 0) {

        cartItemsElement.innerHTML = `
            <p style="color:#888;text-align:center;padding:35px 0;">
                Your bag is empty.
            </p>
        `;

        return;

    }


    cartItemsElement.innerHTML = cart.map(item => `

        <div class="cart-item">

            <div class="cart-item-info">

                <h4>
                    ${escapeHTML(item.name)}
                </h4>

                <p>
                    ${formatPrice(item.price)}
                </p>

                <div class="cart-quantity">

                    <button
                        data-qty="-1"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="Decrease quantity">
                        −
                    </button>

                    <span>
                        ${Number(item.quantity)}
                    </span>

                    <button
                        data-qty="1"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="Increase quantity">
                        +
                    </button>

                </div>

                <button
                    class="cart-remove"
                    data-remove="${escapeHTML(item.id)}">

                    REMOVE

                </button>

            </div>

            <strong>
                ${formatPrice(
                    Number(item.price) *
                    Number(item.quantity)
                )}
            </strong>

        </div>

    `).join("");

}


/* ==========================================
   13. OPEN CART
========================================== */

function openCart() {

    if (cartDrawer) {

        cartDrawer.classList.add("active");

    }

    if (cartOverlay) {

        cartOverlay.classList.add("active");

    }

    document.body.style.overflow = "hidden";

}


/* ==========================================
   14. CLOSE CART
========================================== */

function closeCart() {

    if (cartDrawer) {

        cartDrawer.classList.remove("active");

    }

    if (cartOverlay) {

        cartOverlay.classList.remove("active");

    }

    document.body.style.overflow = "";

}


/* ==========================================
   15. CART BUTTON
========================================== */

document.querySelectorAll(".nav-bag").forEach(button => {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        openCart();

    });

});


/* CLOSE BUTTON */

if (cartCloseButton) {

    cartCloseButton.addEventListener(
        "click",
        closeCart
    );

}


/* OVERLAY CLICK */

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


/* ESCAPE KEY */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeCart();

    }

});


/* ==========================================
   16. ADD TO BAG BUTTONS
========================================== */

document.querySelectorAll("[data-add]").forEach(button => {

    button.addEventListener("click", function() {

        const productId = this.dataset.add;

        addToCart(productId);

    });

});


/* ==========================================
   17. CART QUANTITY & REMOVE
========================================== */

if (cartItemsElement) {

    cartItemsElement.addEventListener(
        "click",
        function(event) {

            const quantityButton =
                event.target.closest("[data-qty]");

            const removeButton =
                event.target.closest("[data-remove]");


            /* QUANTITY */

            if (quantityButton) {

                const productId =
                    quantityButton.dataset.id;

                const change =
                    Number(quantityButton.dataset.qty);

                changeQuantity(productId, change);

            }


            /* REMOVE */

            if (removeButton) {

                const productId =
                    removeButton.dataset.remove;

                removeFromCart(productId);

            }

        }
    );

}


/* ==========================================
   18. MOBILE NAVIGATION
========================================== */

if (menuButton && navMenu) {

    menuButton.addEventListener("click", function() {

        navMenu.classList.toggle("active");

        const isOpen =
            navMenu.classList.contains("active");

        menuButton.textContent =
            isOpen ? "✕" : "☰";

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    /* CLOSE AFTER LINK CLICK */

    navMenu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function() {

            navMenu.classList.remove("active");

            menuButton.textContent = "☰";

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* ==========================================
   19. HEADER SCROLL SHRINK
========================================== */

const luxHeader =
    document.getElementById("luxHeader");

function updateHeaderScroll() {

    if (!luxHeader) return;

    luxHeader.classList.toggle(
        "scrolled",
        window.scrollY > 50
    );

}

window.addEventListener(
    "scroll",
    updateHeaderScroll,
    { passive: true }
);

updateHeaderScroll();


/* ==========================================
   20. SEARCH TOGGLE
========================================== */

if (searchButton && searchContainer) {

    searchButton.addEventListener("click", function() {

        searchContainer.classList.toggle("active");

        if (searchContainer.classList.contains("active")) {

            searchInput?.focus();

        }

    });

}


/* ==========================================
   21. PRODUCT SEARCH
========================================== */

if (searchInput) {

    searchInput.addEventListener("input", function() {

        const query =
            this.value.trim().toLowerCase();

        document.querySelectorAll(".product-card")
            .forEach(card => {

                const name =
                    card.dataset.name?.toLowerCase() || "";

                const category =
                    card.dataset.cat?.toLowerCase() || "";

                const visible =
                    name.includes(query) ||
                    category.includes(query);

                card.style.display =
                    visible ? "" : "none";

            });

    });

}


/* ==========================================
   22. PRODUCT CATEGORY FILTER
========================================== */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const productCards =
    document.querySelectorAll(".product-card");

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        this.classList.add("active");

        const filter =
            this.dataset.filter;

        productCards.forEach(card => {

            const category =
                card.dataset.cat;

            const visible =
                filter === "all" ||
                category === filter;

            card.style.display =
                visible ? "" : "none";

        });

        /* Reset search */

        if (searchInput) {

            searchInput.value = "";

        }

    });

});


/* ==========================================
   23. NEWSLETTER DEMO
========================================== */

const newsletterForm =
    document.getElementById("newsletter-form");

if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const emailInput =
                document.getElementById("newsletter-email");

            const message =
                document.getElementById("newsletter-message");

            if (message) {

                message.textContent =
                    "Thank you for joining DRESIA!";

            }

            newsletterForm.reset();

        }
    );

}


/* ==========================================
   24. FOOTER YEAR
========================================== */

const yearElement =
    document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* ==========================================
   25. INITIALIZE CART
========================================== */

renderCart();

console.log(
    "DRESIA Premium Fashion Website Initialized."
);

document.addEventListener("click", function (e) {
    const button = e.target.closest("[data-add]");

    if (!button) return;

    const productId = button.dataset.add;

    if (typeof PRODUCTS !== "undefined" && PRODUCTS[productId]) {
        addToCart(productId);
    } else {
        console.error("Product not found:", productId);
    }
});
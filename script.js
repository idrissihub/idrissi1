// Global Variables
let currentFeaturedSlide = 0;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let featuredProducts = [];
let currentFilter = 'all';
let productsPerPage = 8;
let currentPage = 1;

// Product Data
const productData = [
    {
        id: 1,
        title: "Wireless Headphones",
        description: "Premium wireless headphones with noise cancellation technology.",
        price: 1999.99,
        discountPrice: 1499.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        category: "electronics",
        featured: true
    },
    {
        id: 2,
        title: "Smartphone X",
        description: "Latest smartphone with advanced camera and long battery life.",
        price: 8999.99,
        discountPrice: 7999.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        category: "electronics"
    },
    {
        id: 3,
        title: "Men's Casual Shirt",
        description: "Comfortable cotton shirt perfect for casual occasions.",
        price: 499.99,
        discountPrice: 399.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        category: "clothing",
        featured: true
    },
    {
        id: 4,
        title: "Women's Summer Dress",
        description: "Elegant summer dress made from lightweight fabric.",
        price: 799.99,
        discountPrice: 599.99,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
        category: "clothing"
    },
    {
        id: 5,
        title: "Coffee Maker",
        description: "Automatic coffee maker with timer and multiple brewing options.",
        price: 1299.99,
        discountPrice: 999.99,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
        category: "home-kitchen",
        featured: true
    },
    {
        id: 6,
        title: "Blender Set",
        description: "High-powered blender with multiple attachments for various uses.",
        price: 899.99,
        discountPrice: 699.99,
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
        category: "home-kitchen"
    },
    {
        id: 7,
        title: "Skincare Set",
        description: "Complete skincare routine with cleanser, toner, and moisturizer.",
        price: 599.99,
        discountPrice: 499.99,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
        category: "beauty"
    },
    {
        id: 8,
        title: "Makeup Palette",
        description: "Professional makeup palette with a variety of colors.",
        price: 399.99,
        discountPrice: 299.99,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
        category: "beauty",
        featured: true
    },
    {
        id: 9,
        title: "Gaming Laptop",
        description: "High-performance gaming laptop with RGB keyboard.",
        price: 12999.99,
        discountPrice: 10999.99,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
        category: "electronics"
    },
    {
        id: 10,
        title: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 299.99,
        discountPrice: 249.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        category: "electronics"
    },
    {
        id: 11,
        title: "Men's Jeans",
        description: "Classic fit denim jeans in dark wash.",
        price: 699.99,
        discountPrice: 549.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
        category: "clothing"
    },
    {
        id: 12,
        title: "Women's Sneakers",
        description: "Comfortable running sneakers with cushioned sole.",
        price: 899.99,
        discountPrice: 749.99,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        category: "clothing"
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    products = productData;
    featuredProducts = products.filter(product => product.featured);
    
    initializeCarousel();
    initializeFeaturedSlider();
    loadProducts();
    updateCartUI();
    initializeNavigation();
    
    // Auto-play featured slider
    setInterval(nextFeaturedSlide, 6000);
});

// Navigation
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Carousel Functions
let currentSlide = 0; // Moved here to avoid redeclaration

function initializeCarousel() {
    showSlide(currentSlide);
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= 3) currentSlide = 0;
    if (currentSlide < 0) currentSlide = 2;
    showSlide(currentSlide);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[n].classList.add('active');
    dots[n].classList.add('active');
}

function nextSlide() {
    changeSlide(1);
}

// Scroll to section function for carousel buttons
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Featured Slider Functions
function initializeFeaturedSlider() {
    showFeaturedSlide(currentFeaturedSlide);
    generateFeaturedDots();
}

function changeFeaturedSlide(direction) {
    currentFeaturedSlide += direction;
    if (currentFeaturedSlide >= featuredProducts.length) currentFeaturedSlide = 0;
    if (currentFeaturedSlide < 0) currentFeaturedSlide = featuredProducts.length - 1;
    showFeaturedSlide(currentFeaturedSlide);
}

function showFeaturedSlide(n) {
    const product = featuredProducts[n];
    const slideContainer = document.getElementById('featured-slide');
    
    const discountPercentage = product.discountPrice ? 
        Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
    
    slideContainer.innerHTML = `
        <div class="featured-image">
            <img src="${product.image}" alt="${product.title}">
            ${product.discountPrice ? `<div class="discount-badge">${discountPercentage}% OFF</div>` : ''}
        </div>
        <div class="featured-content">
            <div class="featured-badge">Featured Product</div>
            <h3 class="featured-title">${product.title}</h3>
            <div class="featured-rating">
                <div class="stars">★★★★★</div>
                <span>(4.8/5 - 124 reviews)</span>
            </div>
            <p class="featured-description">${product.description}</p>
            <div class="featured-price">
                ${product.discountPrice ? 
                    `<span class="price-current">${product.discountPrice.toFixed(2)} DH</span>
                     <span class="price-original">${product.price.toFixed(2)} DH</span>` :
                    `<span class="price-current">${product.price.toFixed(2)} DH</span>`
                }
            </div>
            <div class="featured-actions">
                <button class="btn-primary" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
                <button class="btn-secondary" onclick="viewProduct(${product.id})">
                    View Details
                </button>
            </div>
        </div>
    `;
    
    updateFeaturedDots();
}

function generateFeaturedDots() {
    const dotsContainer = document.getElementById('featured-dots');
    dotsContainer.innerHTML = '';
    
    featuredProducts.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'featured-dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => {
            currentFeaturedSlide = index;
            showFeaturedSlide(currentFeaturedSlide);
        };
        dotsContainer.appendChild(dot);
    });
}

function updateFeaturedDots() {
    const dots = document.querySelectorAll('.featured-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentFeaturedSlide);
    });
}

function nextFeaturedSlide() {
    changeFeaturedSlide(1);
}

// Product Functions
function loadProducts() {
    const filteredProducts = currentFilter === 'all' ? 
        products : products.filter(product => product.category === currentFilter);
    
    const startIndex = 0;
    const endIndex = currentPage * productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    displayProducts(productsToShow);
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (endIndex >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('products-grid');
    
    if (currentPage === 1) {
        productsGrid.innerHTML = '';
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in-up';
    
    const discountPercentage = product.discountPrice ? 
        Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
            ${product.discountPrice ? `<div class="discount-badge">${discountPercentage}% OFF</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <div>
                    ${product.discountPrice ? 
                        `<span class="price-current">${product.discountPrice.toFixed(2)} DH</span>
                         <span class="price-original">${product.price.toFixed(2)} DH</span>` :
                        `<span class="price-current">${product.price.toFixed(2)} DH</span>`
                    }
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

function filterProducts(category) {
    currentFilter = category;
    currentPage = 1;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadProducts();
}

function loadMoreProducts() {
    currentPage++;
    loadProducts();
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast('Product removed from cart!', 'success');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${(item.discountPrice || item.price).toFixed(2)} DH</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
    cartTotal.textContent = `${total.toFixed(2)} DH`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
}

function goToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Store cart data for checkout page
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function viewProduct(productId) {
    // Store product ID for product page
    localStorage.setItem('viewProductId', productId);
    window.location.href = 'product.html';
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements when they're added to the DOM
function observeElements() {
    document.querySelectorAll('.product-card, .category-card').forEach(el => {
        observer.observe(el);
    });
}

// Call observe elements after products are loaded
setTimeout(observeElements, 100);
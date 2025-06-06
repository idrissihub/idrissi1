// Global Variables
let currentSlide = 0;
let currentFeaturedSlide = 0;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let featuredProducts = [];
let currentFilter = 'all';
let productsPerPage = 8;
let currentPage = 1;
let isAutoPlaying = true;
let featuredAutoPlay = true;

// Enhanced Product Data with better images
const productData = [
    {
        id: 1,
        title: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with active noise cancellation and premium sound quality.",
        price: 1999.99,
        discountPrice: 1499.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
        category: "electronics",
        featured: true,
        rating: 4.8,
        reviews: 124
    },
    {
        id: 2,
        title: "Latest Smartphone Pro",
        description: "Cutting-edge smartphone with advanced camera system and lightning-fast performance.",
        price: 8999.99,
        discountPrice: 7999.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&q=80",
        category: "electronics",
        rating: 4.9,
        reviews: 89
    },
    {
        id: 3,
        title: "Designer Casual Shirt",
        description: "Premium cotton shirt with modern fit, perfect for both casual and semi-formal occasions.",
        price: 499.99,
        discountPrice: 399.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80",
        category: "clothing",
        featured: true,
        rating: 4.6,
        reviews: 67
    },
    {
        id: 4,
        title: "Elegant Summer Dress",
        description: "Flowing summer dress made from breathable fabric, perfect for warm weather styling.",
        price: 799.99,
        discountPrice: 599.99,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop&q=80",
        category: "clothing",
        rating: 4.7,
        reviews: 92
    },
    {
        id: 5,
        title: "Smart Coffee Maker",
        description: "Programmable coffee maker with built-in grinder and smartphone connectivity.",
        price: 1299.99,
        discountPrice: 999.99,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop&q=80",
        category: "home-kitchen",
        featured: true,
        rating: 4.5,
        reviews: 156
    },
    {
        id: 6,
        title: "Professional Blender Set",
        description: "High-powered blender with multiple attachments for smoothies, soups, and more.",
        price: 899.99,
        discountPrice: 699.99,
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=500&fit=crop&q=80",
        category: "home-kitchen",
        rating: 4.4,
        reviews: 78
    },
    {
        id: 7,
        title: "Luxury Skincare Set",
        description: "Complete skincare routine with premium ingredients for radiant, healthy skin.",
        price: 599.99,
        discountPrice: 499.99,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop&q=80",
        category: "beauty",
        rating: 4.8,
        reviews: 203
    },
    {
        id: 8,
        title: "Professional Makeup Palette",
        description: "Artist-quality makeup palette with vibrant colors and long-lasting formula.",
        price: 399.99,
        discountPrice: 299.99,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop&q=80",
        category: "beauty",
        featured: true,
        rating: 4.9,
        reviews: 145
    },
    {
        id: 9,
        title: "Gaming Laptop Pro",
        description: "High-performance gaming laptop with RGB keyboard and advanced cooling system.",
        price: 12999.99,
        discountPrice: 10999.99,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop&q=80",
        category: "electronics",
        rating: 4.7,
        reviews: 56
    },
    {
        id: 10,
        title: "Ergonomic Wireless Mouse",
        description: "Precision wireless mouse with ergonomic design for comfortable all-day use.",
        price: 299.99,
        discountPrice: 249.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&q=80",
        category: "electronics",
        rating: 4.3,
        reviews: 89
    },
    {
        id: 11,
        title: "Premium Denim Jeans",
        description: "Classic fit premium denim jeans with superior comfort and durability.",
        price: 699.99,
        discountPrice: 549.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&q=80",
        category: "clothing",
        rating: 4.5,
        reviews: 112
    },
    {
        id: 12,
        title: "Athletic Running Sneakers",
        description: "Performance running sneakers with advanced cushioning and breathable design.",
        price: 899.99,
        discountPrice: 749.99,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&q=80",
        category: "clothing",
        rating: 4.6,
        reviews: 134
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
    initializeIntersectionObserver();
    
    // Auto-play carousel
    setInterval(() => {
        if (isAutoPlaying) {
            nextSlide();
        }
    }, 5000);
    
    // Auto-play featured slider
    setInterval(() => {
        if (featuredAutoPlay) {
            nextFeaturedSlide();
        }
    }, 6000);
    
    // Initialize animations
    animateOnScroll();
});

// Navigation Functions
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
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
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// Carousel Functions
function initializeCarousel() {
    showSlide(currentSlide);
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= 3) currentSlide = 0;
    if (currentSlide < 0) currentSlide = 2;
    showSlide(currentSlide);
    
    // Pause auto-play temporarily
    isAutoPlaying = false;
    setTimeout(() => {
        isAutoPlaying = true;
    }, 10000);
}

function currentSlide(n) {
    currentSlide = n - 1;
    showSlide(currentSlide);
    
    // Pause auto-play temporarily
    isAutoPlaying = false;
    setTimeout(() => {
        isAutoPlaying = true;
    }, 10000);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    if (slides[n]) slides[n].classList.add('active');
    if (indicators[n]) indicators[n].classList.add('active');
}

function nextSlide() {
    changeSlide(1);
}

// Scroll to section function
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
    if (featuredProducts.length > 0) {
        showFeaturedSlide(currentFeaturedSlide);
    }
}

function changeFeaturedSlide(direction) {
    if (featuredProducts.length === 0) return;
    
    currentFeaturedSlide += direction;
    if (currentFeaturedSlide >= featuredProducts.length) currentFeaturedSlide = 0;
    if (currentFeaturedSlide < 0) currentFeaturedSlide = featuredProducts.length - 1;
    showFeaturedSlide(currentFeaturedSlide);
    
    // Pause auto-play temporarily
    featuredAutoPlay = false;
    setTimeout(() => {
        featuredAutoPlay = true;
    }, 10000);
}

function showFeaturedSlide(n) {
    if (featuredProducts.length === 0) return;
    
    const product = featuredProducts[n];
    const slideContainer = document.getElementById('featured-slider');
    
    if (!slideContainer) return;
    
    const discountPercentage = product.discountPrice ? 
        Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
    
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    slideContainer.innerHTML = `
        <div class="featured-slide active">
            <div class="featured-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                ${product.discountPrice ? `<div class="discount-badge">${discountPercentage}% OFF</div>` : ''}
            </div>
            <div class="featured-content">
                <div class="featured-badge">Featured Product</div>
                <h3 class="featured-title">${product.title}</h3>
                <div class="featured-rating">
                    <div class="stars">${stars}</div>
                    <span>(${product.rating}/5 - ${product.reviews} reviews)</span>
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
                        <i class="fas fa-shopping-bag"></i>
                        <span>Add to Cart</span>
                    </button>
                    <button class="btn-secondary" onclick="viewProduct(${product.id})">
                        <span>View Details</span>
                    </button>
                </div>
            </div>
        </div>
    `;
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
    if (loadMoreBtn) {
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
}

function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    if (currentPage === 1) {
        productsGrid.innerHTML = '';
    }
    
    productsToShow.forEach((product, index) => {
        const productCard = createProductCard(product);
        productCard.style.animationDelay = `${index * 0.1}s`;
        productsGrid.appendChild(productCard);
    });
    
    // Trigger animations
    setTimeout(() => {
        const newCards = productsGrid.querySelectorAll('.product-card:not(.animated)');
        newCards.forEach(card => {
            card.classList.add('fade-in-up', 'animated');
        });
    }, 100);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discountPercentage = product.discountPrice ? 
        Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
    
    const stars = '★'.repeat(Math.floor(product.rating || 4.5));
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            ${product.discountPrice ? `<div class="discount-badge">${discountPercentage}% OFF</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating" style="color: #fbbf24; font-size: 0.875rem; margin-bottom: 0.75rem;">
                ${stars} (${product.rating || 4.5})
            </div>
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
                <i class="fas fa-shopping-bag"></i>
                <span>Add to Cart</span>
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
    
    // Find and activate the clicked button
    const clickedBtn = event ? event.target : document.querySelector(`[onclick="filterProducts('${category}')"]`);
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
    
    loadProducts();
    
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    
    // Add visual feedback
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
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
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.add('show');
        } else {
            cartCount.classList.remove('show');
        }
    }
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align: center; padding: 3rem 2rem; color: #666;">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Your cart is empty</p>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">Add some products to get started</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${(item.discountPrice || item.price).toFixed(2)} DH</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
    const total = subtotal; // No tax for now
    
    if (cartSubtotal) cartSubtotal.textContent = `${subtotal.toFixed(2)} DH`;
    if (cartTotal) cartTotal.textContent = `${total.toFixed(2)} DH`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
        
        // Prevent body scroll when cart is open
        if (cartSidebar.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
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
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function viewProduct(productId) {
    // Store product ID for product page
    localStorage.setItem('viewProductId', productId);
    window.location.href = 'product.html';
}

// Animation Functions
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements when they're added to the DOM
    const observeElements = () => {
        document.querySelectorAll('.category-card, .stat-item, .feature-item').forEach(el => {
            if (!el.classList.contains('fade-in-up')) {
                observer.observe(el);
            }
        });
    };

    // Initial observation
    setTimeout(observeElements, 100);
    
    // Re-observe when new content is added
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

function animateOnScroll() {
    const animateElements = document.querySelectorAll('.stat-item, .category-card, .feature-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => observer.observe(el));
}

// Newsletter Subscription
function subscribeNewsletter() {
    const input = document.querySelector('.newsletter-input');
    if (!input || !input.value.trim()) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate subscription
    showToast('Thank you for subscribing!', 'success');
    input.value = '';
}

// Add event listener for newsletter
document.addEventListener('DOMContentLoaded', function() {
    const newsletterBtn = document.querySelector('.newsletter-btn');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', subscribeNewsletter);
    }
    
    const newsletterInput = document.querySelector('.newsletter-input');
    if (newsletterInput) {
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                subscribeNewsletter();
            }
        });
    }
});

// Search Functionality
function initializeSearch() {
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            // Create search modal or redirect to search page
            showToast('Search functionality coming soon!', 'info');
        });
    }
}

// Performance Optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Initialize search and lazy loading
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    lazyLoadImages();
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Close cart with Escape key
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
    
    // Navigate carousel with arrow keys
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = document.createElement('script');
    smoothScrollPolyfill.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(smoothScrollPolyfill);
}

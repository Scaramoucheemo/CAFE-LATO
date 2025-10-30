// ===================================
// CAFELATO PREMIUM - MAIN JAVASCRIPT
// ===================================

// ===================
// DATA
// ===================
const productsData = [
    {
        id: 1,
        name: "Latte",
        description: "Espresso suave con leche vaporizada y arte latte en forma de corazón. Perfecto para comenzar tu día con amor.",
        price: 65,
        emoji: "☕",
        category: "caliente",
        popular: true
    },
    {
        id: 2,
        name: "Cappuccino Cloud",
        description: "Espresso intenso con espuma de leche cremosa como una nube esponjosa.",
        price: 70,
        emoji: "☁️",
        category: "caliente",
        popular: true
    },
    {
        id: 3,
        name: "Mocha Dream",
        description: "Chocolate belga premium con espresso doble y crema batida con chispas de chocolate.",
        price: 75,
        emoji: "🍫",
        category: "caliente"
    },
    {
        id: 4,
        name: "Caramel Bliss",
        description: "Latte dulce con caramelo artesanal casero y un toque de vainilla de Madagascar.",
        price: 80,
        emoji: "🍮",
        category: "caliente"
    },
    {
        id: 5,
        name: "Matcha Magic",
        description: "Té verde matcha ceremonial japonés con leche de almendra orgánica.",
        price: 85,
        emoji: "🍵",
        category: "especial",
        popular: true
    },
    {
        id: 6,
        name: "Iced Unicorn",
        description: "Café frío mágico con jarabe de vainilla y topping de crema arcoíris comestible.",
        price: 90,
        emoji: "🦄",
        category: "frio",
        nuevo: true
    },
    {
        id: 7,
        name: "Frapé Strawberry",
        description: "Bebida helada con fresas frescas orgánicas, crema batida y salsa de fresa natural.",
        price: 85,
        emoji: "🍓",
        category: "frio"
    },
    {
        id: 8,
        name: "Americano Star",
        description: "Espresso doble diluido con agua caliente filtrada. El clásico perfecto.",
        price: 55,
        emoji: "⭐",
        category: "caliente"
    },
    {
        id: 9,
        name: "Chai Latte Love",
        description: "Té chai especiado con leche cremosa, canela de Ceilán y cardamomo.",
        price: 70,
        emoji: "💖",
        category: "especial"
    },
    {
        id: 10,
        name: "Cold Brew Moon",
        description: "Café de extracción en frío de 18 horas con notas de chocolate y avellana.",
        price: 75,
        emoji: "🌙",
        category: "frio",
        popular: true
    },
    {
        id: 11,
        name: "Espresso Shot",
        description: "Shot doble de espresso premium para los verdaderos amantes del café.",
        price: 45,
        emoji: "💥",
        category: "caliente"
    },
    {
        id: 12,
        name: "Pink Latte",
        description: "Latte con betabel natural, hermoso y saludable. Instagram-worthy!",
        price: 80,
        emoji: "🌸",
        category: "especial",
        nuevo: true
    },
    {
        id: 13,
        name: "Brownie Fudge",
        description: "Brownie de chocolate belga con nueces y helado de vainilla.",
        price: 95,
        emoji: "🍰",
        category: "postres",
        popular: true
    },
    {
        id: 14,
        name: "Cheesecake Matcha",
        description: "Cheesecake suave con topping de matcha y crema de mascarpone.",
        price: 105,
        emoji: "🍵",
        category: "postres"
    },
    {
        id: 15,
        name: "Tiramisu Heaven",
        description: "Tiramisú clásico italiano con café espresso y cacao en polvo.",
        price: 110,
        emoji: "☕",
        category: "postres"
    },
    {
        id: 16,
        name: "Mochi Ice Cream",
        description: "Helado envuelto en mochi suave. Sabores: fresa, matcha y vainilla.",
        price: 75,
        emoji: "🍡",
        category: "postres"
    }
];

// Cupones válidos
const validCoupons = {
    'WELCOME10': { discount: 10, type: 'percentage' },
    'CAFE20': { discount: 20, type: 'percentage' },
    'FIRST50': { discount: 50, type: 'fixed' }
};

// ===================
// ESTADO GLOBAL
// ===================
let cart = [];
let favorites = [];
let currentFilter = 'all';
let currentTheme = 'light';
let appliedCoupon = null;

// ===================
// INICIALIZACIÓN
// ===================
document.addEventListener('DOMContentLoaded', function() {
    showPageLoader();
    setTimeout(() => {
        hidePageLoader();
        initializeApp();
    }, 1500);
});

function initializeApp() {
    renderProducts();
    setupEventListeners();
    setupIntersectionObserver();
    updateCartUI();
    applyTheme();
}

// ===================
// PAGE LOADER
// ===================
function showPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.remove('hidden');
}

function hidePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hidden');
}

// ===================
// THEME
// ===================
function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    showToast('success', 'Tema actualizado', `Modo ${currentTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
}

// ===================
// RENDERIZADO DE PRODUCTOS
// ===================
function renderProducts(filter = 'all', searchTerm = '') {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;

    let filtered = productsData;

    if (filter !== 'all') {
        filtered = filtered.filter(p => p.category === filter);
    }

    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filtered.length === 0) {
        grid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    } else {
        grid.style.display = 'grid';
        if (noResults) noResults.style.display = 'none';
    }

    grid.innerHTML = '';
    filtered.forEach((product, index) => {
        const card = createProductCard(product, index);
        grid.appendChild(card);
    });
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', `${index * 50}`);

    const isFavorite = favorites.includes(product.id);
    const badge = product.nuevo ? 'Nuevo' : product.popular ? 'Popular' : '';

    card.innerHTML = `
        <div class="product-image">
            <div class="product-emoji">${product.emoji}</div>
            ${badge ? `<span class="product-badge">${badge}</span>` : ''}
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                ${isFavorite ? '❤️' : '🤍'}
            </button>
        </div>
        <div class="product-content">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Agregar +
                </button>
            </div>
        </div>
    `;

    return card;
}

function getCategoryName(category) {
    const names = {
        'caliente': '☕ Caliente',
        'frio': '🧊 Frío',
        'especial': '✨ Especial',
        'postres': '🍰 Postre'
    };
    return names[category] || category;
}

// ===================
// FILTROS Y BÚSQUEDA
// ===================
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            const searchTerm = document.getElementById('searchInput')?.value || '';
            renderProducts(currentFilter, searchTerm);
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderProducts(currentFilter, e.target.value);
        });
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    currentFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
    });
    renderProducts();
}

// ===================
// FAVORITOS
// ===================
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('info', 'Eliminado', 'Producto quitado de favoritos');
    } else {
        favorites.push(productId);
        showToast('success', '¡Favorito!', 'Producto agregado a favoritos');
    }
    renderProducts(currentFilter, document.getElementById('searchInput')?.value || '');
}

// ===================
// CARRITO
// ===================
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
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

    updateCartUI();
    showToast('success', '¡Agregado!', `${product.name} agregado al carrito`);
    
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.style.animation = 'none';
        setTimeout(() => {
            cartBtn.style.animation = 'bounce 0.5s ease';
        }, 10);
    }
}

function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCart();
    if (product) {
        showToast('info', 'Eliminado', `${product.name} eliminado del carrito`);
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        renderCart();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartTotalBadge = document.getElementById('cartTotalBadge');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = calculateSubtotal();

    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotalBadge) cartTotalBadge.textContent = `$${totalPrice}`;
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateDiscount() {
    if (!appliedCoupon) return 0;

    const coupon = validCoupons[appliedCoupon];
    if (!coupon) return 0;

    const subtotal = calculateSubtotal();

    if (coupon.type === 'percentage') {
        return (subtotal * coupon.discount) / 100;
    } else {
        return Math.min(coupon.discount, subtotal);
    }
}

function calculateTotal() {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const discountRow = document.getElementById('discountRow');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('cartTotal');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega productos deliciosos para comenzar!</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (discountRow) discountRow.style.display = 'none';
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} c/u</div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <strong style="color: var(--primary);">$${item.price * item.quantity}</strong>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
        `;
        cartItems.appendChild(cartItem);
    });

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const total = calculateTotal();

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    if (discount > 0 && discountRow && discountEl) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-$${discount.toFixed(2)}`;
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }

    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function applyCoupon() {
    const input = document.getElementById('couponInput');
    if (!input) return;

    const code = input.value.trim().toUpperCase();

    if (!code) {
        showToast('error', 'Error', 'Por favor ingresa un código de cupón');
        return;
    }

    if (validCoupons[code]) {
        appliedCoupon = code;
        const coupon = validCoupons[code];
        const discountText = coupon.type === 'percentage' 
            ? `${coupon.discount}%` 
            : `$${coupon.discount}`;
        showToast('success', '¡Cupón aplicado!', `Descuento de ${discountText} aplicado`);
        renderCart();
        input.value = '';
    } else {
        showToast('error', 'Cupón inválido', 'El código ingresado no es válido');
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('error', 'Carrito vacío', 'Agrega productos antes de finalizar la compra');
        return;
    }

    const total = calculateTotal();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    showToast('success', '¡Pedido confirmado! 🎉', 
        `Total: $${total.toFixed(2)} | Productos: ${itemCount}`);

    cart = [];
    appliedCoupon = null;
    updateCartUI();
    renderCart();

    setTimeout(() => {
        closeCart();
    }, 2000);
}

// ===================
// MODAL DEL CARRITO
// ===================
function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('active');
        renderCart();
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================
// NAVEGACIÓN
// ===================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            document.getElementById('navLinks')?.classList.remove('active');
            document.getElementById('mobileMenuToggle')?.classList.remove('active');
        });
    });

    let lastScroll = 0;
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar?.classList.add('hidden');
        } else {
            navbar?.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });
}

// ===================
// MOBILE MENU
// ===================
function setupMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// ===================
// FORMULARIOS
// ===================
function setupForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('success', '¡Mensaje enviado!', 'Te responderemos pronto. Gracias por contactarnos.');
            contactForm.reset();
        });
    }

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('success', '¡Suscrito!', 'Gracias por suscribirte al newsletter');
            newsletterForm.reset();
        });
    }
}

// ===================
// SCROLL TO TOP
// ===================
function setupScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================
// TOAST NOTIFICATIONS
// ===================
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || '📌'}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ===================
// INTERSECTION OBSERVER
// ===================
function setupIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ===================
// EVENT LISTENERS
// ===================
function setupEventListeners() {
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('closeCart')?.addEventListener('click', closeCart);
    document.querySelector('.cart-modal-overlay')?.addEventListener('click', closeCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
    document.getElementById('continueShopping')?.addEventListener('click', closeCart);
    document.getElementById('applyCoupon')?.addEventListener('click', applyCoupon);

    setupNavigation();
    setupMobileMenu();
    setupFilters();
    setupForms();
    setupScrollToTop();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
}

console.log('%c🎉 CafeLato Premium Loaded! ☕', 'color: #FF8BA0; font-size: 20px; font-weight: bold;');
console.log('%cCupones: WELCOME10, CAFE20, FIRST50', 'color: #C9A0DC; font-size: 14px;');
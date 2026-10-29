/**
 * LUZEN - Catálogo Oficial de Camisetas
 * Lógica interactiva para filtros, búsqueda, carrito y estado del catálogo.
 */

// Array de productos listo para recibir las camisetas en el próximo paso
// Tal como solicitaste: "no agregues las camisetas, eso lo hacemos despues"
const PRODUCTS = [
  /* 
  Estructura lista para cargar:
  {
    id: 'argentina-local-2024',
    title: 'Argentina Local 2024',
    category: 'selecciones',
    price: '$ 49.999',
    priceNum: 49999,
    image: 'assets/images/jerseys/argentina_local_2024.png',
    inStock: true
  }
  */
];

// Categorías del catálogo según el mockup
const CATEGORIES = [
  { id: 'todos', name: 'Todos' },
  { id: 'selecciones', name: 'Selecciones' },
  { id: 'clubes-europeos', name: 'Clubes Europeos' },
  { id: 'clubes-argentinos', name: 'Clubes Argentinos' },
  { id: 'retro', name: 'Retro' },
  { id: 'nuevos', name: 'Nuevos' }
];

// Estado de la aplicación
let activeCategory = 'todos';
let searchQuery = '';
let cart = JSON.parse(localStorage.getItem('luzen_cart')) || [];
let favorites = new Set(JSON.parse(localStorage.getItem('luzen_favorites')) || []);
let isPreviewSkeletonMode = false;

// Elementos del DOM
const catalogGrid = document.getElementById('catalog-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');
const searchInput = document.getElementById('search-input');
const toastContainer = document.getElementById('toast-container');
const quickViewModal = document.getElementById('quick-view-modal');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryPills();
  renderCatalog();
  updateCartUI();
  setupEventListeners();
  if (window.lucide) {
    lucide.createIcons();
  }
});

// Renderizado de botones de categoría (pills)
function renderCategoryPills() {
  const container = document.getElementById('category-pills-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => {
    const isActive = activeCategory === cat.id;
    const activeClasses = 'bg-black text-white font-semibold shadow-sm border-black';
    const inactiveClasses = 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 font-medium hover:border-zinc-300';
    
    return `
      <button 
        onclick="setCategory('${cat.id}')"
        class="category-pill shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs md:text-sm border transition-all duration-200 cursor-pointer ${isActive ? activeClasses : inactiveClasses}"
        data-category="${cat.id}">
        ${cat.name}
      </button>
    `;
  }).join('');
}

// Cambiar categoría activa
function setCategory(categoryId) {
  activeCategory = categoryId;
  renderCategoryPills();
  renderCatalog();
  
  const currentCategoryObj = CATEGORIES.find(c => c.id === categoryId);
  if (currentCategoryObj && currentCategoryObj.id !== 'todos') {
    showToast(`Categoría: ${currentCategoryObj.name}`);
  }
}

// Renderizado del Catálogo
function renderCatalog() {
  if (!catalogGrid) return;

  // Filtrado de productos si existieran
  const filtered = PRODUCTS.filter(p => {
    const matchCategory = activeCategory === 'todos' || p.category === activeCategory;
    const matchSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery) ||
      (p.category && p.category.toLowerCase().includes(searchQuery));
    return matchCategory && matchSearch;
  });

  // Si no hay productos cargados (estado solicitado por el usuario)
  if (filtered.length === 0 && !isPreviewSkeletonMode) {
    const activeCatName = CATEGORIES.find(c => c.id === activeCategory)?.name || 'Todos';
    catalogGrid.className = 'w-full';
    catalogGrid.innerHTML = `
      <div class="w-full py-16 sm:py-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center rounded-2xl sm:rounded-3xl bg-[#FBFBFC] border-2 border-dashed border-zinc-200 max-w-2xl mx-auto my-6 sm:my-8">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center mb-3 sm:mb-4 text-zinc-800">
          <i data-lucide="layers" class="w-7 h-7 sm:w-8 sm:h-8"></i>
        </div>
        <h3 class="font-extrabold text-lg sm:text-xl text-zinc-950 tracking-tight">Catálogo listo para cargar</h3>
        <p class="text-xs sm:text-sm text-zinc-500 mt-2 max-w-md leading-relaxed">
          La estructura de filtros, búsqueda y diseño según el mockup ya está implementada.
        </p>
        
        <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs bg-zinc-100 text-zinc-700 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Filtro activo: <strong>${activeCatName}</strong>
          </span>
          ${searchQuery ? `
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs bg-zinc-100 text-zinc-700 font-medium">
              Búsqueda: "<strong>${searchQuery}</strong>"
            </span>
          ` : ''}
        </div>

        <!-- Botón para ver vista previa de cómo quedarán las tarjetas -->
        <button 
          onclick="toggleSkeletonPreview()" 
          class="mt-6 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black text-white hover:bg-zinc-800 text-xs font-semibold transition active:scale-95 shadow-sm">
          <i data-lucide="eye" class="w-4 h-4"></i>
          <span>Ver maqueta de tarjetas (Pilas de a 3 en celular)</span>
        </button>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    return;
  }

  // Cuadrícula: Pilas de a 3 en celular (grid-cols-3) y 4 en desktop (md:grid-cols-4)
  catalogGrid.className = 'grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6';

  // Tarjetas mockup o reales
  const itemsToRender = isPreviewSkeletonMode ? getSkeletonPreviewCards() : filtered;

  catalogGrid.innerHTML = itemsToRender.map(product => {
    const isFav = favorites.has(product.id);
    return `
      <div class="group bg-[#F5F5F7] rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:bg-[#F0F0F3] relative border border-transparent hover:border-zinc-200">
        <!-- Botón de favorito -->
        <button 
          onclick="toggleFavorite('${product.id}', event)" 
          aria-label="Guardar en favoritos" 
          class="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 hover:bg-white/80 ${isFav ? 'text-red-500' : 'text-zinc-600 hover:text-black'}">
          <i data-lucide="heart" class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isFav ? 'fill-red-500 text-red-500 heart-pop' : ''}"></i>
        </button>

        <!-- Contenedor de imagen de camiseta -->
        <div class="pt-2 pb-2 sm:pt-3 sm:pb-4 md:pt-4 md:pb-6 flex items-center justify-center overflow-hidden min-h-[90px] sm:min-h-[140px] md:min-h-[190px]">
          ${product.image ? `
            <img 
              src="${product.image}" 
              alt="${product.title}" 
              class="h-20 sm:h-32 md:h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm select-none"
              loading="lazy"
            />
          ` : `
            <div class="w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 rounded-lg sm:rounded-xl bg-zinc-200/60 border border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-400 p-1 sm:p-2 text-center">
              <i data-lucide="shirt" class="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-zinc-400 mb-0.5 sm:mb-1"></i>
              <span class="text-[8px] sm:text-[10px] font-medium leading-tight">Camiseta</span>
            </div>
          `}
        </div>

        <!-- Info & Acción del Carrito -->
        <div class="pt-1.5 sm:pt-2 md:pt-3 border-t border-zinc-200/50 flex items-end justify-between gap-1">
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-zinc-950 text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight truncate" title="${product.title}">
              ${product.title}
            </h3>
            <p class="font-black text-zinc-950 text-[11px] sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 tracking-tight">
              ${product.price}
            </p>
          </div>

          <!-- Botón de carrito cuadrado negro idéntico al mockup -->
          <button 
            onclick="addToCart('${product.id}', event)" 
            aria-label="Agregar al carrito"
            class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg md:rounded-xl bg-[#0A0A0C] hover:bg-zinc-800 active:scale-95 text-white flex items-center justify-center transition-all duration-200 shadow-sm shrink-0 group/btn"
            title="Agregar al carrito">
            <i data-lucide="shopping-cart" class="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-transform group-hover/btn:scale-110"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Alternar vista previa de maquetas de tarjeta
function toggleSkeletonPreview() {
  isPreviewSkeletonMode = !isPreviewSkeletonMode;
  renderCatalog();
}

function getSkeletonPreviewCards() {
  return [
    { id: 'demo-1', title: 'Argentina Local 2024', price: '$ 49.999' },
    { id: 'demo-2', title: 'Argentina Visitante 2024', price: '$ 49.999' },
    { id: 'demo-3', title: 'Real Madrid Local 2024', price: '$ 49.999' },
    { id: 'demo-4', title: 'Barcelona Local 2024', price: '$ 49.999' },
    { id: 'demo-5', title: 'Inter de Milán Local 2024', price: '$ 49.999' },
    { id: 'demo-6', title: 'Manchester City Local 2024', price: '$ 49.999' },
    { id: 'demo-7', title: 'Manchester United Local 2024', price: '$ 49.999' },
    { id: 'demo-8', title: 'Juventus Local 2024', price: '$ 49.999' },
    { id: 'demo-9', title: 'Boca Juniors Local 2024', price: '$ 49.999' }
  ];
}

// Configuración de listeners
function setupEventListeners() {
  // Búsqueda en tiempo real
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderCatalog();
    });
  }

  // Carrito open/close
  const openCartBtns = document.querySelectorAll('.open-cart-btn');
  openCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });

  const closeCartBtn = document.getElementById('close-cart-btn');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Checkout por WhatsApp
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkoutWhatsApp);
  }
}

// Carrito
function addToCart(productId, event) {
  if (event) event.stopPropagation();

  // Buscar en lista real o demo
  let product = PRODUCTS.find(p => p.id === productId);
  if (!product && isPreviewSkeletonMode) {
    product = getSkeletonPreviewCards().find(p => p.id === productId);
    if (product) {
      product.priceNum = 49999;
    }
  }

  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      priceNum: product.priceNum || 49999,
      quantity: 1,
      image: product.image || ''
    });
  }

  saveCart();
  updateCartUI();
  showToast(`¡${product.title} agregada al carrito!`, 'cart');
}

function updateCartQuantity(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(index) {
  if (!cart[index]) return;
  const removed = cart.splice(index, 1)[0];
  saveCart();
  updateCartUI();
  showToast(`Removiste ${removed.title} del carrito`);
}

function saveCart() {
  localStorage.setItem('luzen_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartBadge) {
    cartBadge.textContent = totalCount;
  }

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-400">
        <div class="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-300">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <p class="font-bold text-zinc-800 text-lg">Tu carrito está vacío</p>
        <p class="text-xs text-zinc-500 mt-1 max-w-xs">Elegí tus camisetas y sumalas aquí para coordinar tu pedido.</p>
        <button onclick="closeCart()" class="mt-6 px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-zinc-800 transition">
          Ver Catálogo
        </button>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = '$ 0';
    if (cartTotalEl) cartTotalEl.textContent = '$ 0';
    if (window.lucide) lucide.createIcons();
    return;
  }

  let subtotal = 0;
  cartItemsContainer.innerHTML = cart.map((item, index) => {
    const itemTotal = item.priceNum * item.quantity;
    subtotal += itemTotal;
    return `
      <div class="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
        <div class="w-14 h-14 bg-white rounded-lg p-1 border border-zinc-100 flex items-center justify-center">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-full h-full object-contain">` : `<i data-lucide="shirt" class="w-6 h-6 text-zinc-400"></i>`}
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs md:text-sm text-zinc-900 truncate">${item.title}</h4>
          <p class="text-xs font-bold text-zinc-900 mt-0.5">$ ${itemTotal.toLocaleString('es-AR')}</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center border border-zinc-200 rounded-lg bg-white overflow-hidden">
            <button onclick="updateCartQuantity(${index}, -1)" class="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 text-xs font-bold">-</button>
            <span class="w-6 text-center text-xs font-semibold">${item.quantity}</span>
            <button onclick="updateCartQuantity(${index}, 1)" class="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 text-xs font-bold">+</button>
          </div>
          <button onclick="removeFromCart(${index})" class="text-zinc-400 hover:text-red-500 p-1" title="Eliminar">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  const formattedTotal = `$ ${subtotal.toLocaleString('es-AR')}`;
  if (cartSubtotalEl) cartSubtotalEl.textContent = formattedTotal;
  if (cartTotalEl) cartTotalEl.textContent = formattedTotal;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function openCart() {
  if (cartDrawer && cartOverlay) {
    cartOverlay.classList.remove('hidden');
    cartDrawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Checkout WhatsApp
function checkoutWhatsApp() {
  if (cart.length === 0) {
    showToast('Tu carrito está vacío', 'alert');
    return;
  }

  let text = '¡Hola LUZEN! ⚽ Quisiera encargar los siguientes productos del catálogo:\n\n';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.priceNum * item.quantity;
    total += itemTotal;
    text += `• *${item.title}* x${item.quantity}: $ ${itemTotal.toLocaleString('es-AR')}\n`;
  });

  text += `\n*TOTAL: $ ${total.toLocaleString('es-AR')}*`;
  text += `\n\n¿Tienen disponibilidad para coordinar el envío? Gracias.`;

  const phone = '5491112345678';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// Favoritos
function toggleFavorite(productId, event) {
  if (event) event.stopPropagation();

  const isFav = favorites.has(productId);
  if (isFav) {
    favorites.delete(productId);
    showToast('Removido de favoritos');
  } else {
    favorites.add(productId);
    showToast('¡Guardado en tus favoritos! ❤️');
  }

  localStorage.setItem('luzen_favorites', JSON.stringify(Array.from(favorites)));
  renderCatalog();
}

// Notificaciones flotantes (Toast)
function showToast(message, type = 'info') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast-animate bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs md:text-sm font-medium border border-zinc-800';

  let iconHtml = '<i data-lucide="info" class="w-4 h-4 text-zinc-400"></i>';
  if (type === 'cart') {
    iconHtml = '<i data-lucide="shopping-bag" class="w-4 h-4 text-emerald-400"></i>';
  } else if (type === 'alert') {
    iconHtml = '<i data-lucide="alert-circle" class="w-4 h-4 text-amber-400"></i>';
  }

  toast.innerHTML = `
    ${iconHtml}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

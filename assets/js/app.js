/**
 * LUZEN - Catálogo Oficial de Camisetas
 * Lógica interactiva para filtros, búsqueda, carrito, visualización y WhatsApp.
 */

// Array de camisetas oficiales exhibidas en LUZEN
const PRODUCTS = [
  {
    id: 'arsenal-retro-manga-larga-02-03',
    title: 'Arsenal Retro Manga Larga',
    year: '2002 - 2003',
    season: '02-03',
    team: 'Arsenal',
    category: ['retro', 'clubes-europeos'],
    image: 'assets/images/jerseys/arsenal-retro-manga-larga-02-03.png',
    searchKeywords: 'arsenal o2 inglaterra premier retro manga larga 2002 2003 02-03',
    description: 'Camiseta retro titular manga larga del Arsenal, época histórica de la Premier League con el mítico sponsor O2.',
    inStock: true
  },
  {
    id: 'boca-suplente-26-27',
    title: 'Boca Suplente',
    year: '2026 - 2027',
    season: '26-27',
    team: 'Boca Juniors',
    category: ['clubes-argentinos', 'nuevos'],
    image: 'assets/images/jerseys/boca-suplente-26-27.png',
    searchKeywords: 'boca juniors cabj suplente alternativa bastones trefoil adidas betsson 2026 2027 26-27',
    description: 'Camiseta suplente alternativa de Boca Juniors temporada 26-27 a bastones finos clásicos y logo Trefoil.',
    inStock: true
  },
  {
    id: 'boca-titular-jugador-26-27',
    title: 'Boca Titular Jugador',
    year: '2026 - 2027',
    season: '26-27',
    team: 'Boca Juniors',
    category: ['clubes-argentinos', 'nuevos'],
    image: 'assets/images/jerseys/boca-titular-jugador-26-27.png',
    searchKeywords: 'boca juniors cabj titular jugador franja dorada betsson 2026 2027 26-27',
    description: 'Camiseta titular versión jugador de Boca Juniors temporada 26-27 con franja dorada tradicional.',
    inStock: true
  },
  {
    id: 'milan-retro-manga-larga-06-07',
    title: 'Milan Retro Manga Larga',
    year: '2006 - 2007',
    season: '06-07',
    team: 'AC Milan',
    category: ['retro', 'clubes-europeos'],
    image: 'assets/images/jerseys/milan-retro-manga-larga-06-07.png',
    searchKeywords: 'milan ac milan italia bwin retro manga larga 2006 2007 06-07',
    description: 'Camiseta retro titular manga larga del AC Milan campeón de Champions League en Atenas 2007, sponsor bwin.',
    inStock: true
  },
  {
    id: 'napoli-retro-manga-larga-87-88',
    title: 'Napoli Retro Manga Larga',
    year: '1987 - 1988',
    season: '87-88',
    team: 'Napoli',
    category: ['retro', 'clubes-europeos'],
    image: 'assets/images/jerseys/napoli-retro-manga-larga-87-88.png',
    searchKeywords: 'napoli maradona buitoni scudetto retro manga larga italia 1987 1988 87-88',
    description: 'Camiseta retro histórica del Napoli manga larga era Diego Armando Maradona con escudo Scudetto y sponsor Buitoni.',
    inStock: true
  },
  {
    id: 'river-suplente-jugador-26-27',
    title: 'River Suplente Jugador',
    year: '2026 - 2027',
    season: '26-27',
    team: 'River Plate',
    category: ['clubes-argentinos', 'nuevos'],
    image: 'assets/images/jerseys/river-suplente-jugador-26-27.png',
    searchKeywords: 'river plate riber suplente tricolor jugador betano trefoil adidas 2026 2027 26-27',
    description: 'Camiseta alternativa tricolor versión jugador de River Plate temporada 26-27, sponsor Betano.',
    inStock: true
  },
  {
    id: 'river-titular-jugador-26-27',
    title: 'River Titular Jugador',
    year: '2026 - 2027',
    season: '26-27',
    team: 'River Plate',
    category: ['clubes-argentinos', 'nuevos'],
    image: 'assets/images/jerseys/river-titular-jugador-26-27.png',
    searchKeywords: 'river plate riber titular jugador banda roja betano 2026 2027 26-27',
    description: 'Camiseta titular versión jugador de River Plate temporada 26-27 con la histórica banda roja cruzada.',
    inStock: true
  },
  {
    id: 'santos-retro-manga-larga-12-13',
    title: 'Santos Retro Manga Larga',
    year: '2012 - 2013',
    season: '12-13',
    team: 'Santos FC',
    category: ['retro'],
    image: 'assets/images/jerseys/santos-retro-manga-larga-12-13.png',
    searchKeywords: 'santos brasil neymar bmg retro manga larga 2012 2013 12-13',
    description: 'Camiseta retro manga larga celeste de Santos FC temporada 2012-2013, era Neymar Jr con sponsor Banco BMG.',
    inStock: true
  }
];

// Categorías del catálogo
const CATEGORIES = [
  { id: 'todos', name: 'Todos' },
  { id: 'retro', name: 'Retro' },
  { id: 'clubes-argentinos', name: 'Clubes Argentinos' },
  { id: 'clubes-europeos', name: 'Clubes Europeos' },
  { id: 'nuevos', name: 'Nuevos' },
  { id: 'selecciones', name: 'Selecciones' }
];

// Estado global
let activeCategory = 'todos';
let searchQuery = '';
let cart = JSON.parse(localStorage.getItem('luzen_cart')) || [];
let favorites = new Set(JSON.parse(localStorage.getItem('luzen_favorites')) || []);

// Elementos del DOM
const catalogGrid = document.getElementById('catalog-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalItemsEl = document.getElementById('cart-total-items');
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

// Renderizado de botones de categoría en fila deslizable
function renderCategoryPills() {
  const container = document.getElementById('category-pills-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => {
    const isActive = activeCategory === cat.id;
    const activeClasses = 'bg-black text-white font-semibold shadow-sm border-black';
    const inactiveClasses = 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 font-medium hover:border-zinc-300';
    
    // Contar cuántos productos pertenecen a esta categoría
    const count = cat.id === 'todos' 
      ? PRODUCTS.length 
      : PRODUCTS.filter(p => Array.isArray(p.category) ? p.category.includes(cat.id) : p.category === cat.id).length;

    return `
      <button 
        onclick="setCategory('${cat.id}')"
        class="category-pill shrink-0 whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-xs md:text-sm border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${isActive ? activeClasses : inactiveClasses}"
        data-category="${cat.id}">
        <span>${cat.name}</span>
        ${count > 0 ? `<span class="text-[10px] opacity-70">(${count})</span>` : ''}
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

// Renderizado del Catálogo (Filas de a 2 en celular, 4 en desktop)
function renderCatalog() {
  if (!catalogGrid) return;

  // Filtrado de productos por categoría y búsqueda
  const filtered = PRODUCTS.filter(p => {
    const matchCategory = activeCategory === 'todos' || 
      (Array.isArray(p.category) ? p.category.includes(activeCategory) : p.category === activeCategory);
    
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = query === '' || 
      p.title.toLowerCase().includes(query) ||
      p.season.toLowerCase().includes(query) ||
      p.year.toLowerCase().includes(query) ||
      p.team.toLowerCase().includes(query) ||
      (p.searchKeywords && p.searchKeywords.toLowerCase().includes(query));

    return matchCategory && matchSearch;
  });

  // Estado vacío si no hay coincidencias
  if (filtered.length === 0) {
    const activeCatName = CATEGORIES.find(c => c.id === activeCategory)?.name || 'Todos';
    catalogGrid.className = 'w-full';
    catalogGrid.innerHTML = `
      <div class="w-full py-16 sm:py-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center rounded-2xl sm:rounded-3xl bg-[#FBFBFC] border-2 border-dashed border-zinc-200 max-w-xl mx-auto my-6 sm:my-8">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center mb-3 sm:mb-4 text-zinc-400">
          <i data-lucide="search-x" class="w-7 h-7 sm:w-8 sm:h-8"></i>
        </div>
        <h3 class="font-extrabold text-base sm:text-lg text-zinc-950 tracking-tight">No se encontraron camisetas</h3>
        <p class="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-sm leading-relaxed">
          ${searchQuery 
            ? `No hay resultados para "<strong>${searchQuery}</strong>" en la categoría ${activeCatName}.`
            : `Pronto incorporaremos nuevos modelos a la sección de ${activeCatName}.`}
        </p>
        <button 
          onclick="resetFilters()" 
          class="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white hover:bg-zinc-800 text-xs font-semibold transition active:scale-95 shadow-sm">
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          <span>Ver todas las camisetas</span>
        </button>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    return;
  }

  // Cuadrícula: Filas de a 2 camisetas en celular (grid-cols-2) y 4 columnas en desktop (md:grid-cols-4)
  catalogGrid.className = 'grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6';

  catalogGrid.innerHTML = filtered.map(product => {
    const isFav = favorites.has(product.id);
    return `
      <div class="group bg-[#F5F5F7] rounded-2xl p-2.5 sm:p-3.5 md:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:bg-[#F0F0F3] relative border border-transparent hover:border-zinc-200">
        
        <!-- Contenedor de la camiseta con fondo de estudio oscuro -->
        <div 
          onclick="openQuickView('${product.id}')"
          class="relative w-full aspect-square rounded-xl overflow-hidden bg-black flex items-center justify-center cursor-pointer shadow-inner group/img"
          title="Ver detalle de ${product.title}">
          
          <img 
            src="${product.image}" 
            alt="${product.title} ${product.season}" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
            loading="lazy"
          />

          <!-- Badge de año en esquina inferior izquierda -->
          <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-zinc-100 text-[10px] font-bold border border-white/10 tracking-wider">
            ${product.year}
          </span>

          <!-- Botón de favorito en esquina superior derecha -->
          <button 
            onclick="toggleFavorite('${product.id}', event)" 
            aria-label="Guardar en favoritos" 
            class="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-black ${isFav ? 'text-red-500' : 'text-white/80 hover:text-white'}"
            title="${isFav ? 'Remover de favoritos' : 'Guardar en favoritos'}">
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500 heart-pop' : ''}"></i>
          </button>
        </div>

        <!-- Info & Acción del Carrito (Sin precios, con año y temporada) -->
        <div class="pt-2.5 sm:pt-3 flex items-center justify-between gap-1.5 sm:gap-2">
          <div class="min-w-0 flex-1 cursor-pointer" onclick="openQuickView('${product.id}')">
            <h3 class="font-extrabold text-zinc-950 text-xs sm:text-sm md:text-base leading-snug truncate" title="${product.title}">
              ${product.title}
            </h3>
            <p class="text-[10px] sm:text-[11px] text-zinc-500 font-medium truncate mt-0.5">
              Temporada ${product.season}
            </p>
          </div>

          <!-- Botón de carrito cuadrado negro -->
          <button 
            onclick="addToCart('${product.id}', event)" 
            aria-label="Agregar al carrito"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0A0A0C] hover:bg-zinc-800 active:scale-95 text-white flex items-center justify-center transition-all duration-200 shadow-sm shrink-0 group/btn"
            title="Agregar al pedido">
            <i data-lucide="shopping-cart" class="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/btn:scale-110"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Resetear filtros
function resetFilters() {
  activeCategory = 'todos';
  searchQuery = '';
  if (searchInput) searchInput.value = '';
  renderCategoryPills();
  renderCatalog();
}

// Configuración de listeners
function setupEventListeners() {
  // Búsqueda en tiempo real
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
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

  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      season: product.season,
      year: product.year,
      quantity: 1,
      image: product.image || ''
    });
  }

  saveCart();
  updateCartUI();
  showToast(`¡${product.title} agregada al pedido!`, 'cart');
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
  showToast(`Removiste ${removed.title} del pedido`);
}

function saveCart() {
  localStorage.setItem('luzen_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartBadge) {
    cartBadge.textContent = totalCount;
  }

  if (cartTotalItemsEl) {
    cartTotalItemsEl.textContent = `${totalCount} ${totalCount === 1 ? 'prenda' : 'prendas'}`;
  }

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-400">
        <div class="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-300">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <p class="font-bold text-zinc-800 text-lg">Tu pedido está vacío</p>
        <p class="text-xs text-zinc-500 mt-1 max-w-xs">Elegí tus camisetas favoritas del catálogo y sumalas aquí para consultar disponibilidad.</p>
        <button onclick="closeCart()" class="mt-6 px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-zinc-800 transition">
          Ver Catálogo
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => {
    return `
      <div class="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
        <div class="w-14 h-14 bg-black rounded-lg overflow-hidden border border-zinc-200/50 flex items-center justify-center shrink-0">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">` : `<i data-lucide="shirt" class="w-6 h-6 text-zinc-400"></i>`}
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs md:text-sm text-zinc-900 truncate">${item.title}</h4>
          <p class="text-[11px] text-zinc-500 mt-0.5">Temp. ${item.season || ''} · Cant: <strong class="text-zinc-800">${item.quantity}</strong></p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <div class="flex items-center border border-zinc-200 rounded-lg bg-white overflow-hidden shadow-xs">
            <button onclick="updateCartQuantity(${index}, -1)" class="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 text-xs font-bold">-</button>
            <span class="w-6 text-center text-xs font-semibold">${item.quantity}</span>
            <button onclick="updateCartQuantity(${index}, 1)" class="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 text-xs font-bold">+</button>
          </div>
          <button onclick="removeFromCart(${index})" class="text-zinc-400 hover:text-red-500 p-1 transition" title="Eliminar">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

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

// Modal de Vista Rápida / Detalle
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || !quickViewModal) return;

  const quickViewContent = document.getElementById('quick-view-content');
  if (!quickViewContent) return;

  quickViewContent.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="relative w-full aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-zinc-800">
        <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover">
        <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
          ${product.year}
        </span>
      </div>
      <div>
        <span class="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Temporada ${product.season}</span>
        <h3 class="text-xl font-black text-white mt-0.5">${product.title}</h3>
        <p class="text-xs text-zinc-400 mt-2 leading-relaxed">${product.description || ''}</p>
      </div>
      <div class="pt-2 flex items-center gap-3">
        <button 
          onclick="addToCart('${product.id}'); closeQuickView(); openCart();" 
          class="flex-1 bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs md:text-sm transition">
          <i data-lucide="shopping-cart" class="w-4 h-4"></i>
          <span>Agregar al pedido</span>
        </button>
        <button 
          onclick="consultItemWhatsApp('${product.id}')"
          class="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs md:text-sm border border-zinc-700 transition">
          <i data-lucide="message-circle" class="w-4 h-4 text-emerald-400"></i>
          <span>Consultar</span>
        </button>
      </div>
    </div>
  `;

  quickViewModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

function closeQuickView() {
  if (quickViewModal) {
    quickViewModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Consulta rápida por WhatsApp de una sola camiseta
function consultItemWhatsApp(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const text = `¡Hola LUZEN! ⚽ Quisiera consultar disponibilidad sobre la camiseta *${product.title}* (${product.year}, Temporada ${product.season}).`;
  const phone = '5491112345678';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// Checkout WhatsApp (Sin precios, lista de pedido)
function checkoutWhatsApp() {
  if (cart.length === 0) {
    showToast('Tu pedido está vacío', 'alert');
    return;
  }

  let text = '¡Hola LUZEN! ⚽ Quisiera consultar disponibilidad y encargar las siguientes camisetas del catálogo:\n\n';

  cart.forEach(item => {
    text += `• *${item.title}* (Temporada ${item.season || 'Clásica'}) - Cantidad: ${item.quantity}\n`;
  });

  text += `\n¿Cómo coordinamos el pago y el envío? Muchas gracias.`;

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

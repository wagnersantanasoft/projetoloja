// ===== Utilitários =====
const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const setHidden = (el, hidden) => el && el.classList.toggle('hidden', hidden);
const byId = (id) => document.getElementById(id);

// ===== Tema (dark / light) =====
const THEME_KEY = 'theme';
function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = byId('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '🌓';
}
function toggleTheme() {
  const curr = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(curr === 'dark' ? 'light' : 'dark');
}
function bindThemeToggle() {
  const themeToggleBtn = byId('themeToggle');
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
}

// ===== Auth =====
const AUTH_USER = 'cliente';
const AUTH_PASS = '1234';
function isLoggedIn() {
  return sessionStorage.getItem('loggedIn') === '1';
}
function redirectIfNeeded(page) {
  if (page === 'login' && isLoggedIn()) {
    location.href = 'home.html';
  }
  if ((page === 'home' || page === 'produto') && !isLoggedIn()) {
    location.href = 'index.html';
  }
}

// ===== Dados (catálogo) =====
const PRODUCTS = [
  { id: 'F-1001', nome: 'Furadeira de Impacto 700W', categoria: 'Ferramentas e Equipamentos', preco: 289.9, descricao: 'Furadeira 13mm com controle de velocidade e função impacto.', marca: 'Vonder', referencia: 'VD-700I', imagem: 'https://picsum.photos/seed/furadeira700/800/500' },
  { id: 'F-1002', nome: 'Parafusadeira 12V', categoria: 'Ferramentas e Equipamentos', preco: 319.0, descricao: 'Parafusadeira leve com bateria de íons de lítio e luz LED.', marca: 'Bosch', referencia: 'GSR-12', imagem: 'https://picsum.photos/seed/parafusadeira12/800/500' },
  { id: 'H-2001', nome: 'Torneira Metal Cromado', categoria: 'Hidráulica', preco: 129.9, descricao: 'Torneira de bancada 1/4 de volta, acabamento cromado.', marca: 'Tigre', referencia: 'TG-CROM', imagem: 'https://picsum.photos/seed/torneiraCromada/800/500' },
  { id: 'H-2002', nome: 'Kit Registro Pressão', categoria: 'Hidráulica', preco: 89.5, descricao: 'Registro de pressão 1/2" com acabamento.', marca: 'Docol', referencia: 'DC-REGP', imagem: 'https://picsum.photos/seed/registroPressao/800/500' },
  { id: 'E-3001', nome: 'Tomada 10A Branca', categoria: 'Elétrica', preco: 9.9, descricao: 'Tomada padrão brasileiro 2P+T, 10A.', marca: 'Schneider', referencia: 'SC-T10', imagem: 'https://picsum.photos/seed/tomada10a/800/500' },
  { id: 'E-3002', nome: 'Lâmpada LED 9W', categoria: 'Elétrica', preco: 14.5, descricao: 'Lâmpada LED bulbo 9W, luz branca fria, bivolt.', marca: 'Philips', referencia: 'PH-LED9', imagem: 'https://picsum.photos/seed/led9w/800/500' },
  { id: 'A-4001', nome: 'Rejunte Acrílico 1kg', categoria: 'Acabamento', preco: 29.9, descricao: 'Rejunte acrílico para áreas internas, várias cores.', marca: 'Quartzolit', referencia: 'QZ-RA1', imagem: 'https://picsum.photos/seed/rejunte/800/500' },
  { id: 'A-4002', nome: 'Tinta Acrílica 3,6L', categoria: 'Acabamento', preco: 89.9, descricao: 'Tinta acrílica lavável para interiores, acabamento fosco.', marca: 'Suvinil', referencia: 'SV-TA36', imagem: 'https://picsum.photos/seed/tinta36/800/500' },
  { id: 'L-5001', nome: 'Vaso Sanitário Convencional', categoria: 'Louças e Metais', preco: 449.0, descricao: 'Vaso sanitário cerâmico branco, saída horizontal.', marca: 'Deca', referencia: 'DC-VS1', imagem: 'https://picsum.photos/seed/vaso1/800/500' },
  { id: 'L-5002', nome: 'Cuba de Apoio Redonda', categoria: 'Louças e Metais', preco: 229.0, descricao: 'Cuba de apoio redonda em louça branca.', marca: 'Incepa', referencia: 'IC-CAR', imagem: 'https://picsum.photos/seed/cubaapoio/800/500' }
];

// ===== Carrinho (persistência em localStorage) =====
const CART_KEY = 'cart_v1';
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return new Map(Object.entries(parsed)); // id -> qty
  } catch {
    return new Map();
  }
}
function saveCart(map) {
  const obj = {};
  map.forEach((qty, id) => { obj[id] = qty; });
  localStorage.setItem(CART_KEY, JSON.stringify(obj));
}
const cart = loadCart();
const isInCart = (id) => (cart.get(id) || 0) > 0;
function emitCartChanged(id, action) {
  window.dispatchEvent(new CustomEvent('cart-changed', { detail: { id, action } }));
}

// ===== Carrinho: elementos e ações =====
function getCartEls() {
  return {
    overlay: byId('overlay'),
    aside: byId('cartAside'),
    itemsEl: byId('cartItems'),
    totalEl: byId('cartTotal'),
    countEl: byId('cartCount'),
    openBtn: byId('openCartBtn'),
    closeBtn: byId('closeCartBtn'),
    exitBtn: byId('exitCartBtn'),
    finalizeBtn: byId('finalizeBtn'),
    clearBtn: byId('clearCartBtn'),
  };
}

function toggleCart(show) {
  const { overlay, aside } = getCartEls();
  if (!overlay || !aside) return;
  aside.classList.toggle('show', show);
  overlay.classList.toggle('show', show);
  overlay.classList.toggle('hidden', !show);
  aside.setAttribute('aria-hidden', String(!show));
  overlay.setAttribute('aria-hidden', String(!show));
}
function updateCartBadge() {
  const { countEl } = getCartEls();
  const totalCount = [...cart.values()].reduce((a, b) => a + b, 0);
  if (countEl) countEl.textContent = String(totalCount);
}
function renderCart() {
  const { itemsEl, totalEl } = getCartEls();
  if (!itemsEl || !totalEl) return;
  itemsEl.innerHTML = '';
  if (cart.size === 0) {
    itemsEl.innerHTML = `<div class="card" style="margin:8px">Seu carrinho está vazio.</div>`;
    totalEl.textContent = fmtBRL.format(0);
    updateCartBadge();
    return;
  }
  let total = 0;
  cart.forEach((qty, id) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const lineTotal = p.preco * qty;
    total += lineTotal;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="info">
        <div class="title">${p.nome}</div>
        <div class="line"><span>${p.categoria}</span><span>${fmtBRL.format(p.preco)}</span></div>
        <div class="line"><span>Ref: ${p.referencia}</span><span>Total: <strong>${fmtBRL.format(lineTotal)}</strong></span></div>
      </div>
      <div class="controls">
        <div class="counter">
          <button class="dec" aria-label="Diminuir">−</button>
          <input class="qty-input" type="number" min="1" step="1" value="${qty}" aria-label="Quantidade no carrinho">
          <button class="inc" aria-label="Aumentar">+</button>
        </div>
        <button class="remove">Remover</button>
      </div>
    `;
    $('.dec', row).addEventListener('click', () => changeQty(id, -1));
    $('.inc', row).addEventListener('click', () => changeQty(id, +1));
    $('.qty-input', row).addEventListener('change', (e) => setQty(id, parseInt(e.target.value || '1', 10)));
    $('.remove', row).addEventListener('click', () => removeFromCart(id));
    itemsEl.appendChild(row);
  });
  totalEl.textContent = fmtBRL.format(total);
  updateCartBadge();
}
function addToCart(id, qty = 1) {
  const current = cart.get(id) || 0;
  cart.set(id, current + Math.max(1, qty | 0));
  saveCart(cart);
  renderCart();
  emitCartChanged(id, 'add');
}
function setQty(id, qty) {
  const q = Math.max(1, qty | 0);
  cart.set(id, q);
  saveCart(cart);
  renderCart();
  emitCartChanged(id, 'set');
}
function changeQty(id, delta) {
  const current = cart.get(id) || 1;
  const next = Math.max(1, current + delta);
  cart.set(id, next);
  saveCart(cart);
  renderCart();
  emitCartChanged(id, 'change');
}
function removeFromCart(id) {
  cart.delete(id);
  saveCart(cart);
  renderCart();
  emitCartChanged(id, 'remove');
}
function clearCart() {
  if (cart.size === 0) {
    alert('Seu carrinho já está vazio.');
    return;
  }
  const ok = confirm('Tem certeza que deseja limpar o carrinho? Esta ação removerá todos os itens.');
  if (!ok) return;
  cart.clear();
  saveCart(cart);
  renderCart();
}
function finalizeOrder() {
  if (cart.size === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }
  const lines = [];
  let total = 0;
  cart.forEach((qty, id) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const lt = p.preco * qty;
    total += lt;
    lines.push(`• ${p.nome} (x${qty}) = ${fmtBRL.format(lt)}`);
  });
  alert(['Pedido finalizado com sucesso! 🎉', '', 'Itens:', ...lines, '', `Total: ${fmtBRL.format(total)}`].join('\n'));
  cart.clear();
  saveCart(cart);
  renderCart();
  toggleCart(false);
}
function bindCartUI() {
  const { openBtn, closeBtn, exitBtn, finalizeBtn, clearBtn } = getCartEls();
  if (openBtn) openBtn.addEventListener('click', () => toggleCart(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleCart(false));
  if (exitBtn) exitCartBtn.addEventListener('click', () => toggleCart(false));
  const overlay = byId('overlay');
  if (overlay) overlay.addEventListener('click', () => toggleCart(false));
  if (finalizeBtn) finalizeBtn.addEventListener('click', finalizeOrder);
  if (clearBtn) clearBtn.addEventListener('click', clearCart);
}

// ===== Login (index.html) =====
function bindLogin() {
  const loginForm = byId('loginForm');
  const usernameEl = byId('username');
  const passwordEl = byId('password');
  const togglePasswordBtn = byId('togglePassword');
  const loginError = byId('loginError');
  if (!loginForm) return;
  usernameEl.value = AUTH_USER;
  passwordEl.value = AUTH_PASS;
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = usernameEl.value.trim();
    const p = passwordEl.value.trim();
    if (u === AUTH_USER && p === AUTH_PASS) {
      sessionStorage.setItem('loggedIn', '1');
      sessionStorage.setItem('clientName', u);
      location.href = 'home.html';
    } else {
      setHidden(loginError, false);
      setTimeout(() => setHidden(loginError, true), 3000);
    }
  });
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPwd = passwordEl.type === 'password';
      passwordEl.type = isPwd ? 'text' : 'password';
      togglePasswordBtn.textContent = isPwd ? 'Ocultar' : 'Mostrar';
      passwordEl.focus();
    });
  }
}

// ===== Catálogo (home.html) =====
function bindCatalog() {
  const listEl = byId('productsList');
  const emptyMsg = byId('emptyMsg');
  const searchForm = byId('searchForm');
  const searchInput = byId('searchInput');
  const categorySelect = byId('categorySelect');
  if (!listEl) return;
  const renderList = () => {
    const term = (searchInput?.value || '').toLowerCase().trim();
    const cat = categorySelect ? categorySelect.value : 'Todos';
    const filtered = PRODUCTS.filter(p => {
      const matchesCat = (cat === 'Todos') || (p.categoria === cat);
      const matchesTerm = term === '' ||
        p.nome.toLowerCase().includes(term) ||
        p.descricao.toLowerCase().includes(term) ||
        p.marca.toLowerCase().includes(term) ||
        p.referencia.toLowerCase().includes(term);
      return matchesCat && matchesTerm;
    });
    listEl.innerHTML = '';
    if (filtered.length === 0) {
      setHidden(emptyMsg, false);
      return;
    }
    setHidden(emptyMsg, true);
    filtered.forEach(p => {
      const li = document.createElement('li');
      li.className = 'product-item';
      li.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
        <div class="info">
          <div class="name">${p.nome}</div>
          <a class="desc-link" href="produto.html?id=${encodeURIComponent(p.id)}" title="Ver detalhes">${p.descricao}</a>
        </div>
        <div class="list-right">
          <span class="in-cart-badge ${isInCart(p.id) ? '' : 'hidden'}" aria-live="polite" aria-label="No carrinho">✓ No carrinho</span>
          <div class="price">${fmtBRL.format(p.preco)}</div>
          <div class="line-total">Total: ${fmtBRL.format(p.preco)}</div>
          <div class="counter">
            <button class="dec" aria-label="Diminuir">−</button>
            <input class="qty-input" type="number" min="1" step="1" value="1" aria-label="Quantidade para ${p.nome}">
            <button class="inc" aria-label="Aumentar">+</button>
          </div>
          <button class="btn primary add" type="button">Adicionar</button>
        </div>
      `;
      const qtyInput = $('.qty-input', li);
      const decBtn = $('.dec', li);
      const incBtn = $('.inc', li);
      const addBtn = $('.add', li);
      const lineTotalEl = $('.line-total', li);
      const badge = $('.in-cart-badge', li);
      const unit = p.preco;
      const updateLineTotal = () => {
        const q = Math.max(1, parseInt(qtyInput.value || '1', 10));
        lineTotalEl.textContent = `Total: ${fmtBRL.format(unit * q)}`;
      };
      const updateBadge = () => {
        if (badge) badge.classList.toggle('hidden', !isInCart(p.id));
      };
      decBtn.addEventListener('click', () => {
        qtyInput.value = Math.max(1, (parseInt(qtyInput.value || '1', 10) - 1));
        updateLineTotal();
      });
      incBtn.addEventListener('click', () => {
        qtyInput.value = Math.max(1, (parseInt(qtyInput.value || '1', 10) + 1));
        updateLineTotal();
      });
      qtyInput.addEventListener('input', updateLineTotal);
      qtyInput.addEventListener('change', updateLineTotal);
      addBtn.addEventListener('click', () => {
        const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
        addToCart(p.id, qty);
        qtyInput.value = 1;
        updateLineTotal();
        updateBadge();
      });
      qtyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
          addToCart(p.id, qty);
          qtyInput.value = 1;
          updateLineTotal();
          updateBadge();
        }
      });
      window.addEventListener('cart-changed', (ev) => {
        if (!ev.detail) return;
        if (ev.detail.id === p.id || ['remove','change','set','add'].includes(ev.detail.action)) {
          updateBadge();
        }
      });
      listEl.appendChild(li);
    });
  };
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      renderList();
    });
  }
  if (searchInput) searchInput.addEventListener('input', renderList);
  if (categorySelect) categorySelect.addEventListener('change', renderList);
  renderList();
}

// ===== Detalhe (produto.html) =====
function bindDetail() {
  const detailWrap = byId('productDetail');
  const notFound = byId('notFound');
  if (!detailWrap) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) {
    setHidden(detailWrap, true);
    setHidden(notFound, false);
    return;
  }
  setHidden(notFound, true);
  setHidden(detailWrap, false);
  detailWrap.innerHTML = `
    <div class="pd-media">
      <img src="${p.imagem}" alt="${p.nome}">
    </div>
    <div>
      <h2 class="pd-title">${p.nome}</h2>
      <span id="pdBadge" class="in-cart-badge ${isInCart(p.id) ? '' : 'hidden'}" aria-live="polite">✓ No carrinho</span>
      <div class="pd-price">Preço: ${fmtBRL.format(p.preco)}</div>
      <div class="pd-total" id="pdTotal">Total: ${fmtBRL.format(p.preco)}</div>
      <p>${p.descricao}</p>
      <div class="pd-meta">
        <div><strong>Marca:</strong> ${p.marca}</div>
        <div><strong>Categoria:</strong> ${p.categoria}</div>
        <div><strong>Referência:</strong> ${p.referencia}</div>
        <div><strong>Tipo:</strong> Loja Virtual</div>
      </div>
      <div class="pd-actions">
        <div class="counter">
          <button id="decDetail" aria-label="Diminuir">−</button>
          <input id="qtyDetail" class="qty" type="number" min="1" step="1" value="1" aria-label="Quantidade">
          <button id="incDetail" aria-label="Aumentar">+</button>
        </div>
        <button id="addDetailBtn" class="btn primary" type="button">Adicionar ao Carrinho</button>
      </div>
    </div>
  `;
  const qtyDetail = byId('qtyDetail');
  const pdTotal = byId('pdTotal');
  const pdBadge = byId('pdBadge');
  const updateDetailTotal = () => {
    const q = Math.max(1, parseInt(qtyDetail.value || '1', 10));
    pdTotal.textContent = `Total: ${fmtBRL.format(p.preco * q)}`;
  };
  const updateBadge = () => {
    if (pdBadge) pdBadge.classList.toggle('hidden', !isInCart(p.id));
  };
  byId('decDetail').addEventListener('click', () => { qtyDetail.value = Math.max(1, (parseInt(qtyDetail.value || '1', 10) - 1)); updateDetailTotal(); });
  byId('incDetail').addEventListener('click', () => { qtyDetail.value = Math.max(1, (parseInt(qtyDetail.value || '1', 10) + 1)); updateDetailTotal(); });
  qtyDetail.addEventListener('input', updateDetailTotal);
  qtyDetail.addEventListener('change', updateDetailTotal);
  byId('addDetailBtn').addEventListener('click', () => {
    const qty = Math.max(1, parseInt(qtyDetail.value || '1', 10));
    addToCart(p.id, qty);
    updateBadge();
  });
  window.addEventListener('cart-changed', (ev) => {
    if (!ev.detail) return;
    if (ev.detail.id === p.id || ['remove','change','set','add'].includes(ev.detail.action)) {
      updateBadge();
    }
  });
}

// ===== Inicialização =====
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getPreferredTheme());
  bindThemeToggle();

  const page = document.body.getAttribute('data-page') || 'home';
  redirectIfNeeded(page);

  if (page === 'login') {
    bindLogin(); // Fix: ligar o formulário de login para redirecionar para home.html
  }
  if (page === 'home') {
    const logoutBtn = byId('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('loggedIn');
      sessionStorage.removeItem('clientName');
      location.href = 'index.html';
    });
    bindCatalog();
    bindCartUI();
    renderCart();
  }
  if (page === 'produto') {
    const logoutBtn = byId('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('loggedIn');
      sessionStorage.removeItem('clientName');
      location.href = 'index.html';
    });
    bindDetail();
    bindCartUI();
    renderCart();
  }
});
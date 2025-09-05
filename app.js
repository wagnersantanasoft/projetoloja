/* Versão 1.0.5
   - Corrige ordem de definição de renderList / renderTable (bug impedia exibição dos produtos)
   - Ajustes menores de segurança
*/

/* ===== Utilitários ===== */
const fmtBRL = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const $  = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const byId = id=>document.getElementById(id);
const setHidden = (el,h)=>el && el.classList.toggle('hidden',h);

/* ===== Tema ===== */
const THEME_KEY='theme';
function getPreferredTheme(){
  try{
    const s=localStorage.getItem(THEME_KEY);
    if(s==='light'||s==='dark') return s;
    return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  }catch{return 'dark';}
}
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  try{ localStorage.setItem(THEME_KEY,t); }catch{}
  const b=byId('themeToggle');
  if(b) b.textContent = t==='light'?'🌙':'🌓';
}
function toggleTheme(){
  const curr=document.documentElement.getAttribute('data-theme')||'dark';
  applyTheme(curr==='dark'?'light':'dark');
}
function bindThemeToggle(){
  const btn=byId('themeToggle');
  if(btn) btn.addEventListener('click',toggleTheme);
}

/* ===== Auto-hide header ===== */
function bindAutoHideHeader(){
  const topbar=$('.topbar'); if(!topbar) return;
  let lastY=window.scrollY, hidden=false, ticking=false;
  const show=()=>{ if(hidden){ topbar.classList.remove('is-hidden'); hidden=false; } };
  const hide=()=>{ if(!hidden){ topbar.classList.add('is-hidden'); hidden=true; } };
  window.addEventListener('scroll',()=>{
    if(!ticking){
      requestAnimationFrame(()=>{
        const y=window.scrollY, d=y-lastY;
        if(y<=0) show();
        else if(d>8) hide();
        else if(d<-8) show();
        lastY=y; ticking=false;
      });
      ticking=true;
    }
  },{passive:true});
}

/* ===== Auth ===== */
const AUTH_USER='cliente';
const AUTH_PASS='1234';
function isLoggedIn(){ return sessionStorage.getItem('loggedIn')==='1'; }
function isMobileLike(){
  const ua=navigator.userAgent||'';
  return /Android|iPhone|iPad|iPod|Mobi/i.test(ua) || window.matchMedia('(max-width: 768px)').matches;
}
function redirectIfNeeded(page){
  if(page==='login' && isLoggedIn()){
    location.href = isMobileLike()? 'home.html':'home-tabela.html';
  }
  if((page==='home'||page==='home-tabela'||page==='produto') && !isLoggedIn()){
    location.href='index.html';
  }
}

/* ===== Dados (catálogo) ===== */
const PRODUCTS=[
  { id:'F-1005',nome:'Martelo Unha 20mm',categoria:'Ferramentas e Equipamentos',preco:25.9,descricao:'Martelo de aço com cabo emborrachado.',marca:'Tramontina',referencia:'TR-MU20',imagem:'https://picsum.photos/seed/martelo/800/500'},
  { id:'F-1006',nome:'Alicate Universal 8"',categoria:'Ferramentas e Equipamentos',preco:32.5,descricao:'Alicate universal para uso geral.',marca:'Gedore',referencia:'GD-AU8',imagem:'https://picsum.photos/seed/alicate/800/500'},
  { id:'F-1007',nome:'Serrote 20"',categoria:'Ferramentas e Equipamentos',preco:44.9,descricao:'Serrote para madeira com cabo anatômico.',marca:'Irwin',referencia:'IR-S20',imagem:'https://picsum.photos/seed/serrote/800/500'},
  { id:'F-1008',nome:'Trena 5m',categoria:'Ferramentas e Equipamentos',preco:18.9,descricao:'Trena de aço com trava automática.',marca:'Stanley',referencia:'ST-TR5',imagem:'https://picsum.photos/seed/trena/800/500'},
  { id:'F-1009',nome:'Nível de Bolha 40cm',categoria:'Ferramentas e Equipamentos',preco:27.5,descricao:'Nível de bolha em alumínio.',marca:'Vonder',referencia:'VD-NB40',imagem:'https://picsum.photos/seed/nivel/800/500'},
  { id:'F-1010',nome:'Chave Inglesa 10"',categoria:'Ferramentas e Equipamentos',preco:39.9,descricao:'Chave inglesa ajustável.',marca:'Belzer',referencia:'BZ-CI10',imagem:'https://picsum.photos/seed/chaveinglesa/800/500'},
  { id:'F-1011',nome:'Jogo de Brocas 5 peças',categoria:'Ferramentas e Equipamentos',preco:29.9,descricao:'Brocas para madeira e metal.',marca:'Bosch',referencia:'BS-JB5',imagem:'https://picsum.photos/seed/brocas/800/500'},
  { id:'F-1012',nome:'Estilete Retrátil',categoria:'Ferramentas e Equipamentos',preco:9.5,descricao:'Estilete com lâmina retrátil.',marca:'Olfa',referencia:'OL-EST',imagem:'https://picsum.photos/seed/estilete/800/500'},
  { id:'F-1013',nome:'Chave Phillips 4mm',categoria:'Ferramentas e Equipamentos',preco:13.9,descricao:'Chave phillips com cabo ergonômico.',marca:'Tramontina',referencia:'TR-CP4',imagem:'https://picsum.photos/seed/phillips/800/500'},
  { id:'F-1014',nome:'Chave Allen 6mm',categoria:'Ferramentas e Equipamentos',preco:7.9,descricao:'Chave allen em aço temperado.',marca:'Gedore',referencia:'GD-CA6',imagem:'https://picsum.photos/seed/allen/800/500'},
  { id:'H-2004',nome:'Válvula de Esfera 1/2"',categoria:'Hidráulica',preco:19.9,descricao:'Válvula de esfera para água.',marca:'Tigre',referencia:'TG-VE12',imagem:'https://picsum.photos/seed/valvula/800/500'},
  { id:'H-2005',nome:'Joelho 90º PVC 25mm',categoria:'Hidráulica',preco:2.5,descricao:'Joelho para conexões hidráulicas.',marca:'Amanco',referencia:'AM-J90',imagem:'https://picsum.photos/seed/joelho/800/500'},
  { id:'H-2006',nome:"Caixa d'Água 500L",categoria:'Hidráulica',preco:399.0,descricao:"Caixa d'água em polietileno.",marca:'Fortlev',referencia:'FL-CA500',imagem:'https://picsum.photos/seed/caixaagua/800/500'},
  { id:'H-2007',nome:'Sifão Flexível',categoria:'Hidráulica',preco:14.9,descricao:'Sifão flexível para pia.',marca:'Docol',referencia:'DC-SF',imagem:'https://picsum.photos/seed/sifao/800/500'},
  { id:'H-2008',nome:'Tubo Soldável 3m',categoria:'Hidráulica',preco:11.9,descricao:'Tubo soldável para água fria.',marca:'Tigre',referencia:'TG-TS3',imagem:'https://picsum.photos/seed/tubo/800/500'},
  { id:'H-2009',nome:'Adaptador Rosca 1"',categoria:'Hidráulica',preco:3.9,descricao:'Adaptador para conexões hidráulicas.',marca:'Amanco',referencia:'AM-AR1',imagem:'https://picsum.photos/seed/adaptador/800/500'},
  { id:'H-2010',nome:'Registro Esfera 3/4"',categoria:'Hidráulica',preco:21.9,descricao:'Registro esfera para água.',marca:'Docol',referencia:'DC-RE34',imagem:'https://picsum.photos/seed/registroesfera/800/500'},
  { id:'E-3004',nome:'Disjuntor 20A',categoria:'Elétrica',preco:15.9,descricao:'Disjuntor termomagnético.',marca:'Siemens',referencia:'SM-D20',imagem:'https://picsum.photos/seed/disjuntor/800/500'},
  { id:'E-3005',nome:'Fita Isolante 10m',categoria:'Elétrica',preco:4.5,descricao:'Fita isolante preta.',marca:'3M',referencia:'3M-FI10',imagem:'https://picsum.photos/seed/fitaisolante/800/500'},
  { id:'E-3006',nome:'Campainha Eletrônica',categoria:'Elétrica',preco:22.9,descricao:'Campainha para parede.',marca:'Pial Legrand',referencia:'PL-CE',imagem:'https://picsum.photos/seed/campainha/800/500'},
  { id:'E-3007',nome:'Extensão 3 Tomadas 5m',categoria:'Elétrica',preco:29.9,descricao:'Extensão com 3 tomadas.',marca:'Force Line',referencia:'FL-EXT5',imagem:'https://picsum.photos/seed/extensao/800/500'},
  { id:'E-3008',nome:'Interruptor Paralelo',categoria:'Elétrica',preco:8.9,descricao:'Interruptor paralelo.',marca:'Schneider',referencia:'SC-INTP',imagem:'https://picsum.photos/seed/interruptorparalelo/800/500'},
  { id:'E-3009',nome:'Tomada 20A Branca',categoria:'Elétrica',preco:11.9,descricao:'Tomada 20A.',marca:'Pial Legrand',referencia:'PL-T20',imagem:'https://picsum.photos/seed/tomada20a/800/500'},
  { id:'E-3010',nome:'Lâmpada LED 15W',categoria:'Elétrica',preco:19.5,descricao:'Lamp LED 15W.',marca:'Osram',referencia:'OS-LED15',imagem:'https://picsum.photos/seed/led15w/800/500'},
  { id:'A-4004',nome:'Massa Corrida 18L',categoria:'Acabamento',preco:69.9,descricao:'Massa corrida.',marca:'Coral',referencia:'CR-MC18',imagem:'https://picsum.photos/seed/massacorrida/800/500'},
  { id:'A-4005',nome:'Tinta Esmalte 900ml',categoria:'Acabamento',preco:34.9,descricao:'Tinta esmalte.',marca:'Suvinil',referencia:'SV-TE900',imagem:'https://picsum.photos/seed/tintaesmalte/800/500'},
  { id:'A-4006',nome:'Primer Acrílico 3,6L',categoria:'Acabamento',preco:59.9,descricao:'Primer acrílico.',marca:'Coral',referencia:'CR-PA36',imagem:'https://picsum.photos/seed/primer/800/500'},
  { id:'A-4007',nome:'Piso Cerâmico 60x60',categoria:'Acabamento',preco:49.9,descricao:'Piso cerâmico 60x60.',marca:'Portobello',referencia:'PB-PC60',imagem:'https://picsum.photos/seed/piso/800/500'},
  { id:'A-4008',nome:'Rodapé MDF 7cm',categoria:'Acabamento',preco:12.9,descricao:'Rodapé MDF.',marca:'Durafloor',referencia:'DF-RP7',imagem:'https://picsum.photos/seed/rodape/800/500'},
  { id:'A-4009',nome:'Porta de Madeira Lisa',categoria:'Acabamento',preco:199.0,descricao:'Porta lisa.',marca:'Eucatex',referencia:'EU-PML',imagem:'https://picsum.photos/seed/porta/800/500'},
  { id:'A-4010',nome:'Fechadura Externa',categoria:'Acabamento',preco:54.9,descricao:'Fechadura externa.',marca:'Pado',referencia:'PD-FE',imagem:'https://picsum.photos/seed/fechadura/800/500'},
  { id:'L-5004',nome:'Misturador Monocomando',categoria:'Louças e Metais',preco:349.0,descricao:'Misturador mono.',marca:'Deca',referencia:'DC-MM',imagem:'https://picsum.photos/seed/misturador/800/500'},
  { id:'L-5005',nome:'Ducha Higiênica',categoria:'Louças e Metais',preco:89.9,descricao:'Ducha higiênica.',marca:'Lorenzetti',referencia:'LZ-DH',imagem:'https://picsum.photos/seed/ducha/800/500'},
  { id:'L-5006',nome:'Assento Sanitário Almofadado',categoria:'Louças e Metais',preco:59.9,descricao:'Assento sanitário.',marca:'Tigre',referencia:'TG-ASA',imagem:'https://picsum.photos/seed/assento/800/500'},
  { id:'L-5007',nome:'Ralo Linear 70cm',categoria:'Louças e Metais',preco:119.0,descricao:'Ralo linear.',marca:'Docol',referencia:'DC-RL70',imagem:'https://picsum.photos/seed/ralo/800/500'},
  { id:'L-5008',nome:'Cuba de Apoio Quadrada',categoria:'Louças e Metais',preco:239.0,descricao:'Cuba quadrada.',marca:'Incepa',referencia:'IC-CAQ',imagem:'https://picsum.photos/seed/cubaquadrada/800/500'},
  { id:'L-5009',nome:'Torneira Gourmet Flexível',categoria:'Louças e Metais',preco:199.0,descricao:'Torneira gourmet.',marca:'Lorenzetti',referencia:'LZ-TGF',imagem:'https://picsum.photos/seed/torneiragourmet/800/500'},
  { id:'L-5010',nome:'Válvula de Descarga',categoria:'Louças e Metais',preco:79.9,descricao:'Válvula descarga.',marca:'Deca',referencia:'DC-VD',imagem:'https://picsum.photos/seed/valvuladescarga/800/500'},
  { id:'F-1015',nome:'Chave de Boca 13mm',categoria:'Ferramentas e Equipamentos',preco:11.9,descricao:'Chave de boca.',marca:'Belzer',referencia:'BZ-CB13',imagem:'https://picsum.photos/seed/chaveboca/800/500'},
  { id:'F-1016',nome:'Arco de Serra',categoria:'Ferramentas e Equipamentos',preco:19.9,descricao:'Arco de serra.',marca:'Irwin',referencia:'IR-AS',imagem:'https://picsum.photos/seed/arcoserra/800/500'},
  { id:'F-1017',nome:'Espátula de Aço 6cm',categoria:'Ferramentas e Equipamentos',preco:8.9,descricao:'Espátula aço.',marca:'Tramontina',referencia:'TR-EA6',imagem:'https://picsum.photos/seed/espatula/800/500'},
  { id:'F-1018',nome:'Chave Torx T20',categoria:'Ferramentas e Equipamentos',preco:10.9,descricao:'Chave torx.',marca:'Gedore',referencia:'GD-CT20',imagem:'https://picsum.photos/seed/torx/800/500'},
  { id:'F-1019',nome:'Jogo de Soquetes 10 peças',categoria:'Ferramentas e Equipamentos',preco:59.9,descricao:'Soquetes 10 peças.',marca:'Stanley',referencia:'ST-JS10',imagem:'https://picsum.photos/seed/soquetes/800/500'},
  { id:'F-1020',nome:'Lanterna LED Recarregável',categoria:'Ferramentas e Equipamentos',preco:49.9,descricao:'Lanterna recarregável.',marca:'Vonder',referencia:'VD-LLR',imagem:'https://picsum.photos/seed/lanterna/800/500'},
  { id:'H-2011',nome:'Filtro de Água',categoria:'Hidráulica',preco:69.9,descricao:'Filtro de água.',marca:'Lorenzetti',referencia:'LZ-FA',imagem:'https://picsum.photos/seed/filtro/800/500'},
  { id:'H-2012',nome:'Redutor de Pressão',categoria:'Hidráulica',preco:39.9,descricao:'Redutor pressão.',marca:'Docol',referencia:'DC-RP',imagem:'https://picsum.photos/seed/redutor/800/500'},
  { id:'H-2013',nome:'Mangueira Jardim 10m',categoria:'Hidráulica',preco:39.9,descricao:'Mangueira jardim.',marca:'Fortlev',referencia:'FL-MG10',imagem:'https://picsum.photos/seed/mangueira10/800/500'},
  { id:'H-2014',nome:'Caixa Sifonada 150mm',categoria:'Hidráulica',preco:18.9,descricao:'Caixa sifonada.',marca:'Amanco',referencia:'AM-CS150',imagem:'https://picsum.photos/seed/caixasifonada/800/500'},
  { id:'E-3011',nome:'Sensor de Presença',categoria:'Elétrica',preco:49.9,descricao:'Sensor presença.',marca:'Intelbras',referencia:'IN-SP',imagem:'https://picsum.photos/seed/sensor/800/500'},
  { id:'E-3012',nome:'Plafon LED 18W',categoria:'Elétrica',preco:39.9,descricao:'Plafon LED.',marca:'Ourolux',referencia:'OU-PL18',imagem:'https://picsum.photos/seed/plafon/800/500'},
  { id:'E-3013',nome:'Tomada USB 2A',categoria:'Elétrica',preco:29.9,descricao:'Tomada USB.',marca:'Schneider',referencia:'SC-TUSB',imagem:'https://picsum.photos/seed/tomadausb/800/500'},
  { id:'A-4011',nome:'Espelho Decorativo 60cm',categoria:'Acabamento',preco:89.9,descricao:'Espelho decorativo.',marca:'DecorGlass',referencia:'DG-ED60',imagem:'https://picsum.photos/seed/espelho/800/500'},
  { id:'A-4012',nome:'Papel de Parede 10m',categoria:'Acabamento',preco:59.9,descricao:'Papel parede.',marca:'Adesivart',referencia:'AD-PP10',imagem:'https://picsum.photos/seed/papelparede/800/500'},
  { id:'A-4013',nome:'Kit Rodízio para Porta',categoria:'Acabamento',preco:34.9,descricao:'Kit rodízio.',marca:'Pado',referencia:'PD-KRP',imagem:'https://picsum.photos/seed/rodizio/800/500'},
  { id:'L-5011',nome:'Porta Toalha Barra 40cm',categoria:'Louças e Metais',preco:39.9,descricao:'Porta toalha.',marca:'Deca',referencia:'DC-PTB40',imagem:'https://picsum.photos/seed/portatoalha/800/500'},
  { id:'L-5012',nome:'Saboneteira de Parede',categoria:'Louças e Metais',preco:19.9,descricao:'Saboneteira parede.',marca:'Docol',referencia:'DC-SP',imagem:'https://picsum.photos/seed/saboneteira/800/500'},
  { id:'L-5013',nome:'Prateleira de Vidro 60cm',categoria:'Louças e Metais',preco:49.9,descricao:'Prateleira vidro.',marca:'Incepa',referencia:'IC-PV60',imagem:'https://picsum.photos/seed/prateleira/800/500'},
  { id:'L-5014',nome:'Kit Acessórios Banheiro 5 peças',categoria:'Louças e Metais',preco:99.9,descricao:'Kit acessórios.',marca:'Lorenzetti',referencia:'LZ-KAB5',imagem:'https://picsum.photos/seed/acessorios/800/500'},
  { id:'F-1004',nome:'Chave de Fenda 5mm',categoria:'Ferramentas e Equipamentos',preco:12.5,descricao:'Chave de fenda.',marca:'Tramontina',referencia:'TR-CH5',imagem:'https://picsum.photos/seed/chavefenda/800/500'},
  { id:'H-2003',nome:'Mangueira Flexível 3m',categoria:'Hidráulica',preco:24.9,descricao:'Mangueira flexível.',marca:'Fortlev',referencia:'FL-MG3',imagem:'https://picsum.photos/seed/mangueira/800/500'},
  { id:'E-3003',nome:'Interruptor Simples',categoria:'Elétrica',preco:7.9,descricao:'Interruptor simples.',marca:'Pial Legrand',referencia:'PL-INTS',imagem:'https://picsum.photos/seed/interruptor/800/500'},
  { id:'A-4003',nome:'Argamassa AC-1 20kg',categoria:'Acabamento',preco:34.9,descricao:'Argamassa interna.',marca:'Quartzolit',referencia:'QZ-AC1',imagem:'https://picsum.photos/seed/argamassa/800/500'},
  { id:'L-5003',nome:'Torneira Elétrica 5500W',categoria:'Louças e Metais',preco:119.0,descricao:'Torneira elétrica.',marca:'Lorenzetti',referencia:'LZ-TE55',imagem:'https://picsum.photos/seed/torneiraeletrica/800/500'},
  { id:'F-1001',nome:'Furadeira de Impacto 700W',categoria:'Ferramentas e Equipamentos',preco:289.9,descricao:'Furadeira 700W.',marca:'Vonder',referencia:'VD-700I',imagem:'https://picsum.photos/seed/furadeira700/800/500'},
  { id:'F-1002',nome:'Parafusadeira 12V',categoria:'Ferramentas e Equipamentos',preco:319.0,descricao:'Parafusadeira 12V.',marca:'Bosch',referencia:'GSR-12',imagem:'https://picsum.photos/seed/parafusadeira12/800/500'},
  { id:'L-5001',nome:'Vaso Sanitário Convencional',categoria:'Louças e Metais',preco:449.0,descricao:'Vaso sanitário.',marca:'Deca',referencia:'DC-VS1',imagem:'https://picsum.photos/seed/vaso1/800/500'},
  { id:'L-5002',nome:'Cuba de Apoio Redonda',categoria:'Louças e Metais',preco:229.0,descricao:'Cuba redonda.',marca:'Incepa',referencia:'IC-CAR',imagem:'https://picsum.photos/seed/cubaapoio/800/500'}
];

/* ===== Carrinho ===== */
const CART_KEY='cart_v1';
function loadCart(){
  try{ return new Map(Object.entries(JSON.parse(localStorage.getItem(CART_KEY)||'{}')));}catch{return new Map();}
}
function saveCart(map){
  const o={}; map.forEach((q,id)=>o[id]=q);
  try{ localStorage.setItem(CART_KEY,JSON.stringify(o)); }catch{}
}
const cart=loadCart();
const isInCart=id=>(cart.get(id)||0)>0;
function emitCartChanged(id,action){ window.dispatchEvent(new CustomEvent('cart-changed',{detail:{id,action}})); }
function getCartEls(){
  return {
    overlay:byId('overlay'), aside:byId('cartAside'), itemsEl:byId('cartItems'),
    totalEl:byId('cartTotal'), countEl:byId('cartCount'),
    openBtn:byId('openCartBtn'), closeBtn:byId('closeCartBtn'), exitBtn:byId('exitCartBtn'),
    finalizeBtn:byId('finalizeBtn'), clearBtn:byId('clearCartBtn'),
    itemsQtyEl:byId('cartItemsQty'), distinctEl:byId('cartDistinct')
  };
}
function toggleCart(show){
  const {overlay,aside}=getCartEls(); if(!overlay||!aside) return;
  aside.classList.toggle('show',show);
  overlay.classList.toggle('show',show);
  overlay.classList.toggle('hidden',!show);
  aside.setAttribute('aria-hidden',String(!show));
  overlay.setAttribute('aria-hidden',String(!show));
}
function updateCartBadge(){
  const {countEl}=getCartEls();
  const total=[...cart.values()].reduce((a,b)=>a+b,0);
  if(countEl) countEl.textContent=String(total);
}
function updateCartCountsUI(){
  const {itemsQtyEl,distinctEl}=getCartEls();
  const total=[...cart.values()].reduce((a,b)=>a+b,0);
  if(itemsQtyEl) itemsQtyEl.textContent=`Itens: ${total}`;
  if(distinctEl) distinctEl.textContent=`Distintos: ${cart.size}`;
}
function renderCart(){
  const {itemsEl,totalEl}=getCartEls(); if(!itemsEl||!totalEl) return;
  itemsEl.innerHTML='';
  if(cart.size===0){
    itemsEl.innerHTML='<div class="card" style="margin:8px">Seu carrinho está vazio.</div>';
    totalEl.textContent=fmtBRL.format(0);
    updateCartBadge(); updateCartCountsUI(); return;
  }
  let total=0;
  cart.forEach((qty,id)=>{
    const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
    const line=p.preco*qty; total+=line;
    const row=document.createElement('div');
    row.className='cart-item';
    row.innerHTML=`
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="info">
        <div class="title">${p.nome}</div>
        <div class="line"><span>${p.categoria}</span><span>${fmtBRL.format(p.preco)}</span></div>
        <div class="line"><span>Ref: ${p.referencia}</span><span>Total: <strong>${fmtBRL.format(line)}</strong></span></div>
      </div>
      <div class="controls">
        <div class="counter">
          <button class="dec" aria-label="Diminuir">−</button>
          <input class="qty-input" type="number" min="1" value="${qty}">
          <button class="inc" aria-label="Aumentar">+</button>
        </div>
        <button class="remove">Remover</button>
      </div>`;
    $('.dec',row).addEventListener('click',()=>changeQty(id,-1));
    $('.inc',row).addEventListener('click',()=>changeQty(id,+1));
    $('.qty-input',row).addEventListener('change',e=>setQty(id,parseInt(e.target.value||'1',10)));
    $('.remove',row).addEventListener('click',()=>removeFromCart(id));
    itemsEl.appendChild(row);
  });
  totalEl.textContent=fmtBRL.format(total);
  updateCartBadge(); updateCartCountsUI();
}
function addToCart(id,qty=1){
  cart.set(id,(cart.get(id)||0)+Math.max(1,qty|0));
  saveCart(cart); renderCart(); emitCartChanged(id,'add');
}
function setQty(id,qty){
  cart.set(id,Math.max(1,qty|0));
  saveCart(cart); renderCart(); emitCartChanged(id,'set');
}
function changeQty(id,delta){
  cart.set(id,Math.max(1,(cart.get(id)||1)+delta));
  saveCart(cart); renderCart(); emitCartChanged(id,'change');
}
function removeFromCart(id){
  cart.delete(id); saveCart(cart); renderCart(); emitCartChanged(id,'remove');
}
function clearCart(){
  if(cart.size===0){ alert('Seu carrinho já está vazio.'); return; }
  if(!confirm('Tem certeza que deseja limpar o carrinho?')) return;
  cart.clear(); saveCart(cart); renderCart(); emitCartChanged(null,'clear');
}

/* ===== PDF / Pedido ===== */
async function ensureJsPDF(){
  if(window.jspdf?.jsPDF) return window.jspdf.jsPDF;
  await new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    s.onload=res; s.onerror=rej; document.head.appendChild(s);
  });
  return window.jspdf.jsPDF;
}
function buildOrderData(){
  const itens=[]; let total=0;
  cart.forEach((qty,id)=>{
    const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
    const line=p.preco*qty; total+=line;
    itens.push({id,nome:p.nome,referencia:p.referencia,categoria:p.categoria,preco:p.preco,qty,total:line});
  });
  const now=new Date(); const pad=n=>String(n).padStart(2,'0');
  const numero=`PED-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return {numero,data:now.toLocaleString('pt-BR'),cliente:sessionStorage.getItem('clientName')||'Cliente',itens,total};
}
async function generateOrderPDFBlob(order){
  const jsPDF=await ensureJsPDF();
  const doc=new jsPDF({unit:'pt',format:'a4'});
  const W=doc.internal.pageSize.getWidth(), H=doc.internal.pageSize.getHeight();
  let y=40; const margin=40;
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.text('Resumo do Pedido',margin,y); y+=22;
  doc.setFont('helvetica','normal'); doc.setFontSize(11);
  doc.text(`Pedido: ${order.numero}`,margin,y); y+=16;
  doc.text(`Data: ${order.data}`,margin,y); y+=16;
  doc.text(`Cliente: ${order.cliente}`,margin,y); y+=24;
  const colNomeW=W - margin*2 - 210;
  const newLine=h=>{ if(y+h>H-margin){ doc.addPage(); y=margin; } };
  doc.setFont('helvetica','bold');
  doc.text('Item',margin,y);
  doc.text('Qtd',margin+colNomeW+10,y);
  doc.text('Unit.',margin+colNomeW+50,y);
  doc.text('Total',margin+colNomeW+110,y);
  y+=12; doc.line(margin,y,W-margin,y); y+=12;
  doc.setFont('helvetica','normal');
  order.itens.forEach(it=>{
    newLine(14);
    const lines=doc.splitTextToSize(`${it.nome} (Ref: ${it.referencia})`,colNomeW);
    lines.forEach((ln,i)=>{
      newLine(14);
      doc.text(ln,margin,y);
      if(i===0){
        doc.text(String(it.qty),margin+colNomeW+10,y);
        doc.text(fmtBRL.format(it.preco),margin+colNomeW+50,y);
        doc.text(fmtBRL.format(it.total),margin+colNomeW+110,y);
      }
      y+=14;
    });
    y+=4;
  });
  newLine(24); doc.line(margin,y,W-margin,y); y+=18;
  doc.setFont('helvetica','bold'); doc.setFontSize(13);
  doc.text(`Total do Pedido: ${fmtBRL.format(order.total)}`,margin,y);
  return { blob:doc.output('blob'), filename:`pedido-${order.numero}.pdf` };
}
async function savePDFWithPickerOrDownload(blob,filename){
  if(window.showSaveFilePicker){
    try{
      const handle=await window.showSaveFilePicker({
        suggestedName:filename,
        types:[{description:'PDF',accept:{'application/pdf':['.pdf']}}]
      });
      const w=await handle.createWritable();
      await w.write(await blob.arrayBuffer());
      await w.close();
      return;
    }catch{}
  }
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=filename;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
async function finalizeOrder(){
  if(cart.size===0){ alert('Seu carrinho está vazio.'); return; }
  let order,pdf;
  try{ order=buildOrderData(); pdf=await generateOrderPDFBlob(order); }
  catch{ alert('Erro ao gerar PDF.'); return; }
  if(isMobileLike() && navigator.share){
    try{
      const file=new File([pdf.blob],pdf.filename,{type:'application/pdf'});
      if(!(navigator.canShare && navigator.canShare({files:[file]}))){
        await savePDFWithPickerOrDownload(pdf.blob,pdf.filename);
      }else{
        await navigator.share({title:'Pedido',text:`Pedido ${order.numero}`,files:[file]});
      }
      cart.clear(); saveCart(cart); renderCart(); emitCartChanged(null,'clear'); toggleCart(false);
      return;
    }catch(e){
      if(e && (e.name==='AbortError'||e.name==='NotAllowedError')){
        alert('Compartilhamento cancelado.');
        return;
      }
      try{
        await savePDFWithPickerOrDownload(pdf.blob,pdf.filename);
        cart.clear(); saveCart(cart); renderCart(); emitCartChanged(null,'clear'); toggleCart(false);
        return;
      }catch{ alert('Falha ao salvar/compartilhar.'); return; }
    }
  }
  try{
    await savePDFWithPickerOrDownload(pdf.blob,pdf.filename);
    cart.clear(); saveCart(cart); renderCart(); emitCartChanged(null,'clear'); toggleCart(false);
  }catch{ alert('Falha ao salvar PDF.'); }
}

/* ===== Carrinho UI ===== */
function bindCartUI(){
  const {openBtn,closeBtn,exitBtn,finalizeBtn,clearBtn}=getCartEls();
  if(openBtn) openBtn.addEventListener('click',()=>toggleCart(true));
  if(closeBtn) closeBtn.addEventListener('click',()=>toggleCart(false));
  if(exitBtn) exitBtn.addEventListener('click',()=>toggleCart(false));
  const overlay=byId('overlay'); if(overlay) overlay.addEventListener('click',()=>toggleCart(false));
  if(finalizeBtn) finalizeBtn.addEventListener('click',e=>{e.preventDefault(); finalizeOrder();});
  if(clearBtn) clearBtn.addEventListener('click',e=>{e.preventDefault(); clearCart();});
}

/* ===== Login ===== */
function bindLogin(){
  const form=byId('loginForm'), user=byId('username'), pass=byId('password'),
        toggle=byId('togglePassword'), err=byId('loginError');
  if(!form) return;
  user.value=AUTH_USER; pass.value=AUTH_PASS;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(user.value.trim()===AUTH_USER && pass.value.trim()===AUTH_PASS){
      sessionStorage.setItem('loggedIn','1');
      sessionStorage.setItem('clientName', user.value.trim());
      location.href = isMobileLike()? 'home.html':'home-tabela.html';
    } else {
      setHidden(err,false); setTimeout(()=>setHidden(err,true),3000);
    }
  });
  if(toggle){
    toggle.addEventListener('click',()=>{
      const isPwd=pass.type==='password';
      pass.type=isPwd?'text':'password';
      toggle.textContent=isPwd?'Ocultar':'Mostrar';
      pass.focus();
    });
  }
}

/* ===== Categorias (botões) ===== */
function bindCategories(onChange){
  const bar=byId('categoriesBar'); if(!bar) return {get:()=> 'Todos'};
  const btns=$$('.cat-btn',bar);
  let current='Todos';
  function setActive(btn){
    btns.forEach(b=>{
      const act=b===btn;
      b.classList.toggle('active',act);
      b.setAttribute('aria-pressed',String(act));
    });
    current=btn.dataset.category;
    if(onChange) onChange(current);
  }
  bar.addEventListener('click',e=>{
    const btn=e.target.closest('.cat-btn'); if(!btn) return;
    if(btn.dataset.category!==current) setActive(btn);
  });
  const init=btns.find(b=>b.classList.contains('active'))||btns[0];
  if(init) setActive(init);
  return { get:()=>current };
}

/* ===== Catálogo (Lista) ===== */
function bindCatalog(){
  const listEl=byId('productsList'); if(!listEl){console.warn('productsList não encontrado');return;}
  const empty=byId('emptyMsg');
  const search=byId('searchInput');
  let cats; // será inicializado depois

  const renderList = ()=>{
    const term=(search?.value||'').toLowerCase().trim();
    const cat = cats ? cats.get() : 'Todos';
    const data=PRODUCTS.filter(p=>{
      const catOk=(cat==='Todos')||p.categoria===cat;
      const termOk=!term || p.nome.toLowerCase().includes(term) ||
        p.descricao.toLowerCase().includes(term) ||
        p.marca.toLowerCase().includes(term) ||
        p.referencia.toLowerCase().includes(term);
      return catOk && termOk;
    });
    listEl.innerHTML='';
    if(data.length===0){ setHidden(empty,false); return; }
    setHidden(empty,true);
    data.forEach(p=>{
      const li=document.createElement('li');
      li.className='product-item';
      li.innerHTML=`
        <img src="${p.imagem}" alt="${p.nome}">
        <div class="info">
          <div class="name">${p.nome}</div>
          <a class="desc-link" href="produto.html?id=${encodeURIComponent(p.id)}">${p.descricao}</a>
        </div>
        <div class="list-right">
          <span class="in-cart-badge ${isInCart(p.id)?'':'hidden'}">✓ No carrinho</span>
          <div class="price">${fmtBRL.format(p.preco)}</div>
          <div class="line-total">Total: ${fmtBRL.format(p.preco)}</div>
          <div class="inline-actions">
            <div class="counter">
              <button class="dec" aria-label="Diminuir">−</button>
              <input class="qty-input" type="number" min="1" value="1">
              <button class="inc" aria-label="Aumentar">+</button>
            </div>
            <button class="btn primary add" type="button">Adicionar</button>
          </div>
        </div>`;
      const qty=$('.qty-input',li), dec=$('.dec',li), inc=$('.inc',li), add=$('.add',li);
      const line=$('.line-total',li), badge=$('.in-cart-badge',li), unit=p.preco;
      const upd=()=>{const q=Math.max(1,parseInt(qty.value||'1',10)); line.textContent=`Total: ${fmtBRL.format(unit*q)}`;};
      const updBadge=()=>badge.classList.toggle('hidden',!isInCart(p.id));
      dec.addEventListener('click',()=>{qty.value=Math.max(1,parseInt(qty.value||'1',10)-1);upd();});
      inc.addEventListener('click',()=>{qty.value=Math.max(1,parseInt(qty.value||'1',10)+1);upd();});
      qty.addEventListener('input',upd);
      add.addEventListener('click',()=>{
        const q=Math.max(1,parseInt(qty.value||'1',10));
        addToCart(p.id,q); qty.value=1; upd(); updBadge();
      });
      qty.addEventListener('keydown',e=>{
        if(e.key==='Enter'){ e.preventDefault(); add.click(); }
      });
      window.addEventListener('cart-changed',ev=>{
        if(!ev.detail)return;
        if(ev.detail.id===p.id || ['clear','remove','add','change','set'].includes(ev.detail.action)) updBadge();
      });
      listEl.appendChild(li);
    });
  };

  cats = bindCategories(()=>renderList());
  if(search) search.addEventListener('input',renderList);
  renderList();
}

/* ===== Catálogo (Tabela) ===== */
function bindCatalogTable(){
  const tbody=byId('productsTableBody'); if(!tbody){console.warn('productsTableBody não encontrado');return;}
  const empty=byId('emptyMsg');
  const search=byId('searchInput');
  let cats;

  const renderTable=()=>{
    const term=(search?.value||'').toLowerCase().trim();
    const cat=cats ? cats.get() : 'Todos';
    const data=PRODUCTS.filter(p=>{
      const catOk=(cat==='Todos')||p.categoria===cat;
      const termOk=!term || p.nome.toLowerCase().includes(term) ||
        p.descricao.toLowerCase().includes(term) ||
        p.marca.toLowerCase().includes(term) ||
        p.referencia.toLowerCase().includes(term);
      return catOk && termOk;
    });
    tbody.innerHTML='';
    if(data.length===0){ setHidden(empty,false); return; }
    setHidden(empty,true);
    data.forEach(p=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`
        <td class="media-cell"><img src="${p.imagem}" alt="${p.nome}" loading="lazy"></td>
        <td>
          <div style="font-weight:800">${p.nome}</div>
            <a class="desc-link" href="produto.html?id=${encodeURIComponent(p.id)}">${p.descricao}</a>
          <div class="muted" style="font-size:.7rem;margin-top:4px">${p.categoria} • Ref: ${p.referencia}</div>
        </td>
        <td class="nowrap">${fmtBRL.format(p.preco)}</td>
        <td class="nowrap">
          <div class="counter">
            <button class="dec" aria-label="Diminuir">−</button>
            <input class="qty-input" type="number" min="1" value="1">
            <button class="inc" aria-label="Aumentar">+</button>
          </div>
        </td>
        <td class="nowrap line-total">Total: ${fmtBRL.format(p.preco)}</td>
        <td class="nowrap">
          <div class="table-actions">
            <span class="in-cart-badge ${isInCart(p.id)?'':'hidden'}">✓ No carrinho</span>
            <button class="btn primary add" type="button">Adicionar</button>
          </div>
        </td>`;
      const qty=$('.qty-input',tr), dec=$('.dec',tr), inc=$('.inc',tr), add=$('.add',tr);
      const line=$('.line-total',tr), badge=$('.in-cart-badge',tr), unit=p.preco;
      const upd=()=>{const q=Math.max(1,parseInt(qty.value||'1',10)); line.textContent=`Total: ${fmtBRL.format(unit*q)}`;};
      const updBadge=()=>badge.classList.toggle('hidden',!isInCart(p.id));
      dec.addEventListener('click',()=>{qty.value=Math.max(1,parseInt(qty.value||'1',10)-1);upd();});
      inc.addEventListener('click',()=>{qty.value=Math.max(1,parseInt(qty.value||'1',10)+1);upd();});
      qty.addEventListener('input',upd);
      add.addEventListener('click',()=>{
        const q=Math.max(1,parseInt(qty.value||'1',10));
        addToCart(p.id,q); qty.value=1; upd(); updBadge();
      });
      qty.addEventListener('keydown',e=>{
        if(e.key==='Enter'){ e.preventDefault(); add.click(); }
      });
      window.addEventListener('cart-changed',ev=>{
        if(!ev.detail)return;
        if(ev.detail.id===p.id || ['clear','remove','add','change','set'].includes(ev.detail.action)) updBadge();
      });
      tbody.appendChild(tr);
    });
  };

  cats = bindCategories(()=>renderTable());
  if(search) search.addEventListener('input',renderTable);
  renderTable();
}

/* ===== Detalhe ===== */
function bindDetail(){
  const wrap=byId('productDetail'); if(!wrap) return;
  const nf=byId('notFound');
  const id=new URLSearchParams(location.search).get('id');
  const p=PRODUCTS.find(x=>x.id===id);
  if(!p){ setHidden(wrap,true); setHidden(nf,false); return; }
  setHidden(nf,true); setHidden(wrap,false);
  wrap.innerHTML=`
    <div class="pd-media"><img src="${p.imagem}" alt="${p.nome}"></div>
    <div>
      <h2 class="pd-title">${p.nome}</h2>
      <span id="pdBadge" class="in-cart-badge ${isInCart(p.id)?'':'hidden'}">✓ No carrinho</span>
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
          <input id="qtyDetail" type="number" min="1" value="1">
          <button id="incDetail" aria-label="Aumentar">+</button>
        </div>
        <button id="addDetailBtn" class="btn primary" type="button">Adicionar ao Carrinho</button>
      </div>
    </div>`;
  const qty=byId('qtyDetail'), totalEl=byId('pdTotal'), badge=byId('pdBadge');
  const upd=()=>{const q=Math.max(1,parseInt(qty.value||'1',10)); totalEl.textContent=`Total: ${fmtBRL.format(p.preco*q)}`;};
  const updBadge=()=>badge.classList.toggle('hidden',!isInCart(p.id));
  byId('decDetail').addEventListener('click',()=>{qty.value=Math.max(1,parseInt(qty.value||'1',10)-1);upd();});
  byId('incDetail').addEventListener('click',()=>{qty.value=Math.max(1,parseInt(qty.value||'1',10)+1);upd();});
  qty.addEventListener('input',upd); qty.addEventListener('change',upd);
  byId('addDetailBtn').addEventListener('click',()=>{
    const q=Math.max(1,parseInt(qty.value||'1',10));
    addToCart(p.id,q); updBadge();
  });
  window.addEventListener('cart-changed',ev=>{
    if(!ev.detail)return;
    if(ev.detail.id===p.id || ['clear','remove','add','change','set'].includes(ev.detail.action)) updBadge();
  });
}

/* ===== Inicialização ===== */
document.addEventListener('DOMContentLoaded',()=>{
  try{
    applyTheme(getPreferredTheme());
    bindThemeToggle();
    bindAutoHideHeader();

    const page=document.body.getAttribute('data-page')||'home';
    redirectIfNeeded(page);

    if(page==='login') bindLogin();

    if(page==='home' || page==='home-tabela'){
      const logout=byId('logoutBtn');
      if(logout) logout.addEventListener('click',()=>{
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('clientName');
        location.href='index.html';
      });
      if(page==='home') bindCatalog(); else bindCatalogTable();
      bindCartUI(); renderCart();
    }

    if(page==='produto'){
      const logout=byId('logoutBtn');
      if(logout) logout.addEventListener('click',()=>{
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('clientName');
        location.href='index.html';
      });
      bindDetail(); bindCartUI(); renderCart();
    }
  }catch(e){
    console.error('Erro na inicialização:', e);
  }
});
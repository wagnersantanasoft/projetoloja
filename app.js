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
    { id: 'F-1005', nome: 'Martelo Unha 20mm', categoria: 'Ferramentas e Equipamentos', preco: 25.9, descricao: 'Martelo de aço com cabo emborrachado.', marca: 'Tramontina', referencia: 'TR-MU20', imagem: 'https://picsum.photos/seed/martelo/800/500' },
    { id: 'F-1006', nome: 'Alicate Universal 8"', categoria: 'Ferramentas e Equipamentos', preco: 32.5, descricao: 'Alicate universal para uso geral.', marca: 'Gedore', referencia: 'GD-AU8', imagem: 'https://picsum.photos/seed/alicate/800/500' },
    { id: 'F-1007', nome: 'Serrote 20"', categoria: 'Ferramentas e Equipamentos', preco: 44.9, descricao: 'Serrote para madeira com cabo anatômico.', marca: 'Irwin', referencia: 'IR-S20', imagem: 'https://picsum.photos/seed/serrote/800/500' },
    { id: 'F-1008', nome: 'Trena 5m', categoria: 'Ferramentas e Equipamentos', preco: 18.9, descricao: 'Trena de aço com trava automática.', marca: 'Stanley', referencia: 'ST-TR5', imagem: 'https://picsum.photos/seed/trena/800/500' },
    { id: 'F-1009', nome: 'Nível de Bolha 40cm', categoria: 'Ferramentas e Equipamentos', preco: 27.5, descricao: 'Nível de bolha em alumínio.', marca: 'Vonder', referencia: 'VD-NB40', imagem: 'https://picsum.photos/seed/nivel/800/500' },
    { id: 'F-1010', nome: 'Chave Inglesa 10"', categoria: 'Ferramentas e Equipamentos', preco: 39.9, descricao: 'Chave inglesa ajustável.', marca: 'Belzer', referencia: 'BZ-CI10', imagem: 'https://picsum.photos/seed/chaveinglesa/800/500' },
    { id: 'F-1011', nome: 'Jogo de Brocas 5 peças', categoria: 'Ferramentas e Equipamentos', preco: 29.9, descricao: 'Brocas para madeira e metal.', marca: 'Bosch', referencia: 'BS-JB5', imagem: 'https://picsum.photos/seed/brocas/800/500' },
    { id: 'F-1012', nome: 'Estilete Retrátil', categoria: 'Ferramentas e Equipamentos', preco: 9.5, descricao: 'Estilete com lâmina retrátil.', marca: 'Olfa', referencia: 'OL-EST', imagem: 'https://picsum.photos/seed/estilete/800/500' },
    { id: 'F-1013', nome: 'Chave Phillips 4mm', categoria: 'Ferramentas e Equipamentos', preco: 13.9, descricao: 'Chave phillips com cabo ergonômico.', marca: 'Tramontina', referencia: 'TR-CP4', imagem: 'https://picsum.photos/seed/phillips/800/500' },
    { id: 'F-1014', nome: 'Chave Allen 6mm', categoria: 'Ferramentas e Equipamentos', preco: 7.9, descricao: 'Chave allen em aço temperado.', marca: 'Gedore', referencia: 'GD-CA6', imagem: 'https://picsum.photos/seed/allen/800/500' },
    { id: 'H-2004', nome: 'Válvula de Esfera 1/2"', categoria: 'Hidráulica', preco: 19.9, descricao: 'Válvula de esfera para água.', marca: 'Tigre', referencia: 'TG-VE12', imagem: 'https://picsum.photos/seed/valvula/800/500' },
    { id: 'H-2005', nome: 'Joelho 90º PVC 25mm', categoria: 'Hidráulica', preco: 2.5, descricao: 'Joelho para conexões hidráulicas.', marca: 'Amanco', referencia: 'AM-J90', imagem: 'https://picsum.photos/seed/joelho/800/500' },
    { id: 'H-2006', nome: 'Caixa d\'Água 500L', categoria: 'Hidráulica', preco: 399.0, descricao: 'Caixa d\'água em polietileno.', marca: 'Fortlev', referencia: 'FL-CA500', imagem: 'https://picsum.photos/seed/caixaagua/800/500' },
    { id: 'H-2007', nome: 'Sifão Flexível', categoria: 'Hidráulica', preco: 14.9, descricao: 'Sifão flexível para pia.', marca: 'Docol', referencia: 'DC-SF', imagem: 'https://picsum.photos/seed/sifao/800/500' },
    { id: 'H-2008', nome: 'Tubo Soldável 3m', categoria: 'Hidráulica', preco: 11.9, descricao: 'Tubo soldável para água fria.', marca: 'Tigre', referencia: 'TG-TS3', imagem: 'https://picsum.photos/seed/tubo/800/500' },
    { id: 'H-2009', nome: 'Adaptador Rosca 1"', categoria: 'Hidráulica', preco: 3.9, descricao: 'Adaptador para conexões hidráulicas.', marca: 'Amanco', referencia: 'AM-AR1', imagem: 'https://picsum.photos/seed/adaptador/800/500' },
    { id: 'H-2010', nome: 'Registro Esfera 3/4"', categoria: 'Hidráulica', preco: 21.9, descricao: 'Registro esfera para água.', marca: 'Docol', referencia: 'DC-RE34', imagem: 'https://picsum.photos/seed/registroesfera/800/500' },
    { id: 'E-3004', nome: 'Disjuntor 20A', categoria: 'Elétrica', preco: 15.9, descricao: 'Disjuntor termomagnético.', marca: 'Siemens', referencia: 'SM-D20', imagem: 'https://picsum.photos/seed/disjuntor/800/500' },
    { id: 'E-3005', nome: 'Fita Isolante 10m', categoria: 'Elétrica', preco: 4.5, descricao: 'Fita isolante preta.', marca: '3M', referencia: '3M-FI10', imagem: 'https://picsum.photos/seed/fitaisolante/800/500' },
    { id: 'E-3006', nome: 'Campainha Eletrônica', categoria: 'Elétrica', preco: 22.9, descricao: 'Campainha para parede.', marca: 'Pial Legrand', referencia: 'PL-CE', imagem: 'https://picsum.photos/seed/campainha/800/500' },
    { id: 'E-3007', nome: 'Extensão 3 Tomadas 5m', categoria: 'Elétrica', preco: 29.9, descricao: 'Extensão elétrica com 3 tomadas.', marca: 'Force Line', referencia: 'FL-EXT5', imagem: 'https://picsum.photos/seed/extensao/800/500' },
    { id: 'E-3008', nome: 'Interruptor Paralelo', categoria: 'Elétrica', preco: 8.9, descricao: 'Interruptor paralelo para embutir.', marca: 'Schneider', referencia: 'SC-INTP', imagem: 'https://picsum.photos/seed/interruptorparalelo/800/500' },
    { id: 'E-3009', nome: 'Tomada 20A Branca', categoria: 'Elétrica', preco: 11.9, descricao: 'Tomada padrão brasileiro 20A.', marca: 'Pial Legrand', referencia: 'PL-T20', imagem: 'https://picsum.photos/seed/tomada20a/800/500' },
    { id: 'E-3010', nome: 'Lâmpada LED 15W', categoria: 'Elétrica', preco: 19.5, descricao: 'Lâmpada LED bulbo 15W, luz amarela.', marca: 'Osram', referencia: 'OS-LED15', imagem: 'https://picsum.photos/seed/led15w/800/500' },
    { id: 'A-4004', nome: 'Massa Corrida 18L', categoria: 'Acabamento', preco: 69.9, descricao: 'Massa corrida para paredes internas.', marca: 'Coral', referencia: 'CR-MC18', imagem: 'https://picsum.photos/seed/massacorrida/800/500' },
    { id: 'A-4005', nome: 'Tinta Esmalte 900ml', categoria: 'Acabamento', preco: 34.9, descricao: 'Tinta esmalte sintético brilhante.', marca: 'Suvinil', referencia: 'SV-TE900', imagem: 'https://picsum.photos/seed/tintaesmalte/800/500' },
    { id: 'A-4006', nome: 'Primer Acrílico 3,6L', categoria: 'Acabamento', preco: 59.9, descricao: 'Primer para preparação de superfícies.', marca: 'Coral', referencia: 'CR-PA36', imagem: 'https://picsum.photos/seed/primer/800/500' },
    { id: 'A-4007', nome: 'Piso Cerâmico 60x60', categoria: 'Acabamento', preco: 49.9, descricao: 'Piso cerâmico branco, caixa com 2,5m².', marca: 'Portobello', referencia: 'PB-PC60', imagem: 'https://picsum.photos/seed/piso/800/500' },
    { id: 'A-4008', nome: 'Rodapé MDF 7cm', categoria: 'Acabamento', preco: 12.9, descricao: 'Rodapé branco em MDF.', marca: 'Durafloor', referencia: 'DF-RP7', imagem: 'https://picsum.photos/seed/rodape/800/500' },
    { id: 'A-4009', nome: 'Porta de Madeira Lisa', categoria: 'Acabamento', preco: 199.0, descricao: 'Porta lisa para pintura.', marca: 'Eucatex', referencia: 'EU-PML', imagem: 'https://picsum.photos/seed/porta/800/500' },
    { id: 'A-4010', nome: 'Fechadura Externa', categoria: 'Acabamento', preco: 54.9, descricao: 'Fechadura para porta externa.', marca: 'Pado', referencia: 'PD-FE', imagem: 'https://picsum.photos/seed/fechadura/800/500' },
    { id: 'L-5004', nome: 'Misturador Monocomando', categoria: 'Louças e Metais', preco: 349.0, descricao: 'Misturador para lavatório.', marca: 'Deca', referencia: 'DC-MM', imagem: 'https://picsum.photos/seed/misturador/800/500' },
    { id: 'L-5005', nome: 'Ducha Higiênica', categoria: 'Louças e Metais', preco: 89.9, descricao: 'Ducha higiênica com gatilho.', marca: 'Lorenzetti', referencia: 'LZ-DH', imagem: 'https://picsum.photos/seed/ducha/800/500' },
    { id: 'L-5006', nome: 'Assento Sanitário Almofadado', categoria: 'Louças e Metais', preco: 59.9, descricao: 'Assento sanitário universal.', marca: 'Tigre', referencia: 'TG-ASA', imagem: 'https://picsum.photos/seed/assento/800/500' },
    { id: 'L-5007', nome: 'Ralo Linear 70cm', categoria: 'Louças e Metais', preco: 119.0, descricao: 'Ralo linear em inox.', marca: 'Docol', referencia: 'DC-RL70', imagem: 'https://picsum.photos/seed/ralo/800/500' },
    { id: 'L-5008', nome: 'Cuba de Apoio Quadrada', categoria: 'Louças e Metais', preco: 239.0, descricao: 'Cuba de apoio quadrada em louça.', marca: 'Incepa', referencia: 'IC-CAQ', imagem: 'https://picsum.photos/seed/cubaquadrada/800/500' },
    { id: 'L-5009', nome: 'Torneira Gourmet Flexível', categoria: 'Louças e Metais', preco: 199.0, descricao: 'Torneira gourmet com bica flexível.', marca: 'Lorenzetti', referencia: 'LZ-TGF', imagem: 'https://picsum.photos/seed/torneiragourmet/800/500' },
    { id: 'L-5010', nome: 'Válvula de Descarga', categoria: 'Louças e Metais', preco: 79.9, descricao: 'Válvula de descarga para vaso sanitário.', marca: 'Deca', referencia: 'DC-VD', imagem: 'https://picsum.photos/seed/valvuladescarga/800/500' },
    { id: 'F-1015', nome: 'Chave de Boca 13mm', categoria: 'Ferramentas e Equipamentos', preco: 11.9, descricao: 'Chave de boca dupla.', marca: 'Belzer', referencia: 'BZ-CB13', imagem: 'https://picsum.photos/seed/chaveboca/800/500' },
    { id: 'F-1016', nome: 'Arco de Serra', categoria: 'Ferramentas e Equipamentos', preco: 19.9, descricao: 'Arco de serra para corte de metais.', marca: 'Irwin', referencia: 'IR-AS', imagem: 'https://picsum.photos/seed/arcoserra/800/500' },
    { id: 'F-1017', nome: 'Espátula de Aço 6cm', categoria: 'Ferramentas e Equipamentos', preco: 8.9, descricao: 'Espátula para massa corrida.', marca: 'Tramontina', referencia: 'TR-EA6', imagem: 'https://picsum.photos/seed/espatula/800/500' },
    { id: 'F-1018', nome: 'Chave Torx T20', categoria: 'Ferramentas e Equipamentos', preco: 10.9, descricao: 'Chave torx em aço.', marca: 'Gedore', referencia: 'GD-CT20', imagem: 'https://picsum.photos/seed/torx/800/500' },
    { id: 'F-1019', nome: 'Jogo de Soquetes 10 peças', categoria: 'Ferramentas e Equipamentos', preco: 59.9, descricao: 'Soquetes para automotivo.', marca: 'Stanley', referencia: 'ST-JS10', imagem: 'https://picsum.photos/seed/soquetes/800/500' },
    { id: 'F-1020', nome: 'Lanterna LED Recarregável', categoria: 'Ferramentas e Equipamentos', preco: 49.9, descricao: 'Lanterna portátil recarregável.', marca: 'Vonder', referencia: 'VD-LLR', imagem: 'https://picsum.photos/seed/lanterna/800/500' },
    { id: 'H-2011', nome: 'Filtro de Água', categoria: 'Hidráulica', preco: 69.9, descricao: 'Filtro para torneira.', marca: 'Lorenzetti', referencia: 'LZ-FA', imagem: 'https://picsum.photos/seed/filtro/800/500' },
    { id: 'H-2012', nome: 'Redutor de Pressão', categoria: 'Hidráulica', preco: 39.9, descricao: 'Redutor para sistemas hidráulicos.', marca: 'Docol', referencia: 'DC-RP', imagem: 'https://picsum.photos/seed/redutor/800/500' },
    { id: 'H-2013', nome: 'Mangueira Jardim 10m', categoria: 'Hidráulica', preco: 39.9, descricao: 'Mangueira flexível para jardim.', marca: 'Fortlev', referencia: 'FL-MG10', imagem: 'https://picsum.photos/seed/mangueira10/800/500' },
    { id: 'H-2014', nome: 'Caixa Sifonada 150mm', categoria: 'Hidráulica', preco: 18.9, descricao: 'Caixa sifonada para esgoto.', marca: 'Amanco', referencia: 'AM-CS150', imagem: 'https://picsum.photos/seed/caixasifonada/800/500' },
    { id: 'E-3011', nome: 'Sensor de Presença', categoria: 'Elétrica', preco: 49.9, descricao: 'Sensor para iluminação automática.', marca: 'Intelbras', referencia: 'IN-SP', imagem: 'https://picsum.photos/seed/sensor/800/500' },
    { id: 'E-3012', nome: 'Plafon LED 18W', categoria: 'Elétrica', preco: 39.9, descricao: 'Plafon LED embutir.', marca: 'Ourolux', referencia: 'OU-PL18', imagem: 'https://picsum.photos/seed/plafon/800/500' },
    { id: 'E-3013', nome: 'Tomada USB 2A', categoria: 'Elétrica', preco: 29.9, descricao: 'Tomada com saída USB.', marca: 'Schneider', referencia: 'SC-TUSB', imagem: 'https://picsum.photos/seed/tomadausb/800/500' },
    { id: 'A-4011', nome: 'Espelho Decorativo 60cm', categoria: 'Acabamento', preco: 89.9, descricao: 'Espelho redondo decorativo.', marca: 'DecorGlass', referencia: 'DG-ED60', imagem: 'https://picsum.photos/seed/espelho/800/500' },
    { id: 'A-4012', nome: 'Papel de Parede 10m', categoria: 'Acabamento', preco: 59.9, descricao: 'Papel de parede autocolante.', marca: 'Adesivart', referencia: 'AD-PP10', imagem: 'https://picsum.photos/seed/papelparede/800/500' },
    { id: 'A-4013', nome: 'Kit Rodízio para Porta', categoria: 'Acabamento', preco: 34.9, descricao: 'Kit rodízio para porta de correr.', marca: 'Pado', referencia: 'PD-KRP', imagem: 'https://picsum.photos/seed/rodizio/800/500' },
    { id: 'L-5011', nome: 'Porta Toalha Barra 40cm', categoria: 'Louças e Metais', preco: 39.9, descricao: 'Porta toalha em inox.', marca: 'Deca', referencia: 'DC-PTB40', imagem: 'https://picsum.photos/seed/portatoalha/800/500' },
    { id: 'L-5012', nome: 'Saboneteira de Parede', categoria: 'Louças e Metais', preco: 19.9, descricao: 'Saboneteira cromada.', marca: 'Docol', referencia: 'DC-SP', imagem: 'https://picsum.photos/seed/saboneteira/800/500' },
    { id: 'L-5013', nome: 'Prateleira de Vidro 60cm', categoria: 'Louças e Metais', preco: 49.9, descricao: 'Prateleira para banheiro.', marca: 'Incepa', referencia: 'IC-PV60', imagem: 'https://picsum.photos/seed/prateleira/800/500' },
    { id: 'L-5014', nome: 'Kit Acessórios Banheiro 5 peças', categoria: 'Louças e Metais', preco: 99.9, descricao: 'Kit completo de acessórios.', marca: 'Lorenzetti', referencia: 'LZ-KAB5', imagem: 'https://picsum.photos/seed/acessorios/800/500' },
    { id: 'F-1004', nome: 'Chave de Fenda 5mm', categoria: 'Ferramentas e Equipamentos', preco: 12.5, descricao: 'Chave de fenda com cabo ergonômico.', marca: 'Tramontina', referencia: 'TR-CH5', imagem: 'https://picsum.photos/seed/chavefenda/800/500' },
    { id: 'H-2003', nome: 'Mangueira Flexível 3m', categoria: 'Hidráulica', preco: 24.9, descricao: 'Mangueira para jardim, resistente e flexível.', marca: 'Fortlev', referencia: 'FL-MG3', imagem: 'https://picsum.photos/seed/mangueira/800/500' },
    { id: 'E-3003', nome: 'Interruptor Simples', categoria: 'Elétrica', preco: 7.9, descricao: 'Interruptor simples para embutir.', marca: 'Pial Legrand', referencia: 'PL-INTS', imagem: 'https://picsum.photos/seed/interruptor/800/500' },
    { id: 'A-4003', nome: 'Argamassa AC-1 20kg', categoria: 'Acabamento', preco: 34.9, descricao: 'Argamassa para assentamento de cerâmicas internas.', marca: 'Quartzolit', referencia: 'QZ-AC1', imagem: 'https://picsum.photos/seed/argamassa/800/500' },
    { id: 'L-5003', nome: 'Torneira Elétrica 5500W', categoria: 'Louças e Metais', preco: 119.0, descricao: 'Torneira elétrica para cozinha, 127V.', marca: 'Lorenzetti', referencia: 'LZ-TE55', imagem: 'https://picsum.photos/seed/torneiraeletrica/800/500' },
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
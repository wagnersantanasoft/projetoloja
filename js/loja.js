// Produtos de exemplo
const produtos = [
    {
        id: 1,
        nome: "Notebook Dell Inspiron",
        imagem: "https://via.placeholder.com/120?text=Notebook",
        preco: 3500.00,
        marca: "Dell",
        categoria: "Informática"
    },
    {
        id: 2,
        nome: "Smartphone Samsung Galaxy",
        imagem: "https://via.placeholder.com/120?text=Smartphone",
        preco: 1800.00,
        marca: "Samsung",
        categoria: "Celular"
    },
    {
        id: 3,
        nome: "Fone Bluetooth JBL",
        imagem: "https://via.placeholder.com/120?text=Fone",
        preco: 350.00,
        marca: "JBL",
        categoria: "Áudio"
    },
    {
        id: 4,
        nome: "TV LG 50'' 4K",
        imagem: "https://via.placeholder.com/120?text=TV",
        preco: 3200.00,
        marca: "LG",
        categoria: "Eletrônicos"
    }
];

let carrinho = [];

// Login
document.getElementById('entrar-btn').onclick = function() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const erro = document.getElementById('login-error');
    if (usuario && senha === '1234') {
        erro.style.display = 'none';
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('vitrine-page').style.display = 'block';
        mostrarVitrine();
    } else {
        erro.textContent = 'Usuário ou senha inválidos!';
        erro.style.display = 'block';
    }
};

document.getElementById('logout-btn').onclick = function() {
    document.getElementById('vitrine-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
    carrinho = [];
};

document.getElementById('ver-carrinho-btn').onclick = function() {
    document.getElementById('vitrine-page').style.display = 'none';
    document.getElementById('carrinho-page').style.display = 'block';
    mostrarCarrinho();
};

document.getElementById('voltar-btn').onclick = function() {
    document.getElementById('carrinho-page').style.display = 'none';
    document.getElementById('vitrine-page').style.display = 'block';
    mostrarVitrine();
};

document.getElementById('finalizar-btn').onclick = function() {
    document.getElementById('carrinho-page').style.display = 'none';
    document.getElementById('finalizar-page').style.display = 'block';
    carrinho = [];
};

document.getElementById('sair-btn').onclick = function() {
    document.getElementById('finalizar-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
};

// Vitrine
function mostrarVitrine() {
    const lista = document.getElementById('produtos-lista');
    lista.innerHTML = '';
    produtos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}">
            <div class="nome">${prod.nome}</div>
            <div class="preco">R$ ${prod.preco.toFixed(2)}</div>
            <div class="marca">Marca: ${prod.marca}</div>
            <div class="categoria">Categoria: ${prod.categoria}</div>
            <div>
                <input type="number" min="1" value="1" id="qtd-${prod.id}" style="width:60px;">
                <button onclick="adicionarCarrinho(${prod.id})">Adicionar</button>
            </div>
        `;
        lista.appendChild(card);
    });
}

// Carrinho
function mostrarCarrinho() {
    const tbody = document.querySelector('#carrinho-tabela tbody');
    tbody.innerHTML = '';
    let total = 0;
    carrinho.forEach((item, idx) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        tbody.innerHTML += `
            <tr>
                <td><img src="${item.imagem}" alt="${item.nome}" style="max-width:60px;"></td>
                <td>${item.nome}</td>
                <td>R$ ${item.preco.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" value="${item.quantidade}" style="width:60px;" onchange="alterarQuantidade(${idx}, this.value)">
                </td>
                <td>R$ ${(subtotal).toFixed(2)}</td>
                <td>
                    <button onclick="removerItem(${idx})">Excluir</button>
                </td>
            </tr>
        `;
    });
    document.getElementById('carrinho-total').textContent = "Total: R$ " + total.toFixed(2);
}

// Adicionar ao carrinho
window.adicionarCarrinho = function(id) {
    const prod = produtos.find(p => p.id === id);
    const qtdInput = document.getElementById('qtd-' + id);
    const quantidade = parseInt(qtdInput.value) || 1;
    const existente = carrinho.find(item => item.id === id);
    if (existente) {
        existente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: prod.id,
            nome: prod.nome,
            imagem: prod.imagem,
            preco: prod.preco,
            quantidade: quantidade
        });
    }
    alert('Produto adicionado ao carrinho!');
};

// Alterar quantidade
window.alterarQuantidade = function(idx, novaQtd) {
    novaQtd = parseInt(novaQtd);
    if (novaQtd < 1) return;
    carrinho[idx].quantidade = novaQtd;
    mostrarCarrinho();
};

// Remover item
window.removerItem = function(idx) {
    carrinho.splice(idx, 1);
    mostrarCarrinho();
};
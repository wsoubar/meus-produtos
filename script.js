let produtosGlobais = [];

async function carregarProdutos() {
  try {
    const resposta = await fetch('./dados.json?v=' + Date.now());
    if (!resposta.ok) throw new Error('Falha ao carregar dados.json');

    const dados = await resposta.json();

    document.getElementById('titulo').textContent = dados.titulo;
    document.getElementById('subtitulo').textContent = dados.subtitulo;

    produtosGlobais = dados.produtos;

    // Primeira renderização
    renderizar();

    // Liga os eventos dos filtros
    document.getElementById('busca').addEventListener('input', renderizar);
    document.getElementById('faixaPreco').addEventListener('change', renderizar);
    document.getElementById('ordenacao').addEventListener('change', renderizar);
  } catch (erro) {
    console.error(erro);
    document.getElementById('titulo').textContent = 'Erro ao carregar os dados';
    document.getElementById('subtitulo').textContent = 'Verifique o console do navegador';
  }
}

function renderizar() {
  const busca = document.getElementById('busca').value.toLowerCase().trim();
  const faixa = document.getElementById('faixaPreco').value;
  const ordem = document.getElementById('ordenacao').value;

  // 1) Filtragem
  let lista = produtosGlobais.filter(produto => {
    const bateBusca =
      produto.nome.toLowerCase().includes(busca) ||
      produto.descricao.toLowerCase().includes(busca);

    if (!bateBusca) return false;

    if (faixa === 'todos') return true;

    const [min, max] = faixa.split('-').map(Number);
    return produto.preco >= min && produto.preco <= max;
  });

  // 2) Ordenação
  if (ordem === 'menor-preco') {
    lista = lista.slice().sort((a, b) => a.preco - b.preco);
  } else if (ordem === 'maior-preco') {
    lista = lista.slice().sort((a, b) => b.preco - a.preco);
  } else if (ordem === 'nome') {
    lista = lista.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  // 3) Contador
  const contador = document.getElementById('contador');
  if (lista.length === 0) {
    contador.textContent = 'Nenhum produto encontrado 😕';
  } else if (lista.length === 1) {
    contador.textContent = '1 produto encontrado';
  } else {
    contador.textContent = `${lista.length} produtos encontrados`;
  }

  // 4) Renderização
  const container = document.getElementById('lista');

  if (lista.length === 0) {
    container.innerHTML = '<p class="vazio">Tente ajustar a busca ou os filtros.</p>';
    return;
  }

  container.innerHTML = lista.map(produto => {
    const precoFormatado = produto.preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return `
      <article class="card">
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
        <div class="card-info">
          <h2>${produto.nome}</h2>
          <p class="descricao">${produto.descricao}</p>
          <p class="preco">${precoFormatado}</p>
          <a href="${produto.link}" target="_blank" rel="noopener">Ver produto →</a>
        </div>
      </article>
    `;
  }).join('');
}

carregarProdutos();

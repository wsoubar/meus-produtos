async function carregarProdutos() {
  try {
    // Carrega o JSON com cache-buster para sempre pegar a versão mais nova
    const resposta = await fetch('./dados.json?v=' + Date.now());
    if (!resposta.ok) throw new Error('Falha ao carregar dados.json');

    const dados = await resposta.json();

    // Preenche título e subtítulo
    document.getElementById('titulo').textContent = dados.titulo;
    document.getElementById('subtitulo').textContent = dados.subtitulo;

    // Formata cada produto em um card
    const lista = document.getElementById('lista');
    lista.innerHTML = dados.produtos.map(produto => {
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
  } catch (erro) {
    console.error(erro);
    document.getElementById('titulo').textContent = 'Erro ao carregar os dados';
    document.getElementById('subtitulo').textContent = 'Verifique o console do navegador';
  }
}

carregarProdutos();

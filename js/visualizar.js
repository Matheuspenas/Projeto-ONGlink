// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("listaNecessidades")) return;

  // Recupera os dados salvos no localStorage ou inicializa com array vazio
  const lista = JSON.parse(localStorage.getItem("necessidades")) || [];

  // Referências aos elementos do DOM
  const container = document.getElementById("listaNecessidades");
  const pesquisaInput = document.getElementById("pesquisa");
  const filtroSelect = document.getElementById("filtroTipo");

  // Função para formatar CPF com partes censuradas
  function formatarCpfCensurado(cpf) {
    const numeros = cpf.replace(/\D/g, "");
    if (numeros.length !== 11) return "CPF inválido";
    return `${numeros.substr(0, 3)}.***.***-${numeros.substr(9, 2)}`;
  }

  // Função para exibir os cards das necessidades na tela
  function exibirNecessidades(filtradas) {
    container.innerHTML = "";

    // Se não houver resultados filtrados
    if (filtradas.length === 0) {
      container.innerHTML = "<p>Nenhuma necessidade encontrada.</p>";
      return;
    }

    // Cria e insere um card para cada necessidade
    filtradas.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("action-card");

      // Estrutura do conteúdo do card com as informações da necessidade e o adiciona ao container
      card.innerHTML = `
        <h2>${item.titulo}</h2>
        <p><strong>Instituição:</strong> ${item.nome}</p>
        <p><strong>Tipo:</strong> ${item.tipo}</p>
        <p><strong>Descrição:</strong> ${item.descricao}</p>
        <p><strong>Contato:</strong> ${item.email}</p>
        <p><strong>CPF do representante:</strong> ${formatarCpfCensurado(
          item.cpf
        )}</p>
        <p><strong>Endereço:</strong> ${item.endereco.rua}, ${
        item.endereco.bairro
      }, ${item.endereco.cidade} - ${item.endereco.uf}</p>
      `;

      container.appendChild(card);
    });
  }

  // Função para aplicar filtros de busca e tipo
  function aplicarFiltro() {
    const termo = pesquisaInput.value.toLowerCase(); // Texto da pesquisa
    const tipo = filtroSelect.value; // Valor selecionado no filtro

    // Filtra a lista com base nos critérios anteriores
    const filtradas = lista.filter((item) => {
      const correspondePesquisa =
        item.titulo.toLowerCase().includes(termo) ||
        item.descricao.toLowerCase().includes(termo);
      const correspondeTipo = tipo === "" || item.tipo === tipo;

      return correspondePesquisa && correspondeTipo;
    });

    exibirNecessidades(filtradas); // Atualiza a exibição com os resultados filtrados
  }

  // Adiciona eventos de escuta para pesquisa e filtro
  pesquisaInput.addEventListener("input", aplicarFiltro);
  filtroSelect.addEventListener("change", aplicarFiltro);

  // Exibe todas as necessidades ao carregar a página
  exibirNecessidades(lista);
});

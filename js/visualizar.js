document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("listaNecessidades")) return;

  const lista = JSON.parse(localStorage.getItem("necessidades")) || [];
  const container = document.getElementById("listaNecessidades");
  const pesquisaInput = document.getElementById("pesquisa");
  const filtroSelect = document.getElementById("filtroTipo");

  // Função para formatar CPF com censura
  function formatarCpfCensurado(cpf) {
    const numeros = cpf.replace(/\D/g, "");
    if (numeros.length !== 11) return "CPF inválido";
    return `${numeros.substr(0, 3)}.***.***-${numeros.substr(9, 2)}`;
  }

  function exibirNecessidades(filtradas) {
    container.innerHTML = "";

    if (filtradas.length === 0) {
      container.innerHTML = "<p>Nenhuma necessidade encontrada.</p>";
      return;
    }

    filtradas.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("action-card");

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

  function aplicarFiltro() {
    const termo = pesquisaInput.value.toLowerCase();
    const tipo = filtroSelect.value;

    const filtradas = lista.filter((item) => {
      const correspondePesquisa =
        item.titulo.toLowerCase().includes(termo) ||
        item.descricao.toLowerCase().includes(termo);
      const correspondeTipo = tipo === "" || item.tipo === tipo;

      return correspondePesquisa && correspondeTipo;
    });

    exibirNecessidades(filtradas);
  }

  pesquisaInput.addEventListener("input", aplicarFiltro);
  filtroSelect.addEventListener("change", aplicarFiltro);

  exibirNecessidades(lista);
});

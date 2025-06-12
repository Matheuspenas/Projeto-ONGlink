document.addEventListener("DOMContentLoaded", function () {
  // Função para validar o CPF
  function validarCpf(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return null; // Verifica se o CPF tem 11 dígitos

    let soma = 0;
    let resto;

    // Calcula o primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  const cpfInput = document.getElementById("LoginCpf");
  let typingTimer;
  const doneTypingInterval = 800;

  // Cria uma div para exibir a mensagem de validação abaixo do campo CPF
  const messageDiv = document.createElement("div");
  messageDiv.id = "message";
  messageDiv.className = "message";
  cpfInput.insertAdjacentElement("afterend", messageDiv);

  // Aplica máscara e inicia validação após pausa na digitação
  cpfInput.addEventListener("input", function (e) {
    clearTimeout(typingTimer);

    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    // Aplica a máscara XXX.XXX.XXX-XX
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = value;

    // Aguarda para validar o CPF
    typingTimer = setTimeout(() => {
      validarECriarFeedback(e.target.value);
    }, doneTypingInterval);
  });

  // Mostra mensagem de acordo com o status da validação do CPF
  function validarECriarFeedback(cpf) {
    const status = validarCpf(cpf);

    if (status === null) {
      messageDiv.textContent = "CPF incompleto";
      applyStyles("incompleto");
    } else if (status) {
      messageDiv.textContent = "CPF válido";
      applyStyles("valido");
    } else {
      messageDiv.textContent = "CPF inválido";
      applyStyles("invalido");
    }

    messageDiv.style.display = "block";

    // Esconde a mensagem após 4 segundos
    setTimeout(() => {
      messageDiv.style.display = "none";
      messageDiv.textContent = "";
      cpfInput.className = "";
      messageDiv.className = "message";
    }, 4000);
  }

  // Aplica classes CSS de acordo com status
  function applyStyles(status) {
    cpfInput.className = status;
    messageDiv.className = `message ${status}`;
  }
});

// ------------------------------
// Integração com a API ViaCEP
// ------------------------------

// Função para limpar os campos de endereço se o CEP for inválido ou não encontrado
function limpa_formulario_cep() {
  document.getElementById("rua").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("uf").value = "";
}

function meu_callback(conteudo) {
  if (!("erro" in conteudo)) {
    // Preenche os campos com os dados retornados
    document.getElementById("rua").value = conteudo.logradouro;
    document.getElementById("bairro").value = conteudo.bairro;
    document.getElementById("cidade").value = conteudo.localidade;
    document.getElementById("uf").value = conteudo.uf;
  } else {
    limpa_formulario_cep();
    alert("CEP não encontrado.");
  }
}

// Função principal para buscar o endereço ao sair do campo CEP
function pesquisacep(valor) {
  const cep = valor.replace(/\D/g, "");

  if (cep !== "") {
    const validacep = /^[0-9]{8}$/;

    if (validacep.test(cep)) {
      document.getElementById("rua").value = "...";
      document.getElementById("bairro").value = "...";
      document.getElementById("cidade").value = "...";
      document.getElementById("uf").value = "...";

      const script = document.createElement("script");
      script.src =
        "https://viacep.com.br/ws/" + cep + "/json/?callback=meu_callback";
      document.body.appendChild(script);
    } else {
      limpa_formulario_cep();
      alert("Formato de CEP inválido.");
    }
  } else {
    limpa_formulario_cep();
  }
}

// ------------------------------
// Envio do formulário e salvamento no localStorage
// ------------------------------

document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector("form")) return;

  const form = document.querySelector("form");
  const modal = document.getElementById("modalConfirmacao");
  const btnFechar = document.getElementById("btnFecharModal");
  const btnVisualizar = document.getElementById("btnVisualizar");

  // Intercepta o envio do formulário
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Cria o objeto com os dados preenchidos no formulário
    const novaNecessidade = {
      nome: document.getElementById("LoginNome").value,
      email: document.getElementById("LoginEmail").value,
      tipo: document.getElementById("Tipo").value,
      titulo: document.getElementById("LoginTitulo").value,
      descricao: document.getElementById("descricao").value,
      cpf: document.getElementById("LoginCpf").value,
      endereco: {
        cep: document.getElementById("cep").value,
        rua: document.getElementById("rua").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        uf: document.getElementById("uf").value,
      },
    };

    // Recupera lista existente ou cria nova
    const lista = JSON.parse(localStorage.getItem("necessidades")) || [];

    // Adiciona a nova necessidade
    lista.push(novaNecessidade);

    // Salva a nova lista no localStorage
    localStorage.setItem("necessidades", JSON.stringify(lista));

    // Limpa o formulário após o envio
    form.reset();

    // Mostra o modal de confirmação
    modal.style.display = "flex";
  });

  // Fecha o modal de confirmação
  btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Redireciona para a página de visualização
  btnVisualizar.addEventListener("click", () => {
    window.location.href = "visualizar.html";
  });
});

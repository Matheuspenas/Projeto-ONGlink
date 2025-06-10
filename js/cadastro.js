document.addEventListener("DOMContentLoaded", function () {
  function validarCpf(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return null;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

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

  // Cria a mensagem abaixo do campo
  const messageDiv = document.createElement("div");
  messageDiv.id = "message";
  messageDiv.className = "message";
  cpfInput.insertAdjacentElement("afterend", messageDiv);

  cpfInput.addEventListener("input", function (e) {
    clearTimeout(typingTimer);

    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    // Máscara
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = value;

    typingTimer = setTimeout(() => {
      validarECriarFeedback(e.target.value);
    }, doneTypingInterval);
  });

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

    setTimeout(() => {
      messageDiv.style.display = "none";
      messageDiv.textContent = "";
      cpfInput.className = "";
      messageDiv.className = "message";
    }, 4000);
  }

  function applyStyles(status) {
    cpfInput.className = status;
    messageDiv.className = `message ${status}`;
  }
});

// ------------------------------
// API ViaCEP
// ------------------------------

// Limpa os campos de endereço
function limpa_formulario_cep() {
  document.getElementById("rua").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("uf").value = "";
}

// Callback da API ViaCEP
function meu_callback(conteudo) {
  if (!("erro" in conteudo)) {
    document.getElementById("rua").value = conteudo.logradouro;
    document.getElementById("bairro").value = conteudo.bairro;
    document.getElementById("cidade").value = conteudo.localidade;
    document.getElementById("uf").value = conteudo.uf;
  } else {
    limpa_formulario_cep();
    alert("CEP não encontrado.");
  }
}

// Função principal chamada no onblur do input CEP
function pesquisacep(valor) {
  const cep = valor.replace(/\D/g, "");

  if (cep !== "") {
    const validacep = /^[0-9]{8}$/;

    if (validacep.test(cep)) {
      // Coloca "..." enquanto busca
      document.getElementById("rua").value = "...";
      document.getElementById("bairro").value = "...";
      document.getElementById("cidade").value = "...";
      document.getElementById("uf").value = "...";

      // Cria script dinâmico com callback
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

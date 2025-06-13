// ------------------------------
// Funções globais necessárias para o ViaCEP
// ------------------------------
function limpa_formulario_cep() {
  document.getElementById("rua").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("uf").value = "";
}

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
// Código principal do formulário
// ------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // -------- Validação de CPF --------
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
  const emailInput = document.getElementById("LoginEmail");
  let cpfValido = false;
  let emailValido = false;

  let typingTimer;
  const doneTypingInterval = 800;

  const messageDiv = document.createElement("div");
  messageDiv.id = "message";
  messageDiv.className = "message";
  cpfInput.insertAdjacentElement("afterend", messageDiv);

  cpfInput.addEventListener("input", function (e) {
    clearTimeout(typingTimer);

    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

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
      cpfValido = false;
    } else if (status) {
      messageDiv.textContent = "CPF válido";
      applyStyles("valido");
      cpfValido = true;
    } else {
      messageDiv.textContent = "CPF inválido";
      applyStyles("invalido");
      cpfValido = false;
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

  // -------- Validação de E-mail --------
  emailInput.addEventListener("input", () => {
    const valor = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailValido = emailRegex.test(valor);

    if (!emailValido) {
      emailInput.classList.add("invalido");
    } else {
      emailInput.classList.remove("invalido");
    }
  });

  // -------- Envio do Formulário --------
  const form = document.querySelector("form");
  const modal = document.getElementById("modalConfirmacao");
  const btnFechar = document.getElementById("btnFecharModal");
  const btnVisualizar = document.getElementById("btnVisualizar");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!cpfValido) {
      alert("CPF inválido. Corrija antes de enviar.");
      cpfInput.focus();
      return;
    }

    if (!emailValido) {
      alert("E-mail inválido. Corrija antes de enviar.");
      emailInput.focus();
      return;
    }

    const novaNecessidade = {
      nome: document.getElementById("LoginNome").value,
      email: emailInput.value,
      tipo: document.getElementById("Tipo").value,
      titulo: document.getElementById("LoginTitulo").value,
      descricao: document.getElementById("descricao").value,
      cpf: cpfInput.value,
      endereco: {
        cep: document.getElementById("cep").value,
        rua: document.getElementById("rua").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        uf: document.getElementById("uf").value,
      },
    };

    const lista = JSON.parse(localStorage.getItem("necessidades")) || [];
    lista.push(novaNecessidade);
    localStorage.setItem("necessidades", JSON.stringify(lista));
    form.reset();
    modal.style.display = "flex";
  });

  btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  btnVisualizar.addEventListener("click", () => {
    window.location.href = "visualizar.html";
  });
});

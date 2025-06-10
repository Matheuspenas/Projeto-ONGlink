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

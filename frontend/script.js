/*
=====================================
 FRONT-END — consome nossa API local
=====================================
Este arquivo roda no navegador, busca fotos e mostra os dados na tela.
*/

//=======================
// ELEMENTOS DO HTML
//=======================
const tenisImage = document.getElementById("tenisImage");
const modelName = document.getElementById("modelName");
const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const modelInput = document.getElementById("modelInput");
const tenisArea = document.querySelector(".tenis-area");

//==============================
// URL DA API
//==============================
const API = "http://localhost:3000/api/tenis";

//==============================
// FUNÇÃO PRINCIPAL
//==============================
async function buscarTenis(url) {
  // Mostrar o estado de carregamento
  tenisArea.classList.add("loading");
  try {
    // Fazer a requisição e converter a resposta para JSON
    const response = await fetch(url);
    const data = await response.json();
    console.log("Resposta da API:", data);

    // Verificar se a API retornou erro
    if (!response.ok || data.status === "error") {
      modelName.textContent = data.message;
      tenisImage.removeAttribute("src");
      tenisImage.hidden = true;
      return;
    }

    // Colocar a imagem do tênis na tela
    tenisImage.hidden = false;
    tenisImage.src = data.message;

    // O servidor envia o nome do modelo junto com a URL da imagem
    modelName.textContent = data.modelo;
  } catch (erro) {
    console.error(erro);
    modelName.textContent = "📴 Não foi possível consultar a API. Verifique se rodou: node script.js";
    tenisImage.removeAttribute("src");
    tenisImage.hidden = true;
  } finally {
    // Remover o carregamento tanto no sucesso quanto no erro
    tenisArea.classList.remove("loading");
  }
}

//==============================
// AÇÕES
//==============================
function tenisAleatorio() {
  buscarTenis(`${API}/aleatorio`);
}

function buscarPorModelo() {
  // Remover espaços nas pontas e transformar em minúsculas
  // A busca aceita o nome completo ou apenas a cor
  const modelo = modelInput.value.trim().toLowerCase();
  if (!modelo) {
    alert("Digite um modelo!");
    return;
  }
  buscarTenis(`${API}/${encodeURIComponent(modelo)}`);
}

//====================================
// EVENTOS
//====================================
randomBtn.addEventListener("click", tenisAleatorio);
searchBtn.addEventListener("click", buscarPorModelo);
tenisImage.addEventListener("click", tenisAleatorio);
modelInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buscarPorModelo();
  }
});

// Avisar quando o caminho está cadastrado, mas a foto não foi colocada
tenisImage.addEventListener("error", () => {
  tenisImage.hidden = true;
  modelName.textContent = "📂 Não foi possível exibir a foto. Confira o arquivo em backend/data/fotos.";
});

// CARREGA AO ABRIR A PÁGINA
tenisAleatorio();

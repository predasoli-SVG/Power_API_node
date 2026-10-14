
const tenisImage = document.getElementById("tenisImage");
const modelName = document.getElementById("modelName");
const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const modelInput = document.getElementById("modelInput");
const tenisArea = document.querySelector(".tenis-area");


const API = "http://localhost:3000/api/tenis";


async function buscarTenis(url) {
  
  tenisArea.classList.add("loading");
  try {
   
    const response = await fetch(url);
    const data = await response.json();
    console.log("Resposta da API:", data);

 
    if (!response.ok || data.status === "error") {
      modelName.textContent = data.message;
      tenisImage.removeAttribute("src");
      tenisImage.hidden = true;
      return;
    }

    
    tenisImage.hidden = false;
    tenisImage.src = data.message;

  
    modelName.textContent = data.modelo;
  } catch (erro) {
    console.error(erro);
    modelName.textContent = "❌ Não foi possível consultar a API. Verifique se rodou: node script.js";
    tenisImage.removeAttribute("src");
    tenisImage.hidden = true;
  } finally {
   
    tenisArea.classList.remove("loading");
  }
}


function tenisAleatorio() {
  buscarTenis(`${API}/aleatorio`);
}

function buscarPorModelo() {
 
  const modelo = modelInput.value.trim().toLowerCase();
  if (!modelo) {
    alert("Digite um modelo!");
    return;
  }
  buscarTenis(`${API}/${encodeURIComponent(modelo)}`);
}


randomBtn.addEventListener("click", tenisAleatorio);
searchBtn.addEventListener("click", buscarPorModelo);
tenisImage.addEventListener("click", tenisAleatorio);
modelInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buscarPorModelo();
  }
});


tenisImage.addEventListener("error", () => {
  tenisImage.hidden = true;
  modelName.textContent = "📂 Não foi possível exibir a foto. Confira o arquivo em backend/data/fotos.";
});


tenisAleatorio();

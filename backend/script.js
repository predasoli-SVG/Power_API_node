

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
const pastaFotos = path.join(__dirname, "data/fotos");

app.use(cors());
app.use("/fotos", express.static(pastaFotos));
app.use(express.static(path.join(__dirname, "../frontend")));


function sortear(array) {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}


function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}


function carregarFotos() {
  if (!fs.existsSync(pastaFotos)) {
    return [];
  }
  // voce nao explicou isso professor, e pelo que eu pesquisei Esse código pega uma lista, joga fora o que não for imagem e prepara os arquivos que sobraram para serem usados no sistema. 
  return fs.readdirSync(pastaFotos, { withFileTypes: true })
    .filter((arquivo) => arquivo.isFile() && /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(arquivo.name))
    .map((arquivo) => ({
      modelo: path.parse(arquivo.name).name,
      arquivo: arquivo.name,
    }));
}

function responderFoto(res, item) {
  res.json({
    status: "success",
    
    message: `http://localhost:${PORT}/fotos/${encodeURIComponent(item.arquivo)}`,
    modelo: item.modelo,
  });
}


app.get("/api/tenis/aleatorio", (req, res) => {
  const todasAsFotos = carregarFotos();
  if (!todasAsFotos.length) {
    res.status(404).json({
      status: "error",
      message: "Nenhuma imagem encontrada em backend/data/fotos",
    });
    return;
  }
  const item = sortear(todasAsFotos);
  responderFoto(res, item);
});

app.get("/api/tenis/:modelo", (req, res) => {
  const modelo = normalizar(req.params.modelo);
  
  const fotosDoModelo = carregarFotos().filter((item) =>
    normalizar(item.modelo).includes(modelo)
  );
  if (!modelo || !fotosDoModelo.length) {
    res.status(404).json({
      status: "error",
      message: `Modelo "${req.params.modelo}" não encontrado`,
    });
    return;
  }
  const item = sortear(fotosDoModelo);
  responderFoto(res, item);
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log("📂 Fotos ");
});

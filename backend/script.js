

// Importar o Express para criar o servidor
const express = require("express");
// Importar o CORS para permitir requisições do frontend
const cors = require("cors");
// Importar utilidades para trabalhar com caminhos de arquivos
const path = require("path");
// Importar o JSON que contém os modelos e caminhos das fotos
const fs = require("fs");
const tenis = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "tenis.json"), "utf8"));
// Criar a aplicação Express
const app = express();
// Definir a porta do servidor
const PORT = 3000;
// Habilitar o CORS
app.use(cors());


app.use("/fotos", express.static(path.join(__dirname, "data/fotos")));
// Servir o frontend para abrir a página em http://localhost:3000
app.use(express.static(path.join(__dirname, "../frontend")));


function sortear(array) {
  
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}


app.get("/api/tenis/aleatorio", (req, res) => {
  
  const todasAsFotos = Object.values(tenis).flat();
  const item = sortear(todasAsFotos);

  // Evitar retornar uma URL inválida se o cadastro estiver vazio
  if (!item) {
    res.status(404).json({
      status: "error",
      message: "Nenhuma foto cadastrada",
    });
    return;
  }

  // Responder ao cliente em formato JSON
  res.json({
    status: "success",
    message: `http://localhost:${PORT}/fotos/${item}`,
  });
});

// ROTA 2 - Tênis por modelo
// Exemplo: http://localhost:3000/api/tenis/air-force-1-branco
app.get("/api/tenis/:modelo", (req, res) => {
  // Pegar o parâmetro da URL e transformar em letras minúsculas
  const modelo = req.params.modelo.toLowerCase();
  // Verificar se o modelo pertence ao cadastro e possui fotos
  if (!Object.prototype.hasOwnProperty.call(tenis, modelo) || !tenis[modelo].length) {
    res.status(404).json({
      status: "error",
      message: `Modelo "${modelo}" não encontrado ou sem fotos cadastradas`,
    });
    return;
  }

  // Sortear uma foto do modelo solicitado
  const item = sortear(tenis[modelo]);
  res.json({
    status: "success",
    message: `http://localhost:${PORT}/fotos/${item}`,
  });
});

//======================================
// INICIA O SERVIDOR
//======================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log("📂 Coloque as fotos manualmente em: data/fotos/");
});


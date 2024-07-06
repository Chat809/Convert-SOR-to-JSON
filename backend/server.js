const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".sor") {
      return cb(new Error("Apenas arquivos .sor são permitidos"), false);
    }
    cb(null, true);
  },
});

const convertSorToJson = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const dataPoints = buffer.length / 4;
  const data = [];

  for (let i = 0; i < dataPoints; i++) {
    data.push(buffer.readFloatLE(i * 4));
  }

  return { data };
};

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Nenhum arquivo enviado" });

  const filePath = path.join("uploads", req.file.originalname);
  const outputFilePath = path.join(
    "uploads",
    req.file.originalname.replace(".sor", ".json")
  );

  try {
    const jsonData = convertSorToJson(filePath);
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
    res
      .status(200)
      .json({
        message: "Upload e conversão realizados com sucesso",
        filename: req.file.originalname,
        data: jsonData,
      });
  } catch (error) {
    console.error("Erro na conversão:", error);
    res.status(500).json({ message: "Falha na conversão do arquivo" });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    cb(null, path.extname(file.originalname) === ".sor");
  },
});

app.post("/upload", upload.single("file"), (req, res) => {
  const sorFilePath = req.file.path;
  const outputJsonPath = `uploads2/${path.basename(sorFilePath, ".sor")}.json`;

  fs.readFile(sorFilePath, "utf8", (err, data) => {
    if (err)
      return res.status(500).json({ message: "Erro ao ler o arquivo .sor" });

    const distances = [...data.matchAll(/<distance>([\d.]+)<\/distance>/g)].map(
      (m) => parseFloat(m[1])
    );

    fs.writeFile(
      outputJsonPath,
      JSON.stringify({ distances }, null, 2),
      "utf8",
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Erro ao criar o arquivo JSON" });

        res.json({
          message: "Conversão bem-sucedida",
          outputFile: outputJsonPath,
        });
      }
    );
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [message] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("Por favor, selecione um arquivo primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.message === "Conversão bem-sucedida") {
        console.log("Upload e conversão realizados com sucesso.");
      } else {
        console.error("Falha no upload ou na conversão.");
      }
    } catch (error) {
      console.error("Erro ao realizar o upload:", error);
      console.error("Verifique se o servidor está rodando e tente novamente.");
    }
  };

  return (
    <div className="App">
      <h1>Converter SOR para JSON</h1>
      <input id="file-upload" type="file" onChange={handleFileChange} />
      <label htmlFor="file-upload">Escolha o arquivo</label>
      <button onClick={handleUpload}>Upload e conversão</button>
      {!message && file && <p className="choiced-text">Arquivo selecionado: {file.name}</p>}
      {message && <p className="message-text">{message}</p>}
    </div>
  );
}

export default App;
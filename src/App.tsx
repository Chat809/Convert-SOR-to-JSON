import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecione um arquivo primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Upload realizado com sucesso");
      } else {
        alert("Falha no upload");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Falha no upload");
    }
  };

  return (
    <div className="App">
      <h1>Converter SOR para JSON</h1>
      <input id="file-upload" type="file" onChange={handleFileChange} />
      <label htmlFor="file-upload">Escolha o arquivo</label>
      <button onClick={handleUpload}>Upload e conversão</button>
      {file && <p className="choiced-text">Arquivo selecionado: {file.name}</p>}
    </div>
  );
}

export default App;
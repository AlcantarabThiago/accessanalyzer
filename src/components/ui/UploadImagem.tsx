import React, { useState } from "react";
import axios from "axios";

interface Props {
  // Função que será chamada após o upload com sucesso
  onUploadSuccess: (image: File, analise: string) => void;
}

const UploadImagem = ({ onUploadSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Quando o usuário seleciona um arquivo
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  // Função que envia o arquivo para o webhook do n8n
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // nome do campo esperado no n8n: "file"

    setCarregando(true);
    setErro("");

    try {
      const response = await axios.post(
        "http://host.docker.internal:5678/webhook/avaliar-prototipo", // <- Substituído pelo host local correto
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Captura a mensagem retornada pelo nó de IA no n8n
      const resultado = response.data.mensagem || "Análise realizada com sucesso.";

      // Passa o arquivo e o texto da análise para a tela de análise
      onUploadSuccess(file, resultado);
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      setErro("Erro ao enviar a imagem para análise.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      {/* Campo para selecionar imagem */}
      <input type="file" accept="image/*" onChange={handleChange} className="mb-2" />

      {/* Botão para enviar imagem */}
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={carregando || !file}
      >
        {carregando ? "Analisando..." : "Enviar para Análise"}
      </button>

      {/* Mensagem de erro (se houver) */}
      {erro && <p className="text-red-500 mt-2">{erro}</p>}
    </div>
  );
};

export default UploadImagem;

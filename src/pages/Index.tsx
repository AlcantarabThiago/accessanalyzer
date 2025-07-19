import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Eye, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Index = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ Limpeza ao carregar a página
  useEffect(() => {
    window.history.replaceState({}, document.title);
    localStorage.removeItem('imagemBase64');
    sessionStorage.removeItem('imagemBase64');
    setUploadedImage(null);
    setUploadError(null);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);
        setUploadError(null);
      } else {
        setUploadError("Formato de arquivo não suportado. Por favor, selecione uma imagem.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);
        setUploadError(null);
      } else {
        setUploadError("Formato de arquivo não suportado. Por favor, selecione uma imagem.");
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (!uploadedImage) {
      setUploadError("Nenhuma imagem selecionada para análise.");
      return;
    }

    try {
      setLoading(true);
      setUploadError(null);

      const apiUrl = "https://aiagent.alcantaran8n.com.br/webhook/acessibilidade";
      const formData = new FormData();
      formData.append('file', uploadedImage);

      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      const mensagemIA = response.data.mensagem || response.data.error || 'Análise concluída com sucesso.';
      const erroAPI = response.data.error ? response.data.error : null;

      navigate('/analysis', { state: { image: uploadedImage, mensagem: mensagemIA, erro: erroAPI } });

    } catch (error: any) {
      let errorMessage = "Erro ao enviar a imagem. Verifique a conexão com o servidor.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Erro do servidor: ${error.response.status} - ${error.response.data?.message || JSON.stringify(error.response.data)}`;
        } else if (error.request) {
          errorMessage = "Sem resposta do servidor. Verifique se o n8n está rodando.";
        } else {
          errorMessage = `Erro na requisição: ${error.message}`;
        }
      } else {
        errorMessage = `Erro inesperado: ${error.message}`;
      }

      setUploadError(errorMessage);
      navigate('/analysis', {
        state: { image: uploadedImage, erro: errorMessage }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                DesignSense AI
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Fazer Login
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Torne seus protótipos
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                mais acessíveis
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Faça upload do seu protótipo de tela e receba sugestões personalizadas e inteligentes 
              para melhorar a acessibilidade para pessoas com deficiência visual, auditiva, cognitiva e motora.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-2 text-gray-600">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-medium">Inclusão Universal</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-gray-600">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-medium">IA Inteligente</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-gray-600">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <span className="font-medium">Análise Visual</span>
              </div>
            </div>
          </div>

          <Card className="mb-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 shadow-lg">
            <CardContent className="p-12">
              <div
                className={`relative ${dragActive ? 'bg-blue-50 border-blue-300' : ''} rounded-lg transition-all duration-300`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="text-center">
                    <div className="w-40 h-40 mx-auto mb-6 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                      <img
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Preview do protótipo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {uploadedImage.name}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Protótipo carregado com sucesso! Pronto para análise de acessibilidade.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUploadedImage(null);
                          setUploadError(null);
                        }}
                        className="px-6 py-3"
                      >
                        Trocar Imagem
                      </Button>
                      <Button
                        type="button"
                        onClick={handleStartAnalysis}
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3 text-lg"
                        disabled={loading}
                      >
                        {loading ? 'Analisando...' : 'Iniciar Análise'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                    {uploadError && <p className="text-red-600 mt-4">{uploadError}</p>}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      Faça upload do seu protótipo
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Arraste e solte uma imagem aqui ou clique para selecionar do seu computador
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button asChild className="cursor-pointer bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3 text-lg">
                        <span>Selecionar Arquivo</span>
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500 mt-6">
                      Formatos suportados: PNG, JPG, JPEG • Tamanho máximo: 10MB
                    </p>
                    {uploadError && <p className="text-red-600 mt-4">{uploadError}</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;

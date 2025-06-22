import { useState, useEffect } from 'react'; // Adicione useEffect aqui
import { useNavigate, useLocation } from 'react-router-dom'; // Adicione useLocation aqui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Eye,
  Users,
  Brain,
  Lightbulb,
  CheckCircle,
  Zap,
  Scan
} from 'lucide-react';

// Importe UploadImagem se estiver sendo usado, embora não pareça neste componente diretamente
// import UploadImagem from '@/components/ui/UploadImagem';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation para acessar o estado passado
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState('');
  const [imagemEnviada, setImagemEnviada] = useState<File | null>(null);

  // Pega a imagem passada via state da navegação
  useEffect(() => {
    if (location.state?.image) {
      setImagemEnviada(location.state.image);
      // Inicia a simulação de análise assim que a imagem for carregada
      handleAnalysisStart(location.state.image);
    }
  }, [location.state?.image]); // Dependência na imagem do estado da location

  const analysisSteps = [
    { label: 'Carregando imagem...', description: 'Processando o protótipo enviado' },
    { label: 'Analisando contraste...', description: 'Verificando níveis de contraste WCAG' },
    { label: 'Verificando navegação...', description: 'Testando acessibilidade por teclado' },
    { label: 'Avaliando tipografia...', description: 'Analisando hierarquia e legibilidade' },
    { label: 'Identificando elementos...', description: 'Mapeando componentes interativos' },
    { label: 'Gerando sugestões...', description: 'Criando recomendações personalizadas' },
    { label: 'Finalizando análise...', description: 'Preparando relatório completo' }
  ];

  const handleAnalysisStart = async (image: File) => {
    // Não precisa de setImagemEnviada(image) aqui novamente, pois já está no useEffect

    // Simula etapas com barra de progresso
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      setCurrentAnalysis(analysisSteps[i].label);
      setProgress(((i + 1) / analysisSteps.length) * 100);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    }

    // AQUI É O PONTO CHAVE: Navega para a tela de resultados APÓS a simulação de progresso.
    // A chamada à API do n8n pode ser feita de forma assíncrona em segundo plano
    // ou removida temporariamente se não for necessária para a navegação imediata.

    let mensagemFinal = '';
    let erroFinal = '';

    try {
        // Cria um FormData para enviar o arquivo
        const formData = new FormData();
        formData.append('file', image, image.name); // 'file' é o nome do campo binário que o n8n espera

        const response = await fetch("https://primary-production-1e940.up.railway.app/webhook/acessibilidade", {
        method: "POST",
        // Com FormData, o navegador define o Content-Type automaticamente (multipart/form-data)
        // Você NÃO deve definir 'Content-Type': 'multipart/form-data' manualmente aqui,
        // pois o navegador precisa adicionar o 'boundary' correto.
        // Se você usar axios, é similar. Com fetch, apenas remova o header.
        // headers: { 'Content-Type': 'multipart/form-data' }, // <--- REMOVA ESTA LINHA OU COMENTE
         body: formData // <--- ENVIE O FORMDATA AQUI
     });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      mensagemFinal = result.mensagem || "Análise realizada, mas sem observações específicas.";
    } catch (error: any) {
      console.error("Erro ao analisar:", error);
      erroFinal = error.message || "Erro desconhecido";
    }

    // Navega para a tela de resultados com as informações (mesmo que a API tenha falhado)
    navigate("/result", {
      state: {
        image,
        mensagem: mensagemFinal,
        erro: erroFinal
      }
    });
  };

  // Remova a função handleUploadSuccess se ela não estiver sendo usada diretamente em um <UploadImagem> aqui.
  // Pelo que entendi do seu código, a imagem já é passada para essa tela via `Maps` do componente `Result.tsx` (ou o que seja o componente de upload).
  // Se `UploadImagem` é um componente que faz o upload e chama `handleUploadSuccess` dentro de `Analysis.tsx`,
  // então você precisaria de um `useEffect` para iniciar o `handleAnalysisStart` quando a imagem for definida.
  // Pelo seu anexo `image_6e699c.png` (a tela de upload), parece que o upload acontece em outra tela.
  // Assumindo que a imagem é passada via `Maps` para `Analysis.tsx`:


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Scan className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Analisando Acessibilidade
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <Lightbulb className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Análise em Progresso</h2>
                <p className="text-gray-600 mb-6">
                  Nossa IA está avaliando seu protótipo em busca de oportunidades de melhoria na acessibilidade
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{currentAnalysis}</span>
                    <span className="text-gray-500">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-gray-500">
                    {analysisSteps[analysisStep]?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Protótipo Original
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video border rounded-lg overflow-hidden bg-gray-50">
                  {imagemEnviada ? (
                    <img
                      src={URL.createObjectURL(imagemEnviada)}
                      alt="Protótipo sendo analisado"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Imagem não carregada
                    </div>
                  )}
                </div>
                {imagemEnviada && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Nome:</strong> {imagemEnviada.name}</p>
                    <p><strong>Tamanho:</strong> {Math.round(imagemEnviada.size / 1024)}KB</p>
                    <p><strong>Formato:</strong> {imagemEnviada.type}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Etapas da Análise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisSteps.map((step, index) => {
                    const isComplete = index < analysisStep;
                    const isCurrent = index === analysisStep;

                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isComplete ? 'bg-green-100 text-green-600' :
                          isCurrent ? 'bg-blue-100 text-blue-600 animate-pulse' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {isComplete ? <CheckCircle className="w-4 h-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            isComplete ? 'text-green-700' :
                            isCurrent ? 'text-blue-700' :
                            'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Categorias de Acessibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Visual</p>
                    <p className="text-sm text-blue-600">Contraste, fontes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Auditiva</p>
                    <p className="text-sm text-green-600">Legendas, áudio</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Cognitiva</p>
                    <p className="text-sm text-purple-600">Clareza, estrutura</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Motora</p>
                    <p className="text-sm text-orange-600">Navegação, foco</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
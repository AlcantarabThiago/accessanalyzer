import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState('');
  const [imagemEnviada, setImagemEnviada] = useState<File | null>(null);
  const hasAnalyzed = useRef(false); // <-- controle de repetição

  const analysisSteps = [
    { label: 'Carregando imagem...', description: 'Processando o protótipo enviado' },
    { label: 'Analisando contraste...', description: 'Verificando níveis de contraste WCAG' },
    { label: 'Verificando navegação...', description: 'Testando acessibilidade por teclado' },
    { label: 'Avaliando tipografia...', description: 'Analisando hierarquia e legibilidade' },
    { label: 'Identificando elementos...', description: 'Mapeando componentes interativos' },
    { label: 'Gerando sugestões...', description: 'Criando recomendações personalizadas' },
    { label: 'Finalizando análise...', description: 'Preparando relatório completo' }
  ];

  useEffect(() => {
    if (location.state?.image && !hasAnalyzed.current) {
      setImagemEnviada(location.state.image);
      hasAnalyzed.current = true; // evita reanálise
      handleAnalysisStart(location.state.image);
    }
  }, [location.state]);

  const handleAnalysisStart = async (image: File) => {
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      setCurrentAnalysis(analysisSteps[i].label);
      setProgress(((i + 1) / analysisSteps.length) * 100);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    }

    let mensagemFinal = '';
    let erroFinal = '';

    try {
      const formData = new FormData();
      formData.append('file', image, image.name);

      const response = await fetch("https://aiagent.alcantaran8n.com.br/webhook/acessibilidade", {
        method: "POST",
        body: formData
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

    navigate("/result", {
      state: {
        image,
        mensagem: mensagemFinal,
        erro: erroFinal
      }
    });
  };

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
              Voltar para Upload
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
        </div>
      </main>
    </div>
  );
};

export default Analysis;

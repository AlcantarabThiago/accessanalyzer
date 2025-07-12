import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Eye,
  Users,
  Brain,
  Download,
  CheckCircle,
  XCircle,
  Zap,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface Suggestion {
  id: string;
  category: 'visual' | 'auditiva' | 'cognitiva' | 'motora';
  severity: 'alta' | 'média' | 'baixa';
  title: string;
  description: string;
  improvement: string;
  position?: { x: number; y: number };
}

interface UploadedFile {
  file: File;
  id: string;
  name: string;
}

// Interface para os dados esperados do `location.state`
interface ResultState {
  image?: File;
  mensagem?: string; // Mensagem geral da IA
  erro?: string;    // Mensagem de erro, se a chamada à API falhou
}

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Desestrutura os dados do state da navegação
  const { image, mensagem, erro: propErro } = (location.state || {}) as ResultState;

  const [selectedUpload, setSelectedUpload] = useState<UploadedFile | null>(null);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [erroDisplay, setErroDisplay] = useState<string | null>(propErro || null); // Usa o erro passado via prop, se existir

  useEffect(() => {
    // Se a imagem foi passada, configure-a para exibição
    if (image) {
      const uploadedFile: UploadedFile = {
        file: image,
        id: 'main-prototype', // ID único para a imagem principal
        name: image.name || 'Protótipo Principal'
      };
      setUploads([uploadedFile]); // Apenas a imagem principal
      setSelectedUpload(uploadedFile); // Seleciona a imagem principal
    } else {
      setErroDisplay("Nenhuma imagem de protótipo foi fornecida para análise.");
    }

    // Processa a mensagem ou erro vindo da Analysis.tsx
    if (propErro) {
      setErroDisplay(propErro);
      setSuggestions([]); // Limpa sugestões em caso de erro
    } else if (mensagem) {
      // Se houver uma mensagem da IA, transforme-a em uma sugestão
      setSuggestions([
        {
          id: 'ia-result-001',
          category: 'visual', // Categoria padrão, pode ser aprimorado com IA no futuro
          severity: 'média',  // Severidade padrão
          title: 'Análise Geral de Acessibilidade (IA)',
          description: mensagem,
          improvement: 'Revise os pontos destacados pela IA para melhorar a acessibilidade do protótipo.',
        }
      ]);
      setErroDisplay(null); // Limpa qualquer erro anterior se a mensagem da IA chegou
    } else {
      setSuggestions([]);
      setErroDisplay("Análise concluída, mas sem observações específicas da IA.");
    }
  }, [location.state, image, mensagem, propErro]); // Dependências do useEffect

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visual': return <Eye className="w-4 h-4" />;
      case 'auditiva': return <Users className="w-4 h-4" />;
      case 'cognitiva': return <Brain className="w-4 h-4" />;
      case 'motora': return <Zap className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'visual': return 'bg-blue-100 text-blue-800';
      case 'auditiva': return 'bg-green-100 text-green-800';
      case 'cognitiva': return 'bg-purple-100 text-purple-800';
      case 'motora': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'alta': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'média': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'baixa': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  // ===== BLOCO NOVO: PARSE DE CRITÉRIOS DA RESPOSTA IA (se vier em JSON/texto) =====
  let criteriosIA: any[] = [];
  try {
    if (suggestions.length > 0 && suggestions[0].description) {
      if (typeof suggestions[0].description === "string" && suggestions[0].description.trim().startsWith('[')) {
        criteriosIA = JSON.parse(suggestions[0].description);
      } else if (Array.isArray(suggestions[0].description)) {
        criteriosIA = suggestions[0].description;
      }
    }
  } catch (e) {
    criteriosIA = [];
  }
  // ===== FIM DO BLOCO NOVO =====

  // Se não houver imagem principal ou erro grave de dados, redireciona para o início
  if (!image && !erroDisplay) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/analysis', { state: { image: image } })}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Análise
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Resultado Final
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">

          {/* Coluna para a imagem e talvez "outros uploads" */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Protótipo Analisado
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <div className="flex flex-col h-full">
                <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-2 mb-4">
                  {selectedUpload ? (
                    <img
                      src={URL.createObjectURL(selectedUpload.file)}
                      alt={selectedUpload.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400">Nenhuma imagem selecionada para exibição.</div>
                  )}
                </div>
                {selectedUpload && (
                  <div className="text-sm text-gray-600 p-2 border-t mt-2">
                    <p><strong>Nome:</strong> {selectedUpload.name}</p>
                    <p><strong>Tamanho:</strong> {Math.round(selectedUpload.file.size / 1024)}KB</p>
                    <p><strong>Formato:</strong> {selectedUpload.file.type}</p>
                  </div>
                )}
                {selectedUpload && (
                  <Button className="mt-4 w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Protótipo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Observações Detalhadas (Sugestões da IA) */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Observações Detalhadas
                <Badge variant="secondary">{suggestions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] p-0">
              <ScrollArea className="h-full px-6">
                <div className="space-y-6 py-6">
                  {erroDisplay && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md border border-red-300">
                      <strong>Erro ao exibir análise:</strong> {erroDisplay}
                    </div>
                  )}
                  {!erroDisplay && suggestions.length === 0 && (
                     <div className="bg-blue-100 text-blue-800 p-4 rounded-md border border-blue-300 text-center">
                        <p className="font-medium">Nenhuma observação específica da IA foi retornada.</p>
                        <p className="text-sm">Isso pode significar que o protótipo já está otimizado ou que houve um erro genérico na análise.</p>
                     </div>
                  )}
                  {!erroDisplay && suggestions.length > 0 && suggestions.map((suggestion, index) => (
                    <div key={suggestion.id}>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getSeverityIcon(suggestion.severity)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="secondary" className={getCategoryColor(suggestion.category)}>
                                {getCategoryIcon(suggestion.category)}
                                <span className="ml-1 capitalize">{suggestion.category}</span>
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                Prioridade {suggestion.severity}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                            <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                              <h5 className="font-medium text-gray-900 mb-1">Problema identificado:</h5>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">{suggestion.description}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <h5 className="font-medium text-green-900 mb-1">Ação recomendada:</h5>
                              <p className="text-sm text-green-800 whitespace-pre-wrap">{suggestion.improvement}</p>
                            </div>
                            {suggestion.position && (
                              <div className="mt-2 text-xs text-gray-500">
                                Localização: X:{suggestion.position.x}px, Y:{suggestion.position.y}px
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < suggestions.length - 1 && <Separator className="my-6" />}
                    </div>
                  ))}

                  {/* ===== BLOCO NOVO: CARDS DOS CRITÉRIOS DE ACESSIBILIDADE ===== */}
                  {criteriosIA.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-blue-900 mt-4 mb-2">Critérios Detalhados da Acessibilidade</h4>
                      <div className="grid gap-4">
                        {criteriosIA.map((criterio, i) => (
                          <div
                            key={i}
                            className={`rounded-lg shadow p-4 border-l-4 ${
                              criterio.nivel === "Sucesso"
                                ? "border-green-500 bg-green-50"
                                : criterio.nivel === "Atenção"
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-red-500 bg-red-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-gray-700">{criterio.criterio} – {criterio.titulo}</span>
                              {criterio.nivel === "Sucesso" && (
                                <span className="text-green-600 font-medium">✔</span>
                              )}
                              {criterio.nivel === "Atenção" && (
                                <span className="text-yellow-600 font-medium">⚠️</span>
                              )}
                              {criterio.nivel === "Erro" && (
                                <span className="text-red-600 font-medium">✖</span>
                              )}
                            </div>
                            <div className="text-gray-700 mb-1 text-sm">
                              <strong>Status:</strong> {criterio.status}
                            </div>
                            <div className="text-gray-600 text-sm">{criterio.descricao}</div>
                            {criterio.sugestao && (
                              <div className="mt-2 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                                <strong>Sugestão:</strong> {criterio.sugestao}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* ===== FIM DO BLOCO NOVO ===== */}

                </div>
              </ScrollArea>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default Result;

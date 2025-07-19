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

interface ResultState {
  image?: File;
  mensagem?: any;
  erro?: string;
}

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { image, mensagem, erro: propErro } = (location.state || {}) as ResultState;

  const [selectedUpload, setSelectedUpload] = useState<UploadedFile | null>(null);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [erroDisplay, setErroDisplay] = useState<string | null>(propErro || null);

  useEffect(() => {
    if (image) {
      const uploadedFile: UploadedFile = {
        file: image,
        id: 'main-prototype',
        name: image.name || 'Protótipo Principal'
      };
      setUploads([uploadedFile]);
      setSelectedUpload(uploadedFile);
    } else {
      setErroDisplay("Nenhuma imagem de protótipo foi fornecida para análise.");
    }

    if (propErro) {
      setErroDisplay(propErro);
      setSuggestions([]);
    } else if (mensagem) {
      try {
        const achados = mensagem?.achados;
        if (Array.isArray(achados) && achados.length > 0) {
          const parsedSuggestions: Suggestion[] = achados.map((item: any, index: number) => ({
            id: `ia-${index}`,
            category: 'visual',
            severity: (item.nivel || 'média').toLowerCase(),
            title: `${item.criterio} – ${item.titulo}`,
            description: item.descricao || '',
            improvement: item.sugestao || '',
          }));
          setSuggestions(parsedSuggestions);
          setErroDisplay(null);
        } else {
          setSuggestions([
            {
              id: 'ia-default',
              category: 'visual',
              severity: 'média',
              title: 'Análise Geral de Acessibilidade (IA)',
              description: typeof mensagem === 'string' ? mensagem : JSON.stringify(mensagem, null, 2),
              improvement: 'Revise os pontos destacados pela IA para melhorar a acessibilidade do protótipo.',
            }
          ]);
          setErroDisplay(null);
        }
      } catch (e) {
        setSuggestions([]);
        setErroDisplay("Erro ao processar os dados retornados pela IA.");
      }
    } else {
      setSuggestions([]);
      setErroDisplay("Análise concluída, mas sem observações específicas da IA.");
    }
  }, [location.state, image, mensagem, propErro]);

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

  if (!image && !erroDisplay) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
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

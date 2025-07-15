
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Users, Lightbulb, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>([]);
  const [objective, setObjective] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [prototypePurpose, setPrototypePurpose] = useState('');
  const navigate = useNavigate();

  const disabilities = [
    {
      id: 'visual',
      name: 'Deficiência Visual',
      description: 'Cegueira, baixa visão, daltonismo',
      icon: Eye,
      color: 'blue'
    },
    {
      id: 'hearing',
      name: 'Deficiência Auditiva',
      description: 'Surdez, perda auditiva',
      icon: Users,
      color: 'green'
    },
    {
      id: 'cognitive',
      name: 'Deficiência Cognitiva',
      description: 'Autismo, TDAH, dislexia',
      icon: Lightbulb,
      color: 'purple'
    },
    {
      id: 'motor',
      name: 'Deficiência Motora',
      description: 'Limitações de movimento, paralisia',
      icon: Shield,
      color: 'orange'
    }
  ];

  const handleDisabilityChange = (disabilityId: string, checked: boolean) => {
    if (checked) {
      setSelectedDisabilities([...selectedDisabilities, disabilityId]);
    } else {
      setSelectedDisabilities(selectedDisabilities.filter(id => id !== disabilityId));
    }
  };

  const handleContinue = () => {
    if (selectedDisabilities.length > 0 && objective && targetAudience && prototypePurpose) {
      // Passamos as configurações via state para a próxima página
      navigate('/', { 
        state: { 
          selectedDisabilities, 
          objective, 
          targetAudience, 
          prototypePurpose 
        } 
      });
    }
  };

  const isFormValid = selectedDisabilities.length > 0 && objective && targetAudience && prototypePurpose;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              DesignSense AI
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Configure sua análise de acessibilidade
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Defina quais aspectos de acessibilidade você deseja analisar em seu protótipo para obter sugestões mais precisas e direcionadas.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Seleção de Deficiências */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Tipos de Deficiência para Análise
                </CardTitle>
                <p className="text-gray-600">
                  Selecione os tipos de deficiência que você deseja considerar na análise do seu protótipo
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {disabilities.map((disability) => {
                    const IconComponent = disability.icon;
                    return (
                      <div key={disability.id} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={disability.id}
                          checked={selectedDisabilities.includes(disability.id)}
                          onCheckedChange={(checked) => handleDisabilityChange(disability.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-6 h-6 bg-${disability.color}-100 rounded flex items-center justify-center`}>
                              <IconComponent className={`w-4 h-4 text-${disability.color}-600`} />
                            </div>
                            <Label htmlFor={disability.id} className="font-medium cursor-pointer">
                              {disability.name}
                            </Label>
                          </div>
                          <p className="text-sm text-gray-600">{disability.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Informações do Projeto */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Protótipo</CardTitle>
                <p className="text-gray-600">
                  Nos ajude a entender melhor seu projeto para fornecer sugestões mais personalizadas
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Tipo de Aplicação</Label>
                  <Select value={prototypePurpose} onValueChange={setPrototypePurpose}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de aplicação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website institucional</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="webapp">Aplicação web</SelectItem>
                      <SelectItem value="mobile">Aplicativo mobile</SelectItem>
                      <SelectItem value="dashboard">Dashboard/Painel administrativo</SelectItem>
                      <SelectItem value="educational">Plataforma educacional</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Público-alvo</Label>
                  <Textarea
                    id="target"
                    placeholder="Descreva o público-alvo do seu protótipo (idade, perfil, necessidades específicas...)"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">Objetivo Principal</Label>
                  <Textarea
                    id="objective"
                    placeholder="Qual é o principal objetivo desta interface? O que o usuário deve conseguir fazer?"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botão de Continuar */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                disabled={!isFormValid}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar para Upload
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {!isFormValid && (
              <p className="text-center text-sm text-gray-500">
                Preencha todos os campos e selecione pelo menos um tipo de deficiência para continuar
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup;

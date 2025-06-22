
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, Lightbulb, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login - em produção, aqui seria a validação real
    if (email && password) {
      navigate('/setup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Seção de Marketing/Publicidade */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  AccessAnalyzer
                </h1>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Transforme seus protótipos em experiências verdadeiramente
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> acessíveis</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Nossa IA analisa seus protótipos de interface e fornece sugestões personalizadas para torná-los acessíveis a pessoas com deficiências visuais, auditivas, cognitivas e motoras.
              </p>
            </div>

            {/* Benefícios */}
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Análise Inteligente</h3>
                  <p className="text-gray-600">IA especializada identifica problemas de acessibilidade em segundos</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Inclusão Universal</h3>
                  <p className="text-gray-600">Torne sua interface acessível para todos os tipos de deficiência</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sugestões Práticas</h3>
                  <p className="text-gray-600">Receba orientações claras sobre como implementar melhorias</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Conformidade WCAG</h3>
                  <p className="text-gray-600">Garanta que seus projetos atendam aos padrões internacionais</p>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">1.3B</div>
                  <div className="text-sm text-gray-600">Pessoas com deficiência no mundo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">96%</div>
                  <div className="text-sm text-gray-600">Sites com problemas de acessibilidade</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">$13T</div>
                  <div className="text-sm text-gray-600">Poder de compra global</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Login */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Entre na sua conta
                </CardTitle>
                <p className="text-gray-600">
                  Acesse o AccessAnalyzer e comece a criar interfaces mais inclusivas
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium"
                  >
                    Entrar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Cadastre-se gratuitamente
                    </button>
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    Ao entrar, você concorda com nossos{' '}
                    <button className="text-blue-600 hover:text-blue-700">Termos de Uso</button>
                    {' '}e{' '}
                    <button className="text-blue-600 hover:text-blue-700">Política de Privacidade</button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

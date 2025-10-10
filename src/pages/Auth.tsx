import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [manualAddress, setManualAddress] = useState(false);
  const [signupData, setSignupData] = useState({
    profileType: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    cep: "",
    uf: "",
    municipality: "",
    street: "",
    neighborhood: "",
    complement: "",
    termsAccepted: false,
    privacyAccepted: false,
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login - substituir com Lovable Cloud
    setTimeout(() => {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  const handleCepBlur = async () => {
    if (signupData.cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${signupData.cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setSignupData(prev => ({
            ...prev,
            uf: data.uf,
            municipality: data.localidade,
            street: data.logradouro,
            neighborhood: data.bairro,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (!signupData.termsAccepted || !signupData.privacyAccepted) {
      toast.error("Você deve aceitar os termos de uso e privacidade");
      setIsLoading(false);
      return;
    }

    // Aqui você pode integrar com seu banco MySQL depois
    console.log("Dados de cadastro:", signupData);
    
    // Solicitar permissão de localização após cadastro
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.success("Cadastro realizado! Localização permitida.");
          navigate("/dashboard");
        },
        (error) => {
          toast.success("Cadastro realizado! Você pode permitir a localização depois.");
          navigate("/dashboard");
        }
      );
    } else {
      toast.success("Cadastro realizado com sucesso!");
      navigate("/dashboard");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="bg-primary p-3 rounded-xl">
            <MapPin className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">RADCI</h1>
            <p className="text-sm text-muted-foreground">Cidade Mais Inteligente</p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo de volta</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-mail</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                  <div className="text-center">
                    <a href="#" className="text-sm text-primary hover:underline">
                      Esqueceu sua senha?
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para começar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <Label htmlFor="profile-type">Perfil *</Label>
                    <Select 
                      value={signupData.profileType} 
                      onValueChange={(value) => setSignupData(prev => ({ ...prev, profileType: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Cidadão</SelectItem>
                        <SelectItem value="public_admin">Administrador Público</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full-name">Nome Completo *</Label>
                    <Input
                      id="full-name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail Institucional *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu.email@instituicao.gov.br"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha *</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="••••••••"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={signupData.cep}
                      onChange={(e) => setSignupData(prev => ({ ...prev, cep: e.target.value.replace(/\D/g, '') }))}
                      onBlur={handleCepBlur}
                      placeholder="00000000"
                      maxLength={8}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="manual-address" 
                      checked={manualAddress}
                      onCheckedChange={(checked) => setManualAddress(checked as boolean)}
                    />
                    <Label htmlFor="manual-address" className="text-sm font-normal cursor-pointer">
                      Preencher endereço manualmente
                    </Label>
                  </div>

                  {(manualAddress || signupData.cep.length === 8) && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="uf">UF</Label>
                          <Input
                            id="uf"
                            value={signupData.uf}
                            onChange={(e) => setSignupData(prev => ({ ...prev, uf: e.target.value.toUpperCase() }))}
                            placeholder="SP"
                            maxLength={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="municipality">Município</Label>
                          <Input
                            id="municipality"
                            value={signupData.municipality}
                            onChange={(e) => setSignupData(prev => ({ ...prev, municipality: e.target.value }))}
                            placeholder="São Paulo"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          value={signupData.street}
                          onChange={(e) => setSignupData(prev => ({ ...prev, street: e.target.value }))}
                          placeholder="Nome da rua"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          value={signupData.neighborhood}
                          onChange={(e) => setSignupData(prev => ({ ...prev, neighborhood: e.target.value }))}
                          placeholder="Nome do bairro"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          value={signupData.complement}
                          onChange={(e) => setSignupData(prev => ({ ...prev, complement: e.target.value }))}
                          placeholder="Apto, bloco, etc. (opcional)"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={signupData.termsAccepted}
                        onCheckedChange={(checked) => setSignupData(prev => ({ ...prev, termsAccepted: checked as boolean }))}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-tight">
                        Eu li e concordo com os termos de uso *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="privacy" 
                        checked={signupData.privacyAccepted}
                        onCheckedChange={(checked) => setSignupData(prev => ({ ...prev, privacyAccepted: checked as boolean }))}
                        required
                      />
                      <Label htmlFor="privacy" className="text-sm font-normal cursor-pointer leading-tight">
                        Eu li e concordo com os termos de privacidade *
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            Voltar para o início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

import { Button } from "@/components/ui/button";
import { MapPin, Camera, TrendingUp, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: "Relato Visual",
      description: "Adicione fotos e vídeos para documentar problemas urbanos de forma clara e objetiva"
    },
    {
      icon: MapPin,
      title: "Localização Precisa",
      description: "Sistema de geolocalização para identificar exatamente onde está o problema"
    },
    {
      icon: TrendingUp,
      title: "Acompanhamento",
      description: "Monitore o progresso das suas ocorrências em tempo real"
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Junte-se a milhares de cidadãos engajados em melhorar a cidade"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-white space-y-8 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold">RADCI</h1>
                  <p className="text-white/90 text-sm lg:text-base font-medium mt-1">
                    Radar de Avaliações dos Drivers de uma Cidade Mais Inteligente
                  </p>
                </div>
              </div>

              <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
                Transforme sua cidade com a força da{" "}
                <span className="text-primary-light">comunidade</span>
              </h2>

              <p className="text-xl text-white/90 leading-relaxed">
                Relate problemas urbanos, sugira melhorias e acompanhe as mudanças em tempo real. 
                Juntos, construímos uma cidade mais inteligente e acessível para todos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/auth")}
                  className="text-lg group"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                >
                  Fazer Login
                </Button>
              </div>
            </div>

            {/* Right Side - Visual Element */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-secondary rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                        <div className="h-20 bg-white/30 rounded-lg mb-2"></div>
                        <div className="h-3 bg-white/40 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Como o RADCI funciona
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uma plataforma completa para conectar cidadãos e gestores públicos, 
              facilitando a comunicação e acelerando soluções urbanas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="gradient-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 text-white animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Pronto para transformar sua cidade?
            </h2>
            <p className="text-xl text-white/90">
              Junte-se a milhares de cidadãos que já estão fazendo a diferença. 
              Cadastre-se gratuitamente e comece hoje mesmo!
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg group"
            >
              <span>Começar Agora</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xl font-bold text-card-foreground">RADCI</div>
                <div className="text-sm text-muted-foreground">
                  Construindo cidades mais inteligentes
                </div>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2025 RADCI. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

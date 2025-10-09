import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, List, TrendingUp, LogOut, Search, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";
import MobileNav from "@/components/MobileNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/report/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-8">
      {/* Header com localização e avatar */}
      <header className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          {/* Top Row - Location & Avatar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-primary-foreground">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Rio de Janeiro</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="w-9 h-9 cursor-pointer" onClick={() => navigate("/account")}>
                <AvatarFallback className="bg-white/20 text-primary-foreground">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Welcome & Search */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-primary-foreground">Olá, Usuário</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Busque em todo o RADCI" 
                className="pl-10 bg-white/90 border-0 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Categories Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-foreground mb-3">
            Registre ocorrências na sua cidade
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Publique ocorrências ou sugestões e contribua com a melhoria da sua cidade.
          </p>
          
          {/* Circular Categories - Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex flex-col items-center min-w-[80px] group"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 transition-all group-hover:shadow-lg group-hover:scale-105">
                    <Icon className={`w-7 h-7 ${category.color}`} />
                  </div>
                  <span className="text-xs text-center text-muted-foreground leading-tight max-w-[80px]">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priorities Survey Section */}
        <Card className="mb-8 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/priorities")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Pesquisa de Prioridades</CardTitle>
                <CardDescription>Ordene o que é mais importante para você</CardDescription>
              </div>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Ajude a definir as prioridades da sua cidade ordenando as categorias
            </p>
            <Button className="w-full" onClick={(e) => {
              e.stopPropagation();
              navigate("/priorities");
            }}>
              Responder Pesquisa
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/my-reports")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minhas Ocorrências</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impacto</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">pessoas</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Dashboard;

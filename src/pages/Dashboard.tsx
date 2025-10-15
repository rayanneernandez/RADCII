import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, List, TrendingUp, LogOut, Search, Bell, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";
import MobileNav from "@/components/MobileNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [incidentsCount, setIncidentsCount] = useState(0);

  useEffect(() => {
    fetchRecentIncidents();
  }, []);

  const fetchRecentIncidents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) {
      setRecentIncidents(data);
      setIncidentsCount(data.length);
    }
  };

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

        {/* Minhas Ocorrências Recentes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">
              Minhas Ocorrências
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/my-reports")}>
              Ver todas
            </Button>
          </div>

          {recentIncidents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <List className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma ocorrência registrada
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece agora e ajude a melhorar sua cidade!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <Card key={incident.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{incident.category_name}</CardTitle>
                      <Badge variant={incident.status === "pending" ? "secondary" : "default"}>
                        {incident.status === "pending" ? "Pendente" : 
                         incident.status === "in_progress" ? "Em andamento" : "Resolvida"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {incident.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {incident.address}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-24 right-6 md:bottom-8 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow z-40"
        onClick={() => navigate("/dashboard")}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <MobileNav />
    </div>
  );
};

export default Dashboard;

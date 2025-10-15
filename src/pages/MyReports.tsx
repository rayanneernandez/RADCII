import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/MobileNav";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MyReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setReports(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Minhas Ocorrências
          </h1>
          <p className="text-muted-foreground">
            Acompanhe todas as suas manifestações registradas
          </p>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma ocorrência registrada
              </h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não registrou nenhuma ocorrência. Comece agora e ajude a melhorar sua cidade!
              </p>
              <Button onClick={() => navigate("/dashboard")}>
                Registrar Primeira Ocorrência
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report: any) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{report.category_name}</CardTitle>
                    <Badge variant={report.status === "pending" ? "secondary" : "default"}>
                      {report.status === "pending" ? "Pendente" : 
                       report.status === "in_progress" ? "Em andamento" : "Resolvida"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {report.address}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(report.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                    {report.media_urls && report.media_urls.length > 0 && (
                      <div className="flex items-center">
                        <Image className="w-3 h-3 mr-1" />
                        Com mídia
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default MyReports;

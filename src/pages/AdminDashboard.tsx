import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Buscar total de ocorrências
    const { data: allIncidents } = await supabase
      .from("incidents")
      .select("*");

    if (allIncidents) {
      const pending = allIncidents.filter(i => i.status === "pending").length;
      const inProgress = allIncidents.filter(i => i.status === "in_progress").length;
      const resolved = allIncidents.filter(i => i.status === "resolved").length;

      setStats({
        total: allIncidents.length,
        pending,
        inProgress,
        resolved
      });

      // Agrupar por categoria
      const categoryMap = new Map();
      allIncidents.forEach(incident => {
        const current = categoryMap.get(incident.category_name) || 0;
        categoryMap.set(incident.category_name, current + 1);
      });

      const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value
      }));
      setCategoryStats(categoryData);
    }

    setLoading(false);
  };

  const statusData = [
    { name: "Pendentes", value: stats.pending, color: "#FFA500" },
    { name: "Em Andamento", value: stats.inProgress, color: "#4169E1" },
    { name: "Resolvidas", value: stats.resolved, color: "#32CD32" }
  ];

  const COLORS = ["#FFA500", "#4169E1", "#32CD32"];

  return (
    <div className="min-h-screen bg-muted/30 pb-8">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-primary-foreground">
            Dashboard Administrativo
          </h1>
          <p className="text-primary-foreground/80 mt-1">
            Visão geral de todas as ocorrências registradas
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Registradas no sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando análise
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Sendo processadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">
                Finalizadas com sucesso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Status */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>Visualização do status das ocorrências</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Categorias */}
          <Card>
            <CardHeader>
              <CardTitle>Ocorrências por Categoria</CardTitle>
              <CardDescription>Distribuição por tipo de ocorrência</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--primary))" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Taxa de Resolução */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Taxa de Resolução</CardTitle>
            <CardDescription>Percentual de ocorrências resolvidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resolvidas</span>
                <span className="text-sm text-muted-foreground">
                  {stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em Andamento</span>
                <span className="text-sm text-muted-foreground">
                  {stats.total > 0 ? ((stats.inProgress / stats.total) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pendentes</span>
                <span className="text-sm text-muted-foreground">
                  {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

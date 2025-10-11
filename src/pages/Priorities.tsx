import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GripVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";
import { toast } from "sonner";

const Priorities = () => {
  const navigate = useNavigate();
  const [orderedCategories, setOrderedCategories] = useState([...categories]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newCategories = [...orderedCategories];
    const draggedItem = newCategories[draggedIndex];
    
    newCategories.splice(draggedIndex, 1);
    newCategories.splice(index, 0, draggedItem);
    
    setOrderedCategories(newCategories);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    // Aqui você salvaria as prioridades no backend
    toast.success("Obrigado! Suas prioridades foram salvas com sucesso!");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Definir Prioridades
          </h1>
          <p className="text-muted-foreground">
            Arraste as categorias para ordenar por ordem de importância
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ordem de Prioridade</CardTitle>
            <CardDescription>
              A primeira categoria será considerada a mais importante para você
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {orderedCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    flex items-center space-x-4 p-4 bg-card border border-border rounded-lg cursor-move
                    hover:shadow-md transition-all duration-200
                    ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}
                  `}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full font-bold text-primary">
                    {index + 1}
                  </div>
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                  <div className="bg-muted rounded-full p-2">
                    <Icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <span className="flex-1 font-medium text-foreground">
                    {category.name}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Salvar Prioridades
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Priorities;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, MapPin, Upload, X, Loader2 } from "lucide-react";
import { categories } from "@/data/categories";
import { toast } from "sonner";
import LocationMap from "@/components/LocationMap";

const ReportIncident = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    address: "",
    cep: "",
    type: "",
    description: "",
    files: [] as File[],
    coordinates: [-22.9068, -43.1729] as [number, number] // Rio de Janeiro default
  });

  const category = categories.find(c => c.id === categoryId);
  const Icon = category?.icon;

  // Geolocalização automática removida temporariamente

  const handleCepChange = async (cep: string) => {
    setFormData(prev => ({ ...prev, cep }));
    
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          const fullAddress = `${data.logradouro}, ${data.bairro} - ${data.localidade}, ${data.uf}`;
          setFormData(prev => ({ ...prev, address: fullAddress }));
          toast.success("Endereço encontrado!");
          
          // Aqui você poderia fazer uma geocodificação para obter coordenadas
          // Por simplicidade, vamos manter as coordenadas do Rio
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.address || !formData.cep) {
        toast.error("Preencha o endereço e CEP");
        return;
      }
      setStep(2);
    } else {
      // Simula o envio da ocorrência
      toast.success("Ocorrência registrada com sucesso!");
      navigate("/my-reports");
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Categoria não encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => step === 1 ? navigate("/dashboard") : setStep(1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Category Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-muted rounded-full p-4">
            {Icon && <Icon className={`w-8 h-8 ${category.color}`} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
            <p className="text-muted-foreground">
              {step === 1 ? "Passo 1: Localização" : "Passo 2: Detalhes da Ocorrência"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Onde está o problema?" : "Conte-nos mais"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "Confirme ou edite a localização detectada automaticamente" 
                : "Descreva a ocorrência e anexe imagens ou vídeos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Endereço
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder={isLoadingLocation ? "Detectando localização..." : "Digite o endereço"}
                      disabled={isLoadingLocation}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {isLoadingLocation ? "Obtendo sua localização..." : "Você pode editar o endereço se necessário"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                    />
                  </div>

                  {/* Map Display */}
                  <div className="space-y-2">
                    <Label>Localização no Mapa</Label>
                    <LocationMap 
                      position={formData.coordinates}
                      onPositionChange={(newPos) => setFormData(prev => ({ ...prev, coordinates: newPos }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Arraste o marcador para ajustar a localização exata
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    Próximo
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label>Tipo de manifestação</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sugestao" id="sugestao" />
                        <Label htmlFor="sugestao" className="font-normal cursor-pointer">
                          Sugestão de Melhoria
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reclamacao" id="reclamacao" />
                        <Label htmlFor="reclamacao" className="font-normal cursor-pointer">
                          Reclamação
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="elogio" id="elogio" />
                        <Label htmlFor="elogio" className="font-normal cursor-pointer">
                          Elogio
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outros" id="outros" />
                        <Label htmlFor="outros" className="font-normal cursor-pointer">
                          Outros
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o problema ou sua sugestão em detalhes..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Imagens ou Vídeos</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arraste arquivos ou clique para selecionar
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload">
                        <Button type="button" variant="secondary" size="sm" asChild>
                          <span>Selecionar Arquivos</span>
                        </Button>
                      </Label>
                    </div>

                    {formData.files.length > 0 && (
                      <div className="space-y-2">
                        {formData.files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted rounded-lg"
                          >
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1">
                      Registrar Ocorrência
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIncident;

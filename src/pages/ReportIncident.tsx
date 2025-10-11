import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, MapPin, Upload, X } from "lucide-react";
import { categories } from "@/data/categories";
import { toast } from "sonner";
import LocationMap from "@/components/LocationMap";

const ReportIncident = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    address: "",
    cep: "",
    type: "",
    description: "",
    files: [] as File[],
    coordinates: [-22.9068, -43.1729] as [number, number]
  });

  const category = categories.find(c => c.id === categoryId);
  const Icon = category?.icon;

  // Geolocalização automática removida temporariamente

  const handleCepChange = async (cep: string) => {
    setFormData(prev => ({ ...prev, cep }));
    
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          const fullAddress = `${data.logradouro}, ${data.bairro} - ${data.localidade}, ${data.uf}`;
          setFormData(prev => ({ ...prev, address: fullAddress }));
          toast.success("Endereço encontrado!");
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
    } else if (step === 2) {
      if (!formData.type || !formData.description) {
        toast.error("Preencha o tipo e a descrição");
        return;
      }
      setStep(3);
    } else {
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
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (step === 1) {
                navigate("/dashboard");
              } else {
                setStep(step - 1);
              }
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-muted rounded-full p-4">
            {Icon && <Icon className={`w-8 h-8 ${category.color}`} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
            <p className="text-muted-foreground">
              {step === 1 && "Passo 1: Localização"}
              {step === 2 && "Passo 2: Detalhes da Ocorrência"}
              {step === 3 && "Passo 3: Pré-visualização"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Onde está o problema?"}
              {step === 2 && "Conte-nos mais"}
              {step === 3 && "Confirme os dados"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Informe o endereço e ajuste a localização no mapa"} 
              {step === 2 && "Descreva a ocorrência e anexe imagens ou vídeos"}
              {step === 3 && "Revise as informações antes de enviar"}
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
                      placeholder="Digite o endereço"
                      required
                    />
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
              ) : step === 2 ? (
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
                      Pré-visualizar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Pré-visualização */}
                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Localização</h3>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-foreground">{formData.address}</p>
                            <p className="text-sm text-muted-foreground">CEP: {formData.cep}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">Mapa</h3>
                        <LocationMap position={formData.coordinates} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Tipo de Manifestação</h3>
                        <p className="text-foreground capitalize">
                          {formData.type === "sugestao" && "Sugestão de Melhoria"}
                          {formData.type === "reclamacao" && "Reclamação"}
                          {formData.type === "elogio" && "Elogio"}
                          {formData.type === "outros" && "Outros"}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">Descrição</h3>
                        <p className="text-foreground whitespace-pre-wrap">{formData.description}</p>
                      </div>

                      {formData.files.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                            Arquivos Anexados ({formData.files.length})
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {formData.files.map((file, index) => (
                              <div
                                key={index}
                                className="relative bg-background rounded-lg p-3 border border-border"
                              >
                                {file.type.startsWith("image/") ? (
                                  <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                  </div>
                                )}
                                <p className="text-xs truncate">{file.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                        Editar
                      </Button>
                      <Button type="submit" className="flex-1">
                        Confirmar e Enviar
                      </Button>
                    </div>
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
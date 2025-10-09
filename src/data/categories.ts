import {
  Heart,
  Lightbulb,
  Car,
  FileText,
  AlertTriangle,
  Leaf,
  Building2,
  GraduationCap,
  Trees,
  Hammer,
  Shield,
  Zap,
  LucideIcon
} from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export const categories: Category[] = [
  {
    id: "saude",
    name: "Saúde",
    icon: Heart,
    color: "text-red-500"
  },
  {
    id: "inovacao",
    name: "Inovação",
    icon: Lightbulb,
    color: "text-yellow-500"
  },
  {
    id: "mobilidade",
    name: "Mobilidade",
    icon: Car,
    color: "text-blue-500"
  },
  {
    id: "politicas-publicas",
    name: "Políticas Públicas",
    icon: FileText,
    color: "text-purple-500"
  },
  {
    id: "riscos-urbanos",
    name: "Riscos Urbanos",
    icon: AlertTriangle,
    color: "text-orange-500"
  },
  {
    id: "sustentabilidade",
    name: "Sustentabilidade",
    icon: Leaf,
    color: "text-green-500"
  },
  {
    id: "planejamento-urbano",
    name: "Planejamento Urbano",
    icon: Building2,
    color: "text-indigo-500"
  },
  {
    id: "educacao",
    name: "Educação",
    icon: GraduationCap,
    color: "text-cyan-500"
  },
  {
    id: "meio-ambiente",
    name: "Meio Ambiente",
    icon: Trees,
    color: "text-emerald-500"
  },
  {
    id: "infraestrutura",
    name: "Infraestrutura da Cidade",
    icon: Hammer,
    color: "text-amber-500"
  },
  {
    id: "seguranca-publica",
    name: "Segurança Pública",
    icon: Shield,
    color: "text-rose-500"
  },
  {
    id: "energias-inteligentes",
    name: "Energias Inteligentes",
    icon: Zap,
    color: "text-lime-500"
  }
];

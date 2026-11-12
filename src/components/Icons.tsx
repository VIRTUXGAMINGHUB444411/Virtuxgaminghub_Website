import React from "react";
import {
  Gamepad2,
  Monitor,
  Car,
  Film,
  Coffee,
  Trophy,
  Zap,
  Shield,
  ShieldCheck,
  Target,
  Swords,
  Crosshair,
  Flame,
  Bomb,
  Flag,
  Sparkles,
  Cpu,
  Star,
  Users,
  Clock,
  Calendar,
  UtensilsCrossed,
  Cake,
  Gift,
  Lock,
  Mail,
  Phone,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Info,
  LogOut,
  Copy,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  RotateCw,
  Activity,
  Snowflake,
  User,
  Timer,
  Infinity,
  Headphones,
  Check,
  Search,
  Rocket,
  LayoutGrid,
  Crown,
  Hourglass,
  Popcorn,
  Joystick,
  ArrowLeft,
  XCircle,
  FileText,
  Settings,
} from "lucide-react";

export type IconKey =
  | "gamepad"
  | "monitor"
  | "car"
  | "film"
  | "coffee"
  | "trophy"
  | "football"
  | "swords"
  | "cpu"
  | "crosshair"
  | "flag"
  | "target"
  | "bomb"
  | "sparkles"
  | "flame"
  | "shield";

interface GameIconProps {
  name: string;
  className?: string;
  color?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({ name, className = "w-6 h-6", color }) => {
  const props = { className, style: color ? { color } : undefined };

  switch (name) {
    case "football":
    case "soccer":
    case "fc":
      // Stylized sports / soccer ball representation using Target + Trophy motif
      return <Activity {...props} />;
    case "swords":
    case "combat":
    case "tekken":
      return <Swords {...props} />;
    case "cpu":
    case "cyberpunk":
      return <Cpu {...props} />;
    case "crosshair":
    case "valorant":
    case "aim":
      return <Crosshair {...props} />;
    case "car":
    case "racing":
    case "gt7":
      return <Car {...props} />;
    case "flag":
    case "forza":
      return <Flag {...props} />;
    case "spider":
    case "spiderman":
    case "target":
      return <Target {...props} />;
    case "bomb":
    case "cs2":
      return <Bomb {...props} />;
    case "flame":
    case "wukong":
      return <Flame {...props} />;
    case "wrestling":
    case "users":
      return <Users {...props} />;
    case "dragon":
    case "mk1":
    case "sparkles":
      return <Sparkles {...props} />;
    case "monitor":
    case "pc":
      return <Monitor {...props} />;
    case "sim":
      return <Car {...props} />;
    case "cinema":
    case "film":
      return <Film {...props} />;
    case "cafe":
    case "coffee":
      return <Coffee {...props} />;
    case "trophy":
    case "events":
      return <Trophy {...props} />;
    case "gamepad":
    case "ps5":
    default:
      return <Gamepad2 {...props} />;
  }
};

interface CategoryIconProps {
  category: "ps5" | "pc" | "sim" | "cinema" | "cafe" | "events" | "all" | string;
  className?: string;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  className = "w-5 h-5",
  color,
}) => {
  const props = { className, style: color ? { color } : undefined };

  switch (category) {
    case "pc":
      return <Monitor {...props} />;
    case "sim":
      return <Car {...props} />;
    case "cinema":
    case "movie":
      return <Film {...props} />;
    case "cafe":
      return <Coffee {...props} />;
    case "events":
      return <Trophy {...props} />;
    case "ps5":
    default:
      return <Gamepad2 {...props} />;
  }
};

interface StarRatingProps {
  rating: number;
  max?: number;
  className?: string;
  starClassName?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  className = "flex items-center gap-1",
  starClassName = "w-4 h-4",
}) => {
  return (
    <div className={className}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < rating;
        return (
          <Star
            key={i}
            className={`${starClassName} ${
              filled
                ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                : "text-slate-300 fill-transparent"
            }`}
          />
        );
      })}
    </div>
  );
};

export {
  Gamepad2,
  Monitor,
  Car,
  Film,
  Coffee,
  Trophy,
  Zap,
  Shield,
  ShieldCheck,
  Target,
  Swords,
  Crosshair,
  Flame,
  Bomb,
  Flag,
  Sparkles,
  Cpu,
  Star,
  Users,
  Clock,
  Calendar,
  UtensilsCrossed,
  Cake,
  Gift,
  Lock,
  Mail,
  Phone,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Info,
  LogOut,
  Copy,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  RotateCw,
  Activity,
  Snowflake,
  User,
  Timer,
  Infinity,
  Headphones,
  Check,
  Search,
  Rocket,
  LayoutGrid,
  Crown,
  Hourglass,
  Popcorn,
  Joystick,
  ArrowLeft,
  XCircle,
  FileText,
  Settings,
};

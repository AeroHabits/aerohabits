
import { icons } from "lucide-react";

interface CategoryTagProps {
  category?: {
    name: string;
    color: string;
    icon: string;
  };
}

export function CategoryTag({ category }: CategoryTagProps) {
  if (!category) return null;
  
  const LucideIcon = category.icon ? (icons as any)[category.icon] : null;
  if (!LucideIcon) return null;

  return (
    <span 
      className="text-xs px-2 py-1 rounded-full inline-flex items-center mt-2" 
      style={{ 
        backgroundColor: `${category.color}30`,
        color: category.color
      }}
    >
      <LucideIcon className="h-3 w-3 mr-1" />
      {category.name}
    </span>
  );
}

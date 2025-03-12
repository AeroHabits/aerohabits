
import React from "react";
import { icons } from "lucide-react";

interface LucideIconProps {
  name: string;
  [key: string]: any;
}

export const LucideIconRenderer: React.FC<LucideIconProps> = ({ name, ...props }) => {
  const Icon = (icons as any)[name];
  return Icon ? <Icon {...props} /> : null;
};

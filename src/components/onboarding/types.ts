
import { ReactNode } from "react";

export interface QuestionType {
  id: string;
  question: string;
  icon: ReactNode;
  options: string[];
}

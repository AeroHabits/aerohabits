
import { ReactNode } from "react";
import { Target, ListChecks, Clock, Heart } from "lucide-react";

export interface QuestionItem {
  id: string;
  question: string;
  icon: ReactNode;
  options: string[];
}

export const questions: QuestionItem[] = [
  {
    id: "primary_goal",
    question: "What is your primary goal in life right now?",
    icon: <Target className="w-6 h-6 text-indigo-400" />,
    options: [
      "Career growth",
      "Better health",
      "Learning new skills",
      "Building relationships",
      "Financial stability"
    ]
  },
  {
    id: "biggest_challenge",
    question: "What's your biggest challenge in building consistent habits?",
    icon: <ListChecks className="w-6 h-6 text-blue-400" />,
    options: [
      "Lack of time",
      "Staying motivated",
      "Tracking progress",
      "Setting realistic goals",
      "Finding accountability"
    ]
  },
  {
    id: "time_commitment",
    question: "How much time can you commit daily to your habits?",
    icon: <Clock className="w-6 h-6 text-cyan-400" />,
    options: [
      "5-10 minutes",
      "15-20 minutes",
      "30 minutes",
      "45 minutes",
      "1 hour or more"
    ]
  },
  {
    id: "motivation",
    question: "What motivates you most to achieve your goals?",
    icon: <Heart className="w-6 h-6 text-sky-400" />,
    options: [
      "Personal growth",
      "Family",
      "Recognition",
      "Health benefits",
      "Challenge myself"
    ]
  },
];

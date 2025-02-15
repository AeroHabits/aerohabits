
import { Card, CardContent } from "@/components/ui/card";

interface FormWrapperProps {
  children: React.ReactNode;
  title: string;
}

export function FormWrapper({ children, title }: FormWrapperProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

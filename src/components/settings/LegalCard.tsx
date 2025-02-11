
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LegalCard() {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Legal</CardTitle>
        <CardDescription className="text-gray-300">Review our legal documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Privacy Policy</Link>
        </div>
      </CardContent>
    </Card>
  );
}

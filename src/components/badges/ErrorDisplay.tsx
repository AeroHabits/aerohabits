
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  onRetry: () => void;
}

export function ErrorDisplay({ onRetry }: ErrorDisplayProps) {
  return (
    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading badges</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>There was a problem loading your badges. This might be due to:</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Temporary connection issue</li>
          <li>Authentication timeout</li>
          <li>Server maintenance</li>
        </ul>
        <p>Please try again.</p>
      </AlertDescription>
      <Button 
        onClick={onRetry} 
        variant="outline" 
        className="mt-4 bg-white/10 hover:bg-white/20 border-white/20"
      >
        Try Again
      </Button>
    </Alert>
  );
}

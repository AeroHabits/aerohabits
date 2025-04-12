
import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from "@sentry/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Send } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  key: number; // Add a key to force re-render when needed
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    key: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log the error to Sentry if we're online to avoid queue buildup
    if (navigator.onLine) {
      Sentry.captureException(error, { extra: { reactErrorInfo: errorInfo } });
    }
    
    // Update state to include error info
    this.setState({ errorInfo });
    
    // Log to console in development
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    // Clear the error state and increment key to force children to remount
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      key: this.state.key + 1 
    });
  };

  private handleReport = () => {
    // Show Sentry feedback dialog
    Sentry.showReportDialog();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FEF7CD] via-[#E5DEFF] to-[#D3E4FD]">
          <Alert className="max-w-md bg-white/70 backdrop-blur-sm border-[#D3E4FD]/50">
            <AlertTitle className="text-[#6E59A5]">Something went wrong</AlertTitle>
            <AlertDescription className="mt-2 text-gray-600">
              <p className="mb-2">{this.state.error?.message || 'An unexpected error occurred'}</p>
              <p className="text-sm text-gray-500">The app has been reset. Please try again.</p>
            </AlertDescription>
            <div className="mt-4 flex space-x-4">
              <Button
                onClick={this.handleReset}
                className="bg-[#8B5CF6] hover:bg-[#7E69AB] text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={this.handleReport}
                variant="outline"
                className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Feedback
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    // Render children with the key to force remount when needed
    return <div key={this.state.key}>{this.props.children}</div>;
  }
}

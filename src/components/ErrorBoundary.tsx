
import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from "@sentry/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Send, Home } from "lucide-react";
import { toast } from "sonner";

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
    console.error("ErrorBoundary caught error:", error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state to include error info
    this.setState({ errorInfo });
    
    // Log detailed error to console
    console.error("Uncaught error details:", {
      error,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      name: error.name
    });
    
    // Only log the error to Sentry if we're online to avoid queue buildup
    if (navigator.onLine) {
      Sentry.captureException(error, { 
        extra: { 
          reactErrorInfo: errorInfo,
          url: window.location.href,
          userAgent: navigator.userAgent
        } 
      });
    }
  }

  private handleReset = () => {
    // Clear the error state and increment key to force children to remount
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      key: this.state.key + 1 
    });
    
    toast.success("App has been reset");
  };

  private handleReport = () => {
    // Show Sentry feedback dialog
    Sentry.showReportDialog();
  };
  
  private handleGoHome = () => {
    // Navigate to home page
    window.location.href = '/';
    this.handleReset();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FEF7CD] via-[#E5DEFF] to-[#D3E4FD]">
          <Alert className="max-w-md bg-white/90 backdrop-blur-sm border border-[#D3E4FD] shadow-lg rounded-lg">
            <AlertTitle className="text-xl font-semibold text-[#6E59A5] mb-2">Something went wrong</AlertTitle>
            <AlertDescription className="text-gray-600">
              <div className="space-y-2 mb-4">
                <p className="font-medium">{this.state.error?.message || 'An unexpected error occurred'}</p>
                <p className="text-sm text-gray-500">
                  If you're seeing this on a published site, try refreshing or clearing your browser cache.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  onClick={this.handleReset}
                  className="bg-[#8B5CF6] hover:bg-[#7E69AB] text-white"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset App
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
                <Button
                  onClick={this.handleReport}
                  variant="outline"
                  className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Render children with the key to force remount when needed
    return <div key={this.state.key}>{this.props.children}</div>;
  }
}

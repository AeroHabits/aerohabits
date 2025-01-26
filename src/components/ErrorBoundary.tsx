import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from "@sentry/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, { extra: { reactErrorInfo: errorInfo } });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleReport = () => {
    Sentry.showReportDialog();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FEF7CD] via-[#E5DEFF] to-[#D3E4FD]">
          <Alert className="max-w-md bg-white/70 backdrop-blur-sm border-[#D3E4FD]/50">
            <AlertTitle className="text-[#6E59A5]">Something went wrong</AlertTitle>
            <AlertDescription className="mt-2 text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred'}
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
                Report Feedback
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
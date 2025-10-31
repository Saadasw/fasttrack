"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("🚨 Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto mt-8">
            <h2 className="text-red-800 font-bold mb-3 flex items-center">
              🚨 Connection Error
            </h2>
            <p className="text-red-600 mb-3">
              Failed to connect to the API server. Please check your network
              connection and ensure the backend server is running.
            </p>

            <div className="bg-red-100 p-3 rounded mb-3">
              <p className="text-sm text-red-700 mb-1">
                <strong>Expected API URL:</strong>{" "}
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
              </p>
              <p className="text-sm text-red-700">
                <strong>Test URL:</strong>{" "}
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
                /health
              </p>
            </div>

            <details className="mb-4">
              <summary className="cursor-pointer text-red-700 font-medium hover:text-red-800">
                🔍 Error Details
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto max-h-32 border">
                {this.state.error?.message || "Unknown error occurred"}
              </pre>
            </details>

            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                🔄 Retry Connection
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                🔙 Go Back
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

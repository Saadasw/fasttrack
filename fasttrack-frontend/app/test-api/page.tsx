"use client";

import { useState } from "react";
import NetworkTest from "../../components/NetworkTest";
import { ErrorBoundary } from "../../components/ErrorBoundary";

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    addResult("Testing backend connection...");

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://192.168.31.78:8000";

    try {
      const response = await fetch(`${apiUrl}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Backend connected: ${JSON.stringify(data)}`);
      } else {
        addResult(
          `❌ Backend error: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addResult(`❌ Backend connection failed: ${errorMessage}`);
    }

    setLoading(false);
  };

  const testSimpleApiCall = async () => {
    setLoading(true);
    addResult("Testing simple API call...");

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://192.168.31.78:8000";

    try {
      const response = await fetch(`${apiUrl}/`, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ API call successful: ${JSON.stringify(data)}`);
      } else {
        addResult(
          `❌ API call failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addResult(`❌ API call error: ${errorMessage}`);
    }

    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">🧪 API Connection Test</h1>

        {/* Network Test Component */}
        <div className="mb-8">
          <NetworkTest />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">📡 Current Configuration:</h3>
          <p className="text-sm">
            <strong>API URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_API_URL || "http://192.168.31.78:8000"}
          </p>
          <p className="text-sm">
            <strong>Supabase URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Backend Health
          </button>

          <button
            onClick={testSimpleApiCall}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-2"
          >
            Test API Root
          </button>

          <button
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
          >
            Clear Results
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">
              No tests run yet. Click a button above to start testing.
            </p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="text-sm font-mono bg-white p-2 rounded"
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

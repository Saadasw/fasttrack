"use client";

import { useState } from "react";

export default function NetworkTest() {
  const [status, setStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<string>("");

  const testConnection = async () => {
    setStatus("testing");
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://192.168.31.78:8000";

    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        // Add timeout
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(
          `✅ Connected successfully: ${JSON.stringify(data, null, 2)}`
        );
        setStatus("success");
      } else {
        setResult(`❌ HTTP ${response.status}: ${response.statusText}`);
        setStatus("error");
      }
    } catch (error) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        if (error.name === "TimeoutError") {
          errorMessage = "Connection timeout - server may be unreachable";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error - check if server is running and accessible";
        } else {
          errorMessage = error.message;
        }
      }
      setResult(`❌ Connection failed: ${errorMessage}`);
      setStatus("error");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-bold mb-2">🌐 API Connection Test</h3>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Testing endpoint:</strong>{" "}
        {process.env.NEXT_PUBLIC_API_URL || "http://192.168.31.78:8000"}/health
      </p>
      <button
        onClick={testConnection}
        disabled={status === "testing"}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === "testing" ? "Testing Connection..." : "Test API Connection"}
      </button>
      {result && (
        <div
          className={`mt-3 p-3 rounded text-sm whitespace-pre-wrap ${
            status === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}

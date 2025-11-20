"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Wifi } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const [apiStatus, setApiStatus] = useState<string>("");

  const testApiConnection = async () => {
    setApiStatus("Testing...");
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/health`);

      if (response.ok) {
        const data = await response.json();
        setApiStatus(`✅ Backend Connected: ${data.status}`);
      } else {
        setApiStatus(`❌ Backend Error: ${response.status}`);
      }
    } catch (error) {
      setApiStatus(`❌ Connection Failed: ${error}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-card to-background py-20 overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            We Deliver
            <span className="text-primary block">Parcels on Time</span>
            with no Hassle
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Easy tracking, fast payment, and safe delivery across the country.
            Your trusted partner for all courier needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8">
              Track Your Parcel
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-transparent"
            >
              Become a Merchant
            </Button>
            <Button
              onClick={testApiConnection}
              variant="outline"
              size="sm"
              className="text-sm px-4 bg-green-50 hover:bg-green-100"
            >
              <Wifi className="mr-2 h-4 w-4" />
              Test API
            </Button>
          </div>
          {apiStatus && (
            <div className="text-sm font-mono bg-blue-800 p-2 rounded">
              {apiStatus}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="bg-primary/10 rounded-full p-8 mx-auto w-fit">
            <Truck className="h-32 w-32 text-primary delivery-pulse" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
}

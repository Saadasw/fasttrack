// 🧪 Environment Variables Test
// Open browser console and run this script to verify environment variables

console.log("🌐 FastTrack Frontend Environment Test");
console.log("=====================================");

console.log("📍 Environment Variables:");
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

console.log("\n🔗 Expected URLs:");
console.log("Frontend (Current):", window.location.origin);
console.log(
  "API URL:",
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.31.78:8000"
);
console.log(
  "API Health:",
  `${process.env.NEXT_PUBLIC_API_URL || "http://192.168.31.78:8000"}/health`
);

console.log("\n🧪 Testing API Connection...");

// Test API connection
fetch(
  `${process.env.NEXT_PUBLIC_API_URL || "http://192.168.31.78:8000"}/health`
)
  .then((response) => {
    console.log("✅ API Response Status:", response.status);
    return response.json();
  })
  .then((data) => {
    console.log("✅ API Health Data:", data);
    console.log("🎉 SUCCESS: Backend is reachable!");
  })
  .catch((error) => {
    console.error("❌ API Connection Failed:", error);
    console.log("🔍 Troubleshooting Tips:");
    console.log("1. Check if backend is running on port 8000");
    console.log("2. Verify IP address is correct");
    console.log("3. Check Windows Firewall settings");
    console.log("4. Ensure both frontend and backend are on same network");
  });

console.log("\n📱 Network Access Test:");
console.log("Frontend accessible at:");
console.log("- Local:", "http://localhost:3000");
console.log("- Network:", `http://192.168.31.78:3000`);
console.log("- Test Page:", `http://192.168.31.78:3000/test-api`);

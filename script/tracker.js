// Import Supabase and UAParser
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import UAParser from "https://cdn.jsdelivr.net/npm/ua-parser-js@1.0.2/+esm";

// Initialize Supabase client
const supabase = createClient(
  "https://vuyukqoyemhsogjcemaz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXVrcW95ZW1oc29namNlbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Njg5NzEsImV4cCI6MjA2MDA0NDk3MX0.TywjagLRCgvj-aJJxGeUlg27MFDFgR9N9JDCjN9F0tQ"
);

// Generate UUID for unique session tracking
const generateSessionId = () => crypto.randomUUID();

// Fetch user's public IP address
const getIP = async () => {
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const data = await res.json();
    return data.ip || "unknown";
  } catch {
    return "unavailable";
  }
};

// Parse user's device and browser info
const getDeviceDetails = () => {
  try {
    const parser = new UAParser();
    const result = parser.getResult();
    return {
      os: `${result.os.name || "unknown"} ${result.os.version || ""}`,
      browser: `${result.browser.name || "unknown"} ${result.browser.version || ""}`,
      device_type: result.device.type || "desktop",
      device_brand: result.device.vendor || "unknown",
      device_model: result.device.model || "unknown",
      screen: `${screen.width}x${screen.height}`,
    };
  } catch {
    return {
      os: "unknown",
      browser: "unknown",
      device_type: "unknown",
      device_brand: "unknown",
      device_model: "unknown",
      screen: `${screen.width}x${screen.height}`,
    };
  }
};

// Track and insert user data into Supabase
const trackUser = async () => {
  const ip = await getIP();
  const device = getDeviceDetails();

  // Manage session ID in localStorage
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("session_id", sessionId);
  }

  // Insert data into Supabase 'views' table
  const { error } = await supabase.from("views").insert([
    {
      ip: ip,
      os: device.os,
      browser: device.browser,
      device_type: device.device_type,
      device_brand: device.device_brand,
      device_model: device.device_model,
      screen_size: device.screen,
      session_id: sessionId,
      page_url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error("Tracking failed:", error);
  } else {
    console.log("User tracked successfully");
  }
};

// Run on page load
trackUser();

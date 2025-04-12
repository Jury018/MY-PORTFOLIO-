// Import Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client (replace with your actual Supabase credentials)
const supabase = createClient("https://vuyukqoyemhsogjcemaz.supabase.co", "your-api-key-here");

// Function to fetch user's IP address
const getIP = async () => {
  const res = await fetch("https://api64.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
};

// Function to parse user's device details
const getDeviceDetails = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  return {
    os: result.os.name + " " + result.os.version,
    browser: result.browser.name + " " + result.browser.version,
    device_type: result.device.type || "desktop",
    device_brand: result.device.vendor || "unknown",
    device_model: result.device.model || "unknown",
    screen: `${screen.width}x${screen.height}`
  };
};

// Function to track user data and store in Supabase
const trackUser = async () => {
  const ip = await getIP();
  const device = getDeviceDetails();

  // Optionally, store session ID to track repeat visits
  const sessionId = localStorage.getItem("session_id") || Date.now().toString();
  localStorage.setItem("session_id", sessionId);

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
      session_id: sessionId
    }
  ]);

  if (error) console.error("Tracking failed:", error);
  else console.log("User tracked successfully");
};

// Execute the tracking function on page load
trackUser();

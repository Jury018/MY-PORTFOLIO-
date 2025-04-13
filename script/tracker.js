// Import Supabase and UAParser
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import UAParser from "https://cdn.jsdelivr.net/npm/ua-parser-js@1.0.2/+esm";

// Initialize Supabase client
const supabase = createClient(
  "https://vuyukqoyemhsogjcemaz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXVrcW95ZW1oc29namNlbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Njg5NzEsImV4cCI6MjA2MDA0NDk3MX0.TywjagLRCgvj-aJJxGeUlg27MFDFgR9N9JDCjN9F0tQ"
);

// Generate UUID
const generateSessionId = () => crypto.randomUUID();

// Hash generator (simple fingerprint string → SHA-256)
const hashFingerprint = async (input) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

// IP getter
const getIP = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.ip || "unknown";
  } catch {
    return "unavailable";
  }
};

// Device detail extractor (userAgentData first, fallback to UAParser)
const getDeviceDetails = async () => {
  try {
    if (navigator.userAgentData) {
      const ua = await navigator.userAgentData.getHighEntropyValues([
        "platform", "platformVersion", "architecture", "model", "uaFullVersion"
      ]);

      return {
        os: `${ua.platform} ${ua.platformVersion}`,
        browser: `${navigator.userAgentData.brands[0]?.brand || "unknown"} ${ua.uaFullVersion}`,
        device_type: navigator.userAgentData.mobile ? "mobile" : "desktop",
        device_brand: navigator.userAgentData.brands[0]?.brand || "unknown",
        device_model: ua.model || "unknown",
        screen: `${screen.width}x${screen.height}`
      };
    } else {
      const parser = new UAParser();
      const result = parser.getResult();

      return {
        os: `${result.os.name || "unknown"} ${result.os.version || ""}`,
        browser: `${result.browser.name || "unknown"} ${result.browser.version || ""}`,
        device_type: result.device.type || "desktop",
        device_brand: result.device.vendor || "unknown",
        device_model: result.device.model || "unknown",
        screen: `${screen.width}x${screen.height}`
      };
    }
  } catch {
    return {
      os: "unknown",
      browser: "unknown",
      device_type: "unknown",
      device_brand: "unknown",
      device_model: "unknown",
      screen: `${screen.width}x${screen.height}`
    };
  }
};

// Convert UTC timestamp to Philippines Time (UTC+8)
const convertToPhilippinesTime = (utcTimestamp) => {
  const utcDate = new Date(utcTimestamp + 'Z');
  return utcDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
};

// Main tracking logic
const trackUser = async () => {
  const ip = await getIP();  // Now it's defined
  const device = await getDeviceDetails();

  // Manage session
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("session_id", sessionId);
  }

  // Create a device fingerprint
  const fingerprintRaw = `${ip}|${device.os}|${device.browser}|${device.device_brand}|${device.device_model}`;
  const fingerprintHash = await hashFingerprint(fingerprintRaw);
  localStorage.setItem("fp_hash", fingerprintHash);

  // Check if already tracked this session/device
  const { data: existing, error: checkError } = await supabase
    .from("views")
    .select("session_id")
    .eq("session_id", sessionId)
    .limit(1);

  if (checkError) {
    console.error("Error checking tracking record:", checkError);
    return;
  }

  if (existing && existing.length > 0) {
    console.log("Device already tracked for this session.");
    return; // Skip insert
  }

  // Insert tracking data
  const timestamp = new Date().toISOString();  // Get UTC timestamp

  const { error: insertError } = await supabase.from("views").insert([{
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
    timestamp: timestamp,  // Store UTC timestamp in database
  }]);

  if (insertError) {
    console.error("Tracking failed:", insertError);
  } else {
    console.log("User tracked successfully");

    // Log converted time for debugging
    const philippinesTimestamp = convertToPhilippinesTime(timestamp);  // Convert to Philippines time
    console.log("Timestamp (Philippines Time):", philippinesTimestamp);  // For display purposes (on the frontend or in debug logs)
  }
};

// Auto-run on load
trackUser();

// Import Supabase and UAParser
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import UAParser from "https://cdn.jsdelivr.net/npm/ua-parser-js@1.0.2/+esm";

// Supabase init
const supabase = createClient(
  "https://vuyukqoyemhsogjcemaz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXVrcW95ZW1oc29namNlbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Njg5NzEsImV4cCI6MjA2MDA0NDk3MX0.TywjagLRCgvj-aJJxGeUlg27MFDFgR9N9JDCjN9F0tQ"
);

// UUID generator
const generateSessionId = () => crypto.randomUUID();

// SHA-256 fingerprint hash
const hashFingerprint = async (input) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Get public IP
const getIP = async () => {
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const data = await res.json();
    return data.ip || "unknown";
  } catch {
    return "unavailable";
  }
};

// Get device details
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

// Stable device fingerprint
const generateDeviceId = async (device, ip) => {
  const raw = [
    ip,
    device.os.toLowerCase().split(" ")[0],
    device.device_brand.toLowerCase(),
    device.device_model.toLowerCase(),
    device.screen,
    navigator.platform,
    navigator.language
  ].join("|");

  return await hashFingerprint(raw);
};

// Main tracker
const trackUser = async () => {
  const ip = await getIP();
  const device = await getDeviceDetails();

  let sessionId = localStorage.getItem("session_id");
  let sessionStart = localStorage.getItem("session_start");

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStart = new Date().toISOString();
    localStorage.setItem("session_id", sessionId);
    localStorage.setItem("session_start", sessionStart);
  }

  const deviceId = await generateDeviceId(device, ip);
  localStorage.setItem("device_id", deviceId);

  const { data: existing, error: checkError } = await supabase
    .from("views")
    .select("ip")
    .eq("ip", ip)
    .limit(1);

  if (checkError) {
    console.error("Supabase check error:", checkError);
    return;
  }

  const payload = {
    os: device.os,
    browser: device.browser,
    device_type: device.device_type,
    device_brand: device.device_brand,
    device_model: device.device_model,
    screen_size: device.screen,
    session_id: sessionId,
    device_id: deviceId,
    page_url: window.location.href,
    referrer: document.referrer,
    timestamp: sessionStart,
    session_duration: 0,
    last_activity: sessionStart
  };

  if (existing && existing.length > 0) {
    const { error: updateError } = await supabase
      .from("views")
      .update(payload)
      .eq("ip", ip);

    if (updateError) {
      console.error("Update failed:", updateError.message);
    } else {
      console.log("Session updated.");
    }
  } else {
    const insertPayload = { ...payload, ip };
    const { error: insertError } = await supabase
      .from("views")
      .insert([insertPayload]);

    if (insertError) {
      console.error("Insert failed:", insertError.message);
    } else {
      console.log("Session tracked.");
    }
  }
};

// Realtime session update every 10s
setInterval(async () => {
  const sessionId = localStorage.getItem("session_id");
  const sessionStart = localStorage.getItem("session_start");
  const ip = await getIP();

  if (!sessionId || !sessionStart) return;

  const now = new Date();
  const start = new Date(sessionStart);
  const duration = Math.floor((now - start) / 1000);

  const { error } = await supabase
    .from("views")
    .update({
      session_duration: duration,
      last_activity: now.toISOString()
    })
    .eq("ip", ip);

  if (error) {
    console.error("Session update failed:", error.message);
  }
}, 10000);

// Auto-run
trackUser();

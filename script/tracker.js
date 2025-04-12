import { createClient } from "https://esm.sh/@supabase/supabase-js";

  const supabase = createClient("https://vuyukqoyemhsogjcemaz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eXVrcW95ZW1oc29namNlbWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Njg5NzEsImV4cCI6MjA2MDA0NDk3MX0.TywjagLRCgvj-aJJxGeUlg27MFDFgR9N9JDCjN9F0tQ");

  const getIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch {
      return "unknown";
    }
  };

  const getDeviceDetails = () => {
    const parser = new UAParser();
    const r = parser.getResult();
    return {
      os: r.os.name + " " + r.os.version,
      browser: r.browser.name + " " + r.browser.version,
      device_type: r.device.type || "desktop",
      device_brand: r.device.vendor || "unknown",
      device_model: r.device.model || "unknown",
      screen: `${screen.width}x${screen.height}`
    };
  };

  const trackUser = async () => {
    const ip = await getIP();
    const device = getDeviceDetails();
    const sessionId = localStorage.getItem("session_id") || Date.now().toString();
    localStorage.setItem("session_id", sessionId);

    const { error } = await supabase.from("views").insert([{
      ip, os: device.os, browser: device.browser,
      device_type: device.device_type, device_brand: device.device_brand,
      device_model: device.device_model, screen_size: device.screen,
      session_id: sessionId
    }]);

    if (error) console.error("❌ Tracking failed:", error.message);
    else console.log("✅ User tracked successfully");
  };

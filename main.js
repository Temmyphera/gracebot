const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 650,
    webPreferences: { nodeIntegration: true },
  });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  // Start your server.js so AI works locally
  serverProcess = spawn("node", ["server.js"], { shell: true });
  createWindow();
});

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

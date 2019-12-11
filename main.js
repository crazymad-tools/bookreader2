const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const ipc = require('electron').ipcMain;;

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./public/renderer.js")
    }
  });
  win.webContents.openDevTools({ mode: "detach" });
  win.loadURL("http://localhost:3001");

  // setTimeout(() => {
  ipc.on("init", () => {
    win.webContents.send(
      "init",
      JSON.stringify({
        document: app.getPath("documents")
      })
    );
  });
  // }, 3000);
}

app.on("ready", createWindow);

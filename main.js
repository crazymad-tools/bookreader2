const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const ipc = require('electron').ipcMain;;
const { globalShortcut } = require('electron')

function createWindow() {
  let win = new BrowserWindow({
    width: 300,
    height: 250,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./public/renderer.js")
    }
  });
  win.setAlwaysOnTop(true);
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

  globalShortcut.register('Alt+D', function(){
    win.minimize();
  });
  globalShortcut.register('Alt+B', function(){
    win.focus();
  });
  // }, 3000);
}

app.on("ready", createWindow);

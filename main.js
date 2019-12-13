const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const ipc = require("electron").ipcMain;
const { globalShortcut } = require("electron");

const server = require("./server");

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
  //   win.webContents.openDevTools({ mode: "detach" });
  // win.loadURL("http://localhost:3001");
  win.loadURL("http://localhost:8083");

  ipc.on("init", () => {
    win.webContents.send(
      "init",
      JSON.stringify({
        document: app.getPath("documents")
      })
    );
  });

  globalShortcut.register("Alt+W", function() {
    win.close();
  });
  globalShortcut.register("Alt+D", function() {
    win.minimize();
  });
  globalShortcut.register("Alt+B", function() {
    win.focus();
  });
  globalShortcut.register("Control+Down", function() {
    win.webContents.send("keyboard", "down");
  });
  globalShortcut.register("Control+Up", function() {
    win.webContents.send("keyboard", "up");
  });
  globalShortcut.register("Control+Left", function() {
    win.webContents.send("keyboard", "left");
  });
  globalShortcut.register("Control+Right", function() {
    win.webContents.send("keyboard", "right");
  });
}

const appServer = server.start();

app.on("ready", createWindow);

app.on("will-quit", function() {
  appServer.close();
});

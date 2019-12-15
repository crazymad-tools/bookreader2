const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const ipc = require("electron").ipcMain;
const { globalShortcut } = require("electron");

const server = require("./server");

let appServer;
let appPort;

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
  // win.webContents.openDevTools();
  win.setAlwaysOnTop(true);
  // win.loadURL(`http://localhost:${appPort}`);
  win.loadURL('http://localhost:3000');

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

  
  app.on('second-instance', (event, commandLine, workingDirection) => {
    win.focus();
  })
}

server.start().then(({ server, port }) => {
  appServer = server;
  appPort = port;
  app.on("ready", createWindow);
});

const singleLock = app.requestSingleInstanceLock();
if (!singleLock) {
  app.quit();
}

app.on("will-quit", function() {
  appServer.close();
});

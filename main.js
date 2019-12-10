const {app, BrowserWindow} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');

function createwindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './public/renderer.js')
    }
  });

  // win.webContents.openDevTools({mode:'detach'});
  // win.setAlwaysOnTop(true);
  win.setResizable(false);
  win.loadFile('index.html');
  win.on('closed', () => {
    win = null;
  });
}


app.on('ready', createwindow);

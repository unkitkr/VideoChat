const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 300,
    height: 500,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
    frame: true,
  })
  // win.removeMenu()

  // and load the index.html of the app.
  win.loadFile('interaction/index.html')
}

app.whenReady().then(createWindow)
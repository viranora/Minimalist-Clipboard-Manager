const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'), 
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

  let previousText = clipboard.readText();

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('clipboard-updated', previousText);
  });
  
  const intervalId = setInterval(() => {
    const currentText = clipboard.readText();
    // Metin değiştiyse ve boş değilse arayüze gönder
    if (currentText && currentText !== previousText) {
      previousText = currentText;
      mainWindow.webContents.send('clipboard-updated', currentText);
    }
  }, 1000);

}

app.on('ready', createWindow);

ipcMain.handle('write-to-clipboard', (event, text) => {
  clipboard.writeText(text); // Metni panoya yaz
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

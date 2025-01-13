import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const filepath = path.join(__dirname, 'print.pdf');

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.join(__dirname, '../', '../', 'assets', 'icons', 'icon.ico'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true
    },
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.setMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Listen for print event from renderer process
  ipcMain.on('convert-pdf', () => {
    const options = {
      marginsType: 0, // Margens personalizadas
      pageSize: { 
        width: 76.2, // Largura em pontos
        height: 50.8, // Altura em pontos
      },
      printBackground: true, // Imprimir fundo
      landscape: true, // Modo paisagem
    };

    mainWindow.webContents.printToPDF(options).then(data => {
      fs.writeFile(filepath, data, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('PDF Generated Successfully');
        }
      });
    }).catch(error => {
      console.log(error);
    });
  });
};

app.on('ready', createWindow);

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

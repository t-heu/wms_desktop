import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Obter o diretório "Downloads" do usuário no Windows
const downloadsPath = process.env.NODE_ENV === 'development' ? __dirname : path.join(process.env.USERPROFILE, 'Downloads'); //__dirname

// Caminho completo do arquivo
const filepath = path.join(downloadsPath, 'wms.pdf');

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.join(__dirname, 'assets', 'icons', 'icon.ico'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
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
      pageSize: { width: 2.99, height: 2.0 }, // 76,2 x 50,8mm | { width: 1.97, height: 1.4 } 50,1 x 35,6mm
      printBackground: true, // Imprimir fundo
      landscape: true, // Modo paisagem
    };

    mainWindow.webContents.printToPDF(options).then(data => {
      fs.writeFile(filepath, data, function (err) {
        if (err) {
          console.log(err);
        } else {
          dialog.showMessageBox({
            type: "info",
            title: "PDF Gerado com Sucesso",
            message: "O arquivo PDF foi gerado com sucesso e está disponível na sua pasta de Downloads.",
            buttons: ["OK"]
          });
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

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
const downloadsPath = process.env.NODE_ENV === 'development' ? __dirname : path.join(process.env.USERPROFILE, 'Downloads');

let isCancelled = false;

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
  ipcMain.on('download-all-pdfs', async (event, totalPages) => {
    try {
      isCancelled = false;
      const options = {
        marginsType: 0, // Margens personalizadas
        pageSize: { width: 2.99, height: 2.0 }, // 76,2 x 50,8mm
        printBackground: true, // Imprimir fundo
        landscape: true, // Modo paisagem
      };
  
      for (let page = 1; page <= totalPages; page++) {
        console.log(isCancelled)
        if (isCancelled) {
          dialog.showMessageBox({
            type: "warning",
            title: "Processo Cancelado",
            message: "A geração dos PDFs foi cancelada pelo usuário.",
            buttons: ["OK"],
          });
          event.reply("pdf-cancelled");
          return;
        }
        //console.log(`Mudando para página ${page}...`);

        await mainWindow.webContents.executeJavaScript(`window.changePage(${page})`);
        await new Promise((resolve) => setTimeout(resolve, 500));
  
        const data = await mainWindow.webContents.printToPDF(options);
        const filePath = path.join(downloadsPath, `wms_${page}.pdf`);
        fs.writeFileSync(filePath, data);
        // console.log(`PDF ${page} Gerado com Sucesso: ${filePath}`);
      }
  
      dialog.showMessageBox({
        type: "info",
        title: "PDFs Gerados com Sucesso",
        message: `Todos os PDFs (${totalPages}) foram gerados e estão na pasta de Downloads.`,
        buttons: ["OK"]
      });
      event.reply("pdf-completed");
  
    } catch (error) {
      console.error('Erro ao gerar PDFs:', error);
    }
  });

  ipcMain.on('download-single-pdf', async () => {
    try {
      const options = {
        marginsType: 0, // Margens personalizadas
        pageSize: { width: 2.99, height: 2.0 }, // 76,2 x 50,8mm
        printBackground: true, // Imprimir fundo
        landscape: true, // Modo paisagem
      };
  
      const data = await mainWindow.webContents.printToPDF(options);
      const filePath = path.join(downloadsPath, `wms.pdf`);
      fs.writeFileSync(filePath, data);

      dialog.showMessageBox({
        type: "info",
        title: "PDFs Gerados com Sucesso",
        message: `PDFs (wms.pdf) foi baixado e esta na pasta de Downloads.`,
        buttons: ["OK"]
      });
    } catch (error) {
      console.error('Erro ao gerar PDFs:', error);
    }
  });

  ipcMain.on("cancel-pdf", async () => {
    isCancelled = true;
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

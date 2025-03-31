import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import os from"os";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const downloadsPath = process.env.NODE_ENV === 'development' ? __dirname : path.join(process.env.USERPROFILE, 'Downloads');
let isCancelled = false;

process.on("uncaughtException", (error) => {
  logError("Error: ", error);
})

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.join(__dirname, 'assets', 'icons', 'icon.ico'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.setMenu(null);

  ipcMain.on('download-all-pdfs', async (event, totalPages) => {
    await handleDownloadAllPDFs(mainWindow, event, totalPages);
  });

  ipcMain.on('download-single-pdf', async () => {
    await handleDownloadSinglePDF(mainWindow);
  });

  ipcMain.on('cancel-pdf', () => {
    isCancelled = true;
  });
};

const getPrintOptions = () => ({
  marginsType: 0,
  pageSize: { width: 2.99, height: 2.0 },
  printBackground: true,
  landscape: true,
});

const handleDownloadAllPDFs = async (mainWindow: BrowserWindow, event: any, totalPages: number) => {
  try {
    isCancelled = false;

    for (let page = 1; page <= totalPages; page++) {
      if (isCancelled) {
        notifyUser("Processo Cancelado", "A geração dos PDFs foi cancelada pelo usuário.");
        event.reply("pdf-cancelled");
        return;
      }

      await mainWindow.webContents.executeJavaScript(`window.changePage(${page})`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const data = await mainWindow.webContents.printToPDF(getPrintOptions());
      fs.writeFileSync(path.join(downloadsPath, `wms_${page}.pdf`), data);
    }

    notifyUser("PDFs Gerados com Sucesso", `Todos os PDFs (${totalPages}) foram gerados na pasta de Downloads.`);
    event.reply("pdf-completed");
  } catch (error) {
    console.error('Erro ao gerar PDFs:', error);
    logError("Erro ao Gerar PDF", error);
  }
};

const handleDownloadSinglePDF = async (mainWindow: BrowserWindow) => {
  try {
    const data = await mainWindow.webContents.printToPDF(getPrintOptions());
    fs.writeFileSync(path.join(downloadsPath, `wms.pdf`), data);

    notifyUser("PDF Gerado com Sucesso", "PDF wms.pdf foi baixado na pasta de Downloads.");
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    logError("Erro ao Gerar PDF", error);
  }
};

const notifyUser = (title: string, message: string) => {
  dialog.showMessageBox({
    type: "info",
    title,
    message,
    buttons: ["OK"],
  });
};

const logError = (title: string, error: Error) => {
  dialog.showMessageBox({
    type: "error",
    title: "Erro ao Gerar PDF",
    message: `Ocorreu um erro durante a geração do PDF. Detalhes: ${error.message}`,
    buttons: ["OK"],
  });

  const logPath = path.join(app.getPath("userData"), "error_wmslabeler.log");
  
  // Capturar uso de CPU e memória no momento do erro
  const cpuUsage = process.getCPUUsage(); // Uso de CPU pelo processo Electron
  const memoryUsage = process.memoryUsage(); // Uso de memória detalhado
  
  // Capturar informações do sistema
  const systemInfo = `
    Sistema Operacional: ${os.platform()} - ${os.release()}
    Arquitetura: ${os.arch()}
    CPU: ${os.cpus()[0].model}
    Memória Total: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
    Memória Livre: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
    Uso de CPU pelo Electron: ${(cpuUsage.percentCPUUsage * 100).toFixed(2)}%
    Memória RSS (Total usada pelo processo): ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
    Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
    Heap Usado: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
  `;

  // Criar conteúdo do log
  const logContent = `
    [${new Date().toISOString()}] - ${title}
    Erro: ${error.message}
    Stacktrace: ${error.stack}
    
    App Versão: ${app.getVersion()}
    Caminho do App: ${app.getPath("exe")}
    ${systemInfo}
    ----------------------------
  `;

  fs.appendFileSync(logPath, logContent);
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

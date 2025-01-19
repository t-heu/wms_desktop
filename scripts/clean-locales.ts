import * as fs from 'fs';
import * as path from 'path';

// Caminho para a pasta "locales"
const localesPath = path.join(__dirname, '..', 'out', 'Gerador de Etiquetas WMS-win32-x64', 'locales');

// Nome do arquivo de idioma que você deseja manter
const keepLocale = 'pt-BR.pak';

function cleanLocales() {
  if (!fs.existsSync(localesPath)) {
    console.error(`Pasta "locales" não encontrada em: ${localesPath}`);
    return;
  }

  // Ler todos os arquivos da pasta locales
  const files = fs.readdirSync(localesPath);

  files.forEach((file) => {
    if (file !== keepLocale) {
      const filePath = path.join(localesPath, file);
      fs.unlinkSync(filePath); // Remove os arquivos não necessários
      console.log(`Removido: ${file}`);
    }
  });

  console.log(`Arquivos mantidos: ${keepLocale}`);
}

// Executa a limpeza
cleanLocales();

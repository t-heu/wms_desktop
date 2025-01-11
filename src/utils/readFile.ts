import { read, utils } from 'xlsx';

function readFile(file: any) {
  const wb = read(file, { type: 'buffer', raw: true });
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const data: any[][] = utils.sheet_to_json(ws, { header: 1 });
    
  if (data.length === 0) {
    alert('Arquivo não pode estar vazio!');
    return [];
  }
  
  const uniqueData = Array.from(
    new Set(
      data
        .filter((row) => row && row[0] !== undefined && row[0] !== null && row[0].toString().trim() !== '') // Pula linhas vazias
        .map((row) => (row[0] || '').toString().trim())
    )
  );
    
  return uniqueData
}

export default readFile;

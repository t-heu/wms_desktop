import { read, utils } from 'xlsx';

function readFile(file: any) {
  const wb = read(file, { type: 'buffer', raw: true });
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];

  const uniqueSet = new Set<string>();

  const range = utils.decode_range(ws["!ref"] || "A1");
  for (let row = range.s.r; row <= range.e.r; row++) {
    const cellAddress = utils.encode_cell({ r: row, c: 0 });
    const cell = ws[cellAddress];

    if (cell && cell.v !== undefined && cell.v !== null) {
      uniqueSet.add(cell.v.toString().trim().toUpperCase());
    }
  }
  
  return Array.from(uniqueSet);
}

export default readFile;

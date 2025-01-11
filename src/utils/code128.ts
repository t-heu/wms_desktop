// Função utilitária para gerar texto no formato 'C'
const toSetC = (text: string): string =>
  text.match(/\d{2}/g)?.map((ascii) => {
    const codeC = Number(ascii);
    return String.fromCharCode(codeC > 94 ? codeC + 100 : codeC + 32);
  }).join('') || "";
  
function checkSum128(data: string, startCode: number) {
  let sum = startCode;

  for (let i = 0; i < data.length; i++) {
    const code = data.charCodeAt(i);
    const value = code > 194 ? code - 100 : code - 32;
    sum += (i + 1) * (value);
  }
  
  let checksum = (sum % 103) + 32;
  if (checksum > 126) checksum = checksum + 68 ;
  return String.fromCharCode(checksum);
}
  
const encodeToCode128 = (text: string, codeABC = "B"): string => {
  const startCode = String.fromCharCode(codeABC.toUpperCase().charCodeAt(0) + 138);
  const stop = String.fromCharCode(206);
  
  const processedText = codeABC === 'C' ? toSetC(text) : text.replace(/ /g, String.fromCharCode(32));
  const check = checkSum128(processedText, startCode.charCodeAt(0) - 100);
  
  return startCode + processedText + check + stop;
};

export {encodeToCode128, toSetC, checkSum128}

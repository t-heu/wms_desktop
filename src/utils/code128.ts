// Função utilitária para gerar texto no formato 'B'
const toSetB = (text: string): string => text.replace(/ /g, String.fromCharCode(32));
  
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
  const stopCode = String.fromCharCode(206);
  
  const processedText = toSetB(text);
  const checkSum = checkSum128(processedText, startCode.charCodeAt(0) - 100);
  
  return startCode + processedText + checkSum + stopCode;
};

export {encodeToCode128, toSetB, checkSum128}
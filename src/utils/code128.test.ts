import { toSetC, checkSum128, encodeToCode128 } from './code128';

describe('Funções de Code128', () => {
  describe('toSetC', () => {
    it('deve converter uma sequência de números pares para o formato C corretamente', () => {
      expect(toSetC('123456')).toBe(',BX');
    });

    it('deve retornar uma string vazia quando o texto não contém números pares', () => {
      expect(toSetC('abc')).toBe('');
    });

    it('deve converter parcialmente números pares do início da sequência e ignorar o restante', () => {
      expect(toSetC('12345')).toBe(',B');
    });
  });

  describe('checkSum128', () => {
    it('deve calcular o checksum corretamente para valores no intervalo normal', () => {
      expect(checkSum128('ABCD', 104)).toBe('J'); // Exemplo para validação
    });

    it('deve calcular o checksum corretamente para valores fora do intervalo padrão', () => {
      expect(checkSum128('1234', 104)).toBe('x'); // Exemplo de caso com ajuste
    });
  });

  describe('encodeToCode128', () => {
    it('deve codificar texto no formato Code128B corretamente', () => {
      const result1 = encodeToCode128('1K T 21 CE 03 D');
      expect(result1).toMatch('Ì1K T 21 CE 03 DHÎ');

      const result2 = encodeToCode128('1J T 23 HE 13 W');
      expect(result2).toMatch('Ì1J T 23 HE 13 WuÎ');

      const result3 = encodeToCode128('1J T 23 HE 14 W');
      expect(result3).toMatch('Ì1J T 23 HE 14 WÆÎ');

      const result4 = encodeToCode128('1J T 23 HE 14 P');
      expect(result4).toMatch('Ì1J T 23 HE 14 PÄÎ');

      const result5 = encodeToCode128('1K T 21 CE 04 A');
      expect(result5).toMatch('Ì1K T 21 CE 04 A(Î');

      const result6 = encodeToCode128('1K T 21 CE 04 B');
      expect(result6).toMatch('Ì1K T 21 CE 04 B7Î');
    });

    it('deve retornar código correto com espaços no texto', () => {
      const result = encodeToCode128('Hello World');
      expect(result.includes(String.fromCharCode(32))).toBeTruthy(); // Valida a presença de espaço como parte do código
    });

    it('não deve alterar o texto para formato C', () => {
      const result = encodeToCode128('123456');
      expect(result).toMatch('Ì1234560Î'); // Mantém Code128B mesmo com números
    });
  });
});

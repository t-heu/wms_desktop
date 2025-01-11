import { read, utils } from 'xlsx';
import readFile from './readFile';

jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));

describe('readFile', () => {
  const mockFile = Buffer.from('mockFile'); // Simula um arquivo de entrada

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve retornar um alerta e uma lista vazia quando o arquivo está vazio', () => {
    (read as jest.Mock).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    });
    (utils.sheet_to_json as jest.Mock).mockReturnValue([]);

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const result = readFile(mockFile);

    expect(alertSpy).toHaveBeenCalledWith('Arquivo não pode estar vazio!');
    expect(result).toEqual([]);
    alertSpy.mockRestore();
  });

  it('deve retornar dados únicos ignorando linhas vazias', () => {
    (read as jest.Mock).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    });
    (utils.sheet_to_json as jest.Mock).mockReturnValue([
      [' 1K T 21 CE 04 A'],
      ['1K T 21 CE 04 B'],
      [null],
      ['1K T 21 CE 04 A'], // Duplicado
      ['  '], // Linha com espaço
      ['1K T 21 CE 04 C '],
      ['1K T 21 CE 04 D']
    ]);

    const result = readFile(mockFile);

    expect(result).toEqual(['1K T 21 CE 04 A', '1K T 21 CE 04 B', '1K T 21 CE 04 C', '1K T 21 CE 04 D']);
  });

  it('deve ignorar linhas sem o primeiro valor válido', () => {
    (read as jest.Mock).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    });
    (utils.sheet_to_json as jest.Mock).mockReturnValue([
      [null, 'Extra'], // Linha inválida
      ['1K T 21 CE 04 A', 'Extra'],
      [undefined],
    ]);

    const result = readFile(mockFile);

    expect(result).toEqual(['1K T 21 CE 04 A']);
  });

  it('deve processar corretamente quando todos os dados são válidos e únicos', () => {
    (read as jest.Mock).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    });
    (utils.sheet_to_json as jest.Mock).mockReturnValue([
      ['1K T 21 CE 04 A'],
      ['1K T 21 CE 04 B'],
      ['1K T 21 CE 04 C'],
    ]);

    const result = readFile(mockFile);

    expect(result).toEqual(['1K T 21 CE 04 A', '1K T 21 CE 04 B', '1K T 21 CE 04 C']);
  });
});

import React, { useState, useCallback } from 'react';

import '../styles/home.scss';
import readFile from '../utils/readFile';

import { version } from '../../package.json';

interface HomeProps {
  data: React.Dispatch<React.SetStateAction<any[]>>
  changeComponent: (component: string) => void
  pageCount: number
  setPageCount: React.Dispatch<React.SetStateAction<number>>
}

const VALID_EXTENSIONS = ['xlsx', 'xls', 'ods', 'csv'];

const Home = ({data, changeComponent, pageCount, setPageCount}: HomeProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadFile, setIsLoadFile] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const validateFileExtension = useCallback((fileName: string): boolean => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext ? VALID_EXTENSIONS.includes(ext) : false;
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const file = files[0];

    setIsLoadFile(true);

    if (!file) {
      alert("Nenhum arquivo selecionado");
      setIsLoadFile(false)
      return;
    }

    if (!validateFileExtension(file.name)) {
      alert(`Arquivo com formato inválido! Permitido: ${VALID_EXTENSIONS.join(', ')}`);
      setIsLoadFile(false)
      return;
    }

    setSelectedFiles(files);
  };

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setIsSubmitting(true);

  if (!selectedFiles || selectedFiles.length === 0) {
    alert("Nenhum arquivo foi selecionado.");
    setIsSubmitting(false);
    return;
  }

  const processFile = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const buffer = e.target?.result;
        if (buffer) {
          const values = readFile(buffer as ArrayBuffer); // retorna string[]
          resolve(values);
        } else {
          reject(new Error("Falha ao ler arquivo"));
        }
      };

      reader.onerror = () => reject(new Error("Erro ao processar arquivo"));
      reader.readAsArrayBuffer(file);
    });
  };

  try {
    // Lê todos os arquivos em paralelo
    const results = await Promise.all(
      Array.from(selectedFiles).map(file => processFile(file))
    );

    // Junta tudo e tira duplicados
    const merged = Array.from(new Set(results.flat()));

    data(merged);
    changeComponent('Tag');
  } catch (err) {
    alert("Erro ao processar um ou mais arquivos. Por favor, tente novamente.");
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="pageHeader">
      <div className="content">
        <h2>GERAR ETIQUETAS WMS {version}</h2>
        <p>Arraste ou clique para enviar.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            min={1}
            placeholder="Quantidade de páginas"
            value={pageCount}
            onChange={(e) => setPageCount(Number(e.target.value))}
            className="input__pages"
          />
          <div className="input__form">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
            />
            <span className="input__text">
              {selectedFiles.length
                ? selectedFiles.map((file: any) => file.name).join(", ")
                : "Escolher Arquivo"}
            </span>
          </div>
          {selectedFiles.length > 0 && (
            <div>
              <p>Arquivos selecionados:</p>
              <ul>
                {selectedFiles.map((file: any, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          <button type="submit" className="input__button" disabled={!isLoadFile}>
            {isSubmitting ? `Processando...` : "Gerar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;


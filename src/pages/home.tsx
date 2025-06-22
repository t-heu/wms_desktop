import React, { useState, useCallback } from 'react';

import '../styles/home.scss';
import readFile from '../utils/readFile';

import { version } from '../../package.json';

interface HomeProps {
  data: React.Dispatch<React.SetStateAction<any[]>>
  changeComponent: (component: string) => void
}

const VALID_EXTENSIONS = ['xlsx', 'xls', 'ods', 'csv'];

const Home = ({data, changeComponent}: HomeProps) => {
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

    const file = selectedFiles[0];

    if (!file) {
      alert("Nenhum arquivo foi selecionado.");
      setIsSubmitting(false);
      return;
    }

    //console.time("processo");
    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result;
      if (buffer) {
        data(readFile(buffer as ArrayBuffer));
        changeComponent('Tag');
        //console.timeEnd("processo");
      }
      setIsSubmitting(false);
    };

    reader.onerror = () => {
      alert("Erro ao processar o arquivo. Por favor, tente novamente.");
      setIsSubmitting(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="pageHeader">
      <div className="content">
        <h2>GERAR ETIQUETAS WMS {version}</h2>
        <p>Arraste ou clique para enviar.</p>
        <form onSubmit={handleSubmit}>
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


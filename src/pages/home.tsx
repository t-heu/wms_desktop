import React, { useState } from 'react';

import '../styles/home.scss';
import readFile from '../utils/readFile';

const Home = ({data, changeComponent}: any) => {
  const [name, setName] = useState("Arraste ou clique para enviar.");
  const [fileData, setFileData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const VALID_EXTENSIONS = ['xlsx', 'xls', 'ods', 'csv'];

  const validateFileExtension = (fileName: string): boolean => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext ? VALID_EXTENSIONS.includes(ext) : false;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      alert("Nenhum arquivo selecionado");
      return;
    }

    if (!validateFileExtension(file.name)) {
      alert(`Arquivo com formato inválido! Permitido: ${VALID_EXTENSIONS.join(', ')}`);
      return;
    }

    setName(file.name);
    setFileData(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!fileData) {
      alert("Nenhum arquivo foi selecionado.");
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const buffer = e.target?.result;
        if (buffer) {
          data(readFile(buffer as ArrayBuffer));
          changeComponent('Tag');
        }
      };

      reader.onerror = () => {
        alert("Erro ao processar o arquivo. Por favor, tente novamente.");
      };

      reader.readAsArrayBuffer(fileData);
    } catch (error) {
      console.error("Erro:", error);
      setIsSubmitting(false);
      alert("Erro inesperado. Tente novamente mais tarde.");
    }
  };

  return (
    <main className='pageHome'>
      <div className='content'>
        <h2>GERAR ETIQUETAS WMS</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <button
            title="Enviar"
            type="submit"
            className='input__button'
            disabled={!fileData || isSubmitting}
          >
            {isSubmitting ? "Processando..." : "ENVIAR"}
          </button>
          <div className='input__form'>
            <input
              name="file"
              type="file"
              multiple={false}
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <span className='input__text' data-js-label="data-js-label">
              {name}
            </span>
          </div>
          
        </form>
      </div>
      <footer>
        <p>
          version: 1.2
        </p>
      </footer>
    </main>
  );
};

export default Home;

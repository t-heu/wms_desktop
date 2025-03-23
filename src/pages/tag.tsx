import { useState, useMemo, useEffect } from "react";

import {encodeToCode128} from '../utils/code128'
import '../styles/tag.scss';

declare global {
  interface Window {
    changePage: (page: number) => Promise<void>;
  }
}

function Tag({data = [], changeComponent}: any) {
  const ITEMS_PER_PAGE = 500; // Defina quantos itens deseja por página
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => Math.ceil(data.length / ITEMS_PER_PAGE), [data.length]);

  useEffect(() => {
    window.changePage = (page: number) => {
      return new Promise((resolve) => {
        setCurrentPage(page);
        setTimeout(resolve, 300); // Pequeno delay para garantir que renderizou
      });
    };
  }, []);
  
  useEffect(() => {
    const convertButton = document.getElementById('convert');
    
    if (convertButton) {
      convertButton.addEventListener('click', () => {
        // Enviar a solicitação para o processo principal para gerar o PDF
        window.electron.ipcRenderer.send('convert-pdf', totalPages);
      });
    } else {
      console.log("O botão com ID 'convert' não foi encontrado.");
    }
  },[]);

  // Dados da página atual
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return data.slice(start, end);
  }, [data, currentPage]);

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatText = (text: string) => {
    const match = text.match(/(?:\d+[A-Z]?\s?[A-Z]?\s)(.*)/); // Captura tudo após o prefixo
    if (match) return match[1]
  };

  return (
    <main className='pageTag'>
      <header className='header'>
        <a onClick={() => changeComponent('Home')} title="Voltar" className='headerAction'>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="30"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </a>

        Total: {data.length} | Página: {currentPage} / {totalPages}

        <a id="convert" title="Baixar" className='headerAction'>
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="30"
          width="30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        </a>
      </header>

      {/* Paginação */}
      <nav className='header'>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >Anterior</button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >Próxima</button>
      </nav>

      <article className='tagContainer'>
        {currentData.map((text: string, index: number) => (
          <div className='tagCard' key={index}>
            <p className='tagText'>
              {formatText(text)}
            </p>
            <p className='tagBarcode'>
              {encodeToCode128(text)}
            </p>
          </div>
        ))}
      </article>
    </main>
  );
}

export default Tag;

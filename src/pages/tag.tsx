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
  const [isCancelled, setIsCancelled] = useState(false);
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
    // Ouve quando o processo de geração de PDFs é cancelado ou concluído
    window.electron.ipcRenderer.on("pdf-cancelled", () => {
      setIsCancelled(false);  // Define o estado como cancelado
    });

    window.electron.ipcRenderer.on("pdf-completed", () => {
      setIsCancelled(false);  // Restaura o estado inicial após o processo ser concluído
    });
  },[]);

  const HandleDownloadAll = () => {
    window.electron.ipcRenderer.send("download-all-pdfs", totalPages);
    setIsCancelled(true);
  };

  const HandleDownloadSingle = () => {
    window.electron.ipcRenderer.send("download-single-pdf");
  };

  const cancelProcess = () => {
    window.electron.ipcRenderer.send("cancel-pdf");
    setIsCancelled(false);
  };

  // Dados da página atual
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return data.slice(start, end);
  }, [data, currentPage]);

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

        <div>
          <a style={{ marginRight: '15px' }} onClick={HandleDownloadSingle} id="convert" title="Baixar página atual" className='headerAction'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 2H18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
              <path d="M6 2l6 6h6" />
            </svg>
          </a>

          {isCancelled ? (
            <a onClick={cancelProcess} title="Cancelar" className='headerAction'>
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
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </a>
          ):(
            <a onClick={HandleDownloadAll} id="convert" title="Baixar tudo" className='headerAction'>
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
          )}
        </div>
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

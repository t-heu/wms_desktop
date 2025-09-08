import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/global.scss'

import Home from './pages/home';
import Tag from './pages/tag';

const root = createRoot(document.body);

const App = () => {
  const [componentToRender, setComponentToRender] = useState('Home');
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(500);

  const changeComponent = (component: string) => setComponentToRender(component);

  return (
    <>
      {componentToRender === 'Tag' && <Tag changeComponent={changeComponent} data={data} pageCount={pageCount} />}
      {componentToRender === 'Home' && <Home changeComponent={changeComponent} data={setData} pageCount={pageCount} setPageCount={setPageCount} />}
    </>
  )
};

root.render(<App />);

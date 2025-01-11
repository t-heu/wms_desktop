import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/global.scss'

import Home from './pages/home';
import Tag from './pages/tag';

const root = createRoot(document.body);

const App = () => {
  const [componentToRender, setComponentToRender] = useState('Home');
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("Mudando componente para Home");
  }, []);  

  const changeComponent = (component: string) => setComponentToRender(component);

  return (
    <>
      {componentToRender === 'Tag' && <Tag changeComponent={changeComponent} data={data} />}
      {componentToRender === 'Home' && <Home changeComponent={changeComponent} data={setData} />}
    </>
  )
};

root.render(<App />);

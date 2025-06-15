import React, { StrictMode, useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import './index.css';
import App from './App.jsx';
import './utils/i18n.js';
import { themes } from './utils/themes.js';

// 1) Crea el contexto para exponer la clave y la función de cambio
const ThemeContext = createContext({
  themeKey: 'darkGreen',
  setThemeKey: (_k) => {}
});

export const useThemeKey = () => useContext(ThemeContext).themeKey;
export const useSetThemeKey = () => useContext(ThemeContext).setThemeKey;


function Root() {
  // 3) Lee la clave inicial de localStorage (o usa 'darkGreen' por defecto)
  const [themeKey, setThemeKeyRaw] = useState(() => {
    return localStorage.getItem('themeKey') || 'darkGreen';
  });

  // 4) Crea un setter que también guarde en localStorage
  const setThemeKey = (key) => {
    localStorage.setItem('themeKey', key);
    setThemeKeyRaw(key);
  };

  // 5) Selecciona el objeto theme de acuerdo a la clave
  const activeTheme = themes[themeKey] || themes.darkGreen;

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey }}>
      <ThemeProvider theme={activeTheme}>
        <StrictMode>
          <App />
        </StrictMode>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
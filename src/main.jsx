import React, { StrictMode, useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import './index.css';
import App from './App.jsx';
import './utils/i18n.js';

// 1) Crea el contexto para exponer la clave y la función de cambio
const ThemeContext = createContext({
  themeKey: 'darkGreen',
  setThemeKey: (_k) => {}
});

export const useThemeKey = () => useContext(ThemeContext).themeKey;
export const useSetThemeKey = () => useContext(ThemeContext).setThemeKey;

// 2) Define tus paletas
const themes = {
  lightGreen: { colors: { background: '#fff', text: '#000', textInverse: '#fff', primary: '#25d328', secondary: '#47ff3d' } },
  darkGreen:  { colors: { background: '#192b15', text: '#fff', textInverse: '#000', primary: '#19941b', secondary: '#1eba20' } },
  lightBlue:  { colors: { background: '#fff', text: '#000', textInverse: '#fff', primary: '#4489cf', secondary: '#6aa1d9' } },
  darkBlue:   { colors: { background: '#15202b', text: '#fff', textInverse: '#000', primary: '#eff3f4', secondary: '#1d9bf0' } },
  lightPink:  { colors: { background: '#fff', text: '#000', textInverse: '#fff', primary: '#fc42c9', secondary: '#ff6ed7' } },
  darkPink:   { colors: { background: '#2b1525', text: '#fff', textInverse: '#000', primary: '#eff3f4', secondary: '#e02daf' } },
};

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
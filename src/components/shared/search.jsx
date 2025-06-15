/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {css , useTheme} from '@emotion/react';

export default function Search({
  onSearch,
  isExplorePage = false,
  searchString,
  setSearchString, // sólo se usará para páginas que no son Explore
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const textAreaRef = useRef(null);
  const theme = useTheme();

  // 1) Estado local para el input cuando estamos en ExplorePage
  const [inputValue, setInputValue] = useState(searchString);

  // 2) Sincronizar desde fuera (por ejemplo, al cargar con ?search=…)
  useEffect(() => {
    if (isExplorePage) {
      setInputValue(searchString);
    }
  }, [searchString, isExplorePage]);

  // 3) Ajuste dinámico de altura si fuera un textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // 4) Función que se llama sólo al pulsar Enter
  const handleSearch = (search) => {
      onSearch(search);
      navigate(`/explore?search=${encodeURIComponent(search)}`);
  };

  // 5) Manejador de cambio: 
  //    - en ExplorePage sólo modifico inputValue  
  //    - fuera de ExplorePage actualizo directamente el state externo
  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length > 500) return;

    if (isExplorePage) {
      setInputValue(val);
    } else {
      setSearchString(val);
    }
  };

  return (
    <div className="w-full px-4 py-5">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* ícono de búsqueda */}
          <svg
            className="h-4 w-4 fill-current"
            css={css`
              color: ${theme.colors.textMid};
            `}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 56.966 56.966"
            width="512px"
            height="512px"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786
                c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,
                13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92
                c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z
                M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z"
            />
          </svg>
        </div>

        <input
          ref={textAreaRef}
          type="search"
          placeholder={t("SEARCHBAR.PLACEHOLDER")}
          // 6) Value según contexto
          value={isExplorePage ? inputValue : searchString}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e.target.value);
            }
          }}
          className="w-full py-3 pl-10 pr-4 rounded-full text-sm focus:outline-none border-0 shadow"
          css={css`
            background-color: ${theme.colors.primary};
            color: ${theme.colors.text};
          `}
        />
      </div>
    </div>
  );
}
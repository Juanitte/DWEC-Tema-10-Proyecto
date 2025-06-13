import { useTranslation } from 'react-i18next';
import { useSetThemeKey, useThemeKey } from '../../main';

const themePreviews = {
    lightGreen: { light: '#ffffff', dark: '#25d328' },
    darkGreen: { light: '#005701', dark: '#1eba20' },
    lightBlue: { light: '#ffffff', dark: '#4489cf' },
    darkBlue: { light: '#15202b', dark: '#1d9bf0' },
    lightPink: { light: '#ffffff', dark: '#fc42c9' },
    darkPink: { light: '#2b1525', dark: '#e02daf' },
};

const options = Object.keys(themePreviews);

export default function ThemeSelector() {
    const setThemeKey = useSetThemeKey();
    const current = useThemeKey();
    const { t } = useTranslation();

    return (
        <>
            <p className="text-lg text-white pb-2 pl-8 pt-8 bold">
                {t('SETTINGS.THEME')}:
            </p>
            <div className="flex gap-3 p-4 pb-8">
                {options.map(key => {
                    const { light, dark } = themePreviews[key];
                    const isActive = current === key;

                    return (
                        <button
                            key={key}
                            onClick={() => setThemeKey(key)}
                            className={`
                            relative w-8 h-8 rounded-full overflow-hidden border-2 transition
                            ${isActive ? '' : 'border-transparent'}
                        `}
                            style={{
                                border: isActive ? '2px solid' : '2px solid transparent',
                                borderColor: isActive ? 'white' : 'transparent'
                            }}
                            aria-label={`Tema ${key}`}
                        >
                            {/* mitad clara */}
                            <div
                                className="absolute top-0 left-0 h-full w-1/2"
                                style={{ backgroundColor: light }}
                            />
                            {/* mitad oscura */}
                            <div
                                className="absolute top-0 right-0 h-full w-1/2"
                                style={{ backgroundColor: dark }}
                            />
                        </button>
                    );
                })}
            </div>
        </>
    );
}
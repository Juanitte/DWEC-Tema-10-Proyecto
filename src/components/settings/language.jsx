import { useTranslation } from "react-i18next";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

const LANGUAGES = [
    { code: "en-GB", label: "English", flag: "/england.png" },
    { code: "es-ES", label: "Español", flag: "/spain.png" },
];

export default function Language({ isLogin = false }) {
    const { t, i18n } = useTranslation();
    const [selected, setSelected] = useState(
        LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]
    );

    useEffect(() => {
        const stored = localStorage.getItem("i18nextLng");
        if (stored && stored !== selected.code) {
            const found = LANGUAGES.find(l => l.code === stored);
            if (found) {
                setSelected(found);
                i18n.changeLanguage(stored);
            }
        }
    }, []);

    const onChange = (lang) => {
        setSelected(lang);
        i18n.changeLanguage(lang.code);
        localStorage.setItem("i18nextLng", lang.code);
    };

    return (
        <div className="w-full p-8">
            {
                !isLogin &&
                <p className="text-lg text-white pb-2 bold">
                    {t('SETTINGS.LANGUAGE')}:
                </p>
            }
            <Listbox
                as="div"
                value={selected}
                onChange={onChange}
                className="relative inline-block"
            >
                {/* botón también inline-flex */}
                {
                    !isLogin ?
                        <Listbox.Button className="inline-flex items-center justify-between w-auto bg-dim-700 text-white py-2 px-3 rounded-md">
                            <img src={selected.flag} className="w-5 h-5 mr-2 rounded-sm" alt="" />
                            <span>{selected.label}</span>
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none" stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Listbox.Button>
                        :
                        <Listbox.Button className="focus:outline-none inline-flex items-center justify-between w-auto bg-white text-black py-2 px-3 rounded-md border border-gray-500">
                            <img src={selected.flag} className="w-5 h-5 mr-2 rounded-sm" alt="" />
                            <span>{selected.label}</span>
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none" stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Listbox.Button>
                }

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    {
                        !isLogin ?
                            <Listbox.Options
                                className="
                                    absolute left-0 z-10 mt-1
                                    min-w-full
                                    bg-dim-700 text-white
                                    rounded-md shadow-lg
                                    overflow-y-auto max-h-60
                                    overflow-x-hidden
                                "
                            >
                                {LANGUAGES.map((lang) => (
                                    <Listbox.Option
                                        key={lang.code}
                                        value={lang}
                                        className={({ active }) =>
                                            `flex items-center cursor-pointer px-3 py-2 ${active ? "bg-dim-600" : ""
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <img src={lang.flag} className="w-5 h-5 mr-2 rounded-sm" alt="" />
                                                <span className={selected ? "font-semibold" : ""}>{lang.label}</span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                            :
                            <Listbox.Options
                                className="
                                    absolute left-0 z-10 mt-1
                                    min-w-full
                                    bg-white text-black
                                    rounded-md shadow-lg
                                    overflow-y-auto max-h-60
                                    overflow-x-hidden
                                    focus:outline-none
                                    border border-gray-500
                                "
                            >
                                {LANGUAGES.map((lang) => (
                                    <Listbox.Option
                                        key={lang.code}
                                        value={lang}
                                        className={({ active }) =>
                                            `flex items-center cursor-pointer px-3 py-2 ${active ? "bg-[#3a9932] text-white" : ""
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <img src={lang.flag} className="w-5 h-5 mr-2 rounded-sm" alt="" />
                                                <span className={selected ? "font-semibold" : ""}>{lang.label}</span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                    }
                </Transition>
            </Listbox>

        </div>
    );
}
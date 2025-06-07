import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { login } from "../../services/users-service";
import { useTranslation } from "react-i18next";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const { t, i18n } = useTranslation();

    const handleLogin = (event) => {
        event.preventDefault();

        if (email && password) {
            login(email, CryptoJS.SHA256(password).toString().concat('@', 'A', 'a'), rememberMe).then((response) => {
                if (response.userId) {
                    navigate("/");
                }
            })
        } else {
            alert("Por favor, completa todos los campos");
        }
    };

    return (
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full">
            <h1 className="text-4xl font-bold">
                {t('LOGIN.WELCOME')}
            </h1>
            <h1 className="text-2xl font-semibold pb-4">
                {t('LOGIN.SUBTITLE')}
            </h1>
            <form onSubmit={handleLogin} className="pb-4">
                <div className="pb-4">
                    <label htmlFor="email" className="block text-gray-600">
                        {t('LOGIN.EMAIL')}
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autoComplete="off"
                    />
                </div>
                <div className="pb-4">
                    <label htmlFor="password" className="block text-gray-600">
                        {t('LOGIN.PASSWORD')}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autoComplete="off"
                    />
                </div>
                <div className="pb-6 text-[#3a9932]">
                    <a href="#" className="hover:underline">
                        {t('LOGIN.FORGOT_PASSWORD')}
                    </a>
                </div>
                <div className="pb-4">
                    <label className="inline-flex items-center cursor-pointer">
                        {/* 1. Checkbox “invisible” */}
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            defaultChecked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="peer sr-only"
                        />

                        {/* 2. Span que dibuja el cuadrito y pinta el “✓” como pseudo‐elemento */}
                        <span
                            className="
                                relative
                                w-4 h-4
                                border border-gray-300
                                rounded

                                bg-white
                                peer-checked:bg-[#3a9932]
                                peer-checked:border-[#3a9932]

                                peer-checked:before:content-['✓']
                                peer-checked:before:absolute
                                peer-checked:before:inset-0
                                peer-checked:before:flex
                                peer-checked:before:items-center
                                peer-checked:before:justify-center
                                peer-checked:before:text-white
                                peer-checked:before:text-xs
                            "
                        />

                        {/* 3. Etiqueta de texto */}
                        <span className="ml-2 select-none text-gray-700">{t("LOGIN.REMEMBER_ME")}</span>
                    </label>
                </div>
                <button type="submit" className="bg-[#3a9932] hover:bg-[#296d24] text-white font-semibold rounded-md py-2 px-4 w-full">
                    {t('LOGIN.LOGIN')}
                </button>
            </form>
            <button onClick={() => navigate("/signup")} className="bg-[#3a9932] hover:bg-[#296d24] text-white font-semibold rounded-md py-2 px-4 w-full">
                {t('LOGIN.SIGNUP')}
            </button>
        </div>
    );
}
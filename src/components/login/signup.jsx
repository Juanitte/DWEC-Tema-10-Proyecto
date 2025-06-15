import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EMAIL_REGEX, PASSWORD_REGEX, TAG_REGEX, USERNAME_REGEX } from "../../utils/literals";
import { Country } from "../../utils/enums";
import { CreateUserDto } from "../../models/createUserDto";
import { createUser } from "../../services/users-service";
import CryptoJS from "crypto-js";
import { useTranslation } from "react-i18next";
import Language from "../settings/language";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

export default function Signup() {
    const { t, i18n } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordTooltip, setPasswordTooltip] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [usernameTooltip, setUsernameTooltip] = useState(false);
    const [fullname, setFullname] = useState("");
    const [fullnameTooltip, setFullnameTooltip] = useState(false);
    const [tag, setTag] = useState("@");
    const [tagTooltip, setTagTooltip] = useState(false);
    const [country, setCountry] = useState(0);
    const [countries, setCountries] = useState(Object.values(Country));
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 1024 });

    const validateForm = () => {
        return EMAIL_REGEX.test(email) && PASSWORD_REGEX.test(password) && password === confirmPassword && USERNAME_REGEX.test(username) && USERNAME_REGEX.test(fullname) && TAG_REGEX.test(tag) && country != 0;
    };

    const rearrangeCountries = () => {
        const sorted = Object.values(Country)
            .filter((val) => typeof val === "number" && val !== Country.UNDEFINED)
            .sort((a, b) => {
                const keyA = Object.keys(Country).find(key => Country[key] === a);
                const keyB = Object.keys(Country).find(key => Country[key] === b);
                const labelA = t(`COUNTRIES.${keyA}`);
                const labelB = t(`COUNTRIES.${keyB}`);
                return labelA.localeCompare(labelB, i18n.language);
            });
        setCountries(sorted);
    };

    useEffect(() => {
        rearrangeCountries();
    }, [i18n.language]);

    const handleSignup = (event) => {
        event.preventDefault();

        const toastId = toast.loading(t('TOAST.LOADING'))

        let user = new CreateUserDto(tag, "", "/default_user.webp", username, fullname, +country, email, CryptoJS.SHA256(password).toString().concat('@', 'A', 'a'), "", 1);

        user.link = "";
        createUser(user).then((response) => {
            if (response.status === 200) {
                toast.update(toastId, { render: t('TOAST.SIGNUP-SUCCESS'), type: "success", isLoading: false, autoClose: 2000 });
                navigate("/login");
            } else {
                toast.update(toastId, { render: t('TOAST.SIGNUP-ERROR'), type: "error", isLoading: false, autoClose: 4000 });
            }
        });
    };

    return (
        <div className="p-8 w-full">
            <div className={ isMobile ? `` : `absolute top-4 right-4`}>
                <Language isLogin={true} />
            </div>
            <h1 className="text-4xl font-bold mb-4">
                {t('SIGNUP.WELCOME')}
            </h1>
            <h1 className="text-2xl font-semibold pb-4">
                {t('SIGNUP.SUBTITLE')}
            </h1>
            <form onSubmit={(event) => handleSignup(event)} className="pb-4 overflow-y-auto">
                <div className="pb-4">
                    <label htmlFor="email" className="block text-gray-600">
                        {t('SIGNUP.EMAIL')}
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#3a9932]"
                        autoComplete="off"
                    />
                </div>
                <div className="pb-4">
                    <label htmlFor="password" className="block text-gray-600">
                        {t('SIGNUP.PASSWORD')}
                        <span onMouseEnter={() => setPasswordTooltip(true)} onMouseLeave={() => setPasswordTooltip(false)} className="rounded-xl px-2 text-white font-bold bg-[#3a9932]">?</span>
                        <span style={{ display: passwordTooltip ? "inline" : "none" }} className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:border-[#3a9932]">
                            {t('SIGNUP.PASSWORD_TOOLTIP')}
                        </span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onFocus={() => setPasswordTooltip(true)}
                        onBlur={() => setPasswordTooltip(false)}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#3a9932]"
                        autoComplete="off"
                    />
                </div>
                <div className="pb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-600">
                        {t('SIGNUP.CONFIRM_PASSWORD')}
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#3a9932]"
                        autoComplete="off"
                    />
                </div>
                <div className="pb-4">
                    <label htmlFor="username" className="block text-gray-600">
                        {t('SIGNUP.USERNAME')}
                        <span onMouseEnter={() => setUsernameTooltip(true)} onMouseLeave={() => setUsernameTooltip(false)} className="rounded-xl px-2 text-white font-bold bg-[#3a9932]">?</span>
                        <span style={{ display: usernameTooltip ? "inline" : "none" }} className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:border-[#3a9932]">
                            {t('SIGNUP.USERNAME_TOOLTIP')}
                        </span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onFocus={() => setUsernameTooltip(true)}
                        onBlur={() => setUsernameTooltip(false)}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#3a9932]"
                        autoComplete="off"
                    />
                </div>
                <div className="pb-4">
                    <label htmlFor="fullname" className="block text-gray-600">
                        {t('SIGNUP.FULLNAME')}
                        <span onMouseEnter={() => setFullnameTooltip(true)} onMouseLeave={() => setFullnameTooltip(false)} className="rounded-xl px-2 text-white font-bold bg-[#3a9932]">?</span>
                        <span style={{ display: fullnameTooltip ? "inline" : "none" }} className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:border-[#3a9932]">
                            {t('SIGNUP.FULLNAME_TOOLTIP')}
                        </span>
                    </label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={fullname}
                        onFocus={() => setFullnameTooltip(true)}
                        onBlur={() => setFullnameTooltip(false)}
                        onChange={(e) => setFullname(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#3a9932]"
                        autoComplete="off"
                    />
                </div>
                <div className="pb-4">
                    <label htmlFor="tag" className="block text-gray-600">
                        {t('SIGNUP.TAG')}
                        <span onMouseEnter={() => setTagTooltip(true)} onMouseLeave={() => setTagTooltip(false)} className="rounded-xl px-2 text-white font-bold bg-[#3a9932]">?</span>
                        <span style={{ display: tagTooltip ? "inline" : "none" }} className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:border-[#3a9932]">
                            {t('SIGNUP.TAG_TOOLTIP')}
                        </span>
                    </label>
                    <input
                        type="text"
                        id="tag"
                        name="tag"
                        value={tag}
                        onFocus={() => setTagTooltip(true)}
                        onBlur={() => setTagTooltip(false)}
                        onChange={(e) => e.target.value.length == 0 ? setTag("@") : setTag(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#3a9932]"
                        autoComplete="off"
                    />
                </div>
                <div className="pb-4">
                    <label htmlFor="country" className="block text-gray-600">
                        {t('SIGNUP.COUNTRY')}
                    </label>
                    <select
                        id="country"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(parseInt(e.target.value, 10))}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#3a9932]"
                        autoComplete="off"
                    >

                        {/* Opción placeholder */}
                        <option value={Country.UNDEFINED}>---</option>

                        {/* Una opción por cada valor numérico del enum, manteniendo su valor original */}
                        {countries.map((c) => (
                            <option key={c} value={c}>
                                {t(`COUNTRIES.${Object.keys(Country).find(key => Country[key] === c)}`)}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={!validateForm()} className="disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed bg-[#3a9932] hover:bg-[#296d24] text-white font-semibold rounded-md py-2 px-4 w-full">
                    {t('SIGNUP.SIGNUP')}
                </button>
            </form>
            <button onClick={() => navigate("/login")} className="bg-[#3a9932] hover:bg-[#296d24] text-white font-semibold rounded-md py-2 px-4 w-full">
                {t('SIGNUP.BACK')}
            </button>
        </div>
    );
}
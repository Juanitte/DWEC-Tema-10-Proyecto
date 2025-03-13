import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EMAIL_REGEX, PASSWORD_REGEX, TAG_REGEX, USERNAME_REGEX } from "../../utils/literals";
import { Country } from "../../utils/enums";
import { CreateUserDto } from "../../models/createUserDto";
import { createUser } from "../../services/api-service";
import CryptoJS from "crypto-js";

export default function Signup() {
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
    const [country, setCountry] = useState(Country.UNDEFINED);
    const navigate = useNavigate();
    let count = 1;

    const validateForm = () => {
        return EMAIL_REGEX.test(email) && PASSWORD_REGEX.test(password) && password === confirmPassword && USERNAME_REGEX.test(username) && USERNAME_REGEX.test(fullname) && TAG_REGEX.test(tag) && country !== Country.UNDEFINED;
    };

    const handleSignup = (event) => {
        event.preventDefault();

        let user = new CreateUserDto(tag, "", "/default_user.webp", username, fullname, +country, email, CryptoJS.SHA256(password).toString().concat('@', 'A', 'a'), "", 1);

        createUser(user).then((response) => {
            if (response.status === 200) {
                navigate("/login");
            } else {
                console.log(response);
            }
        });
    };

    return (
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-4xl font-bold mb-4">Welcome to Firebreath</h1>
                <h1 className="text-2xl font-semibold pb-4">Signup</h1>
                <form onSubmit={(event) => handleSignup(event)} className="pb-4 overflow-y-auto">
                    <div className="pb-4">
                        <label htmlFor="email" className="block text-gray-600">Email</label>
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
                        <label htmlFor="password" className="block text-gray-600">Password <span onMouseEnter={() =>setPasswordTooltip(true)} onMouseLeave={() =>setPasswordTooltip(false)} className="rounded-xl px-2 text-white font-bold bg-blue-500">?</span><span style={{display: passwordTooltip ? "inline" : "none"}} className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:border-blue-500">Must include at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 non-alphanumeric character.</span></label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onFocus={() => setPasswordTooltip(true)}
                            onBlur={() => setPasswordTooltip(false)}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                        />
                    </div>
                    <div className="pb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                        />
                    </div>
                    <div className="pb-4">
                        <label htmlFor="username" className="block text-gray-600">Username <span onMouseEnter={() =>setUsernameTooltip(true)} onMouseLeave={() =>setUsernameTooltip(false)} className="rounded-xl px-2 text-white font-bold bg-blue-500">?</span><span style={{display: usernameTooltip ? "inline" : "none"}} className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:border-blue-500">Must be between 3 and 30 characters.</span></label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onFocus={() => setUsernameTooltip(true)}
                            onBlur={() => setUsernameTooltip(false)}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                        />
                    </div>
                    <div className="pb-4">
                        <label htmlFor="fullname" className="block text-gray-600">Full Name <span onMouseEnter={() =>setFullnameTooltip(true)} onMouseLeave={() =>setFullnameTooltip(false)} className="rounded-xl px-2 text-white font-bold bg-blue-500">?</span><span style={{display: fullnameTooltip ? "inline" : "none"}} className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:border-blue-500">Must be between 3 and 40 characters.</span></label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={fullname}
                            onFocus={() => setFullnameTooltip(true)}
                            onBlur={() => setFullnameTooltip(false)}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                        />
                    </div>
                    <div className="pb-4">
                        <label htmlFor="tag" className="block text-gray-600">Tag <span onMouseEnter={() =>setTagTooltip(true)} onMouseLeave={() =>setTagTooltip(false)} className="rounded-xl px-2 text-white font-bold bg-blue-500">?</span><span style={{display: tagTooltip ? "inline" : "none"}} className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:border-blue-500">Must be between 3 and 20 characters.</span></label>
                        <input
                            type="text"
                            id="tag"
                            name="tag"
                            value={tag}
                            onFocus={() => setTagTooltip(true)}
                            onBlur={() => setTagTooltip(false)}
                            onChange={(e) => e.target.value.length == 0 ? setTag("@") : setTag(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                        />
                    </div>
                    <div className="pb-4">
                        <label htmlFor="country" className="block text-gray-600">Country</label>
                        <select
                            id="country"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                        >
                            {
                                Object.values(Country).map((country) => (
                                    country !== Country.UNDEFINED ?
                                    <option key={country} value={count++}>
                                        {country}
                                    </option>
                                    :
                                    <option key={country} value={count++} disabled>
                                        ---
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <button type="submit" disabled={!validateForm()} className="disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
                        Sign up
                    </button>
                </form>
                <button onClick={() => navigate("/login")} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
                        Back
                </button>
            </div>
    );
}
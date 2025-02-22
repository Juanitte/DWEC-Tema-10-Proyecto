import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [tag, setTag] = useState("");
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();

        if (email && password) {
            localStorage.setItem("user", email);
            navigate("/");
        } else {
            alert("Por favor, completa todos los campos");
        }
    };

    const handleSignup = (event) => {
        event.preventDefault();

        if (email && password) {
            localStorage.setItem("user", email);
            navigate("/login");
        } else {
            alert("Por favor, completa todos los campos");
        }
    };

    return (
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-4xl font-bold mb-4">Welcome to Firebreath</h1>
                <h1 className="text-2xl font-semibold mb-4">Signup</h1>
                <form onSubmit={handleLogin} className="pb-4 overflow-y-auto">
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">Password</label>
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
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-600">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tag" className="block text-gray-600">Tag</label>
                        <input
                            type="text"
                            id="tag"
                            name="tag"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
                        Sign up
                    </button>
                </form>
                <button onClick={() => navigate("/login")} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
                        Back
                </button>
            </div>
    );
}
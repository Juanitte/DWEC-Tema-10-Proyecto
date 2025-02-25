import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    return (
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-4xl font-bold">Welcome to Firebreath</h1>
                <h1 className="text-2xl font-semibold pb-4">Login</h1>
                <form onSubmit={handleLogin} className="pb-4">
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
                    <div className="pb-6 text-blue-500">
                        <a href="#" className="hover:underline">Forgot Password?</a>
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
                        Login
                    </button>
                </form>
                <button onClick={() => navigate("/signup")} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
                        Sign up
                </button>
            </div>
    );
}
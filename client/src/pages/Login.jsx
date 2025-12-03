import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { API } from '../services/api'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                alert(data.message)
                return
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            login(data.user)
            navigate("/dashboard")   // ✅ MISSING: redirect after login
        } catch (error) {
            console.log(error)
            alert("Login failed")
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
            <div className='w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6'>Login</h2>
                <div className='space-y-4'>
                    <input type="email" placeholder='Email' className='w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-border-gray-300 dark:border-gray-600' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Password' className='w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-border-gray-300 dark:border-gray-600' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleLogin} className='w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:opacity-90'>Login</button>
                    <p className='text-center text-sm text-gray-600 dark:text-gray-400'>Don't have an account?{""}
                        <Link to='/signup' className='text-indigo-500 font-medium'>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login

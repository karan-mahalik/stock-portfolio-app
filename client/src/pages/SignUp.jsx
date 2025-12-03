import React, { useContext, useState } from 'react'
import { Link, useNavigate, } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { API } from '../services/api'
const SignUp = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useContext(AuthContext);

    const handleSignup = async () => {
        try {
            const response = await fetch(`${API}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                alert(data.message)
                return
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            login(data.user)
            navigate("/dashboard")

        } catch (error) {
            console.log(error)
            alert("Signup failed")
        }
    }


    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
            <div className='w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6'>
                    Create Account
                </h2>
                <div className='space-y-4'>
                    <input type="text" placeholder='Full Name' className='w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder='Email' className='w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='Password' className='w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleSignup} className='w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:capacity-90'>Sign Up</button>
                    <p className='text-center text-sm text-gray-600 dark:text-gray-400'>Already have an account?{""}
                        <Link to='/login' className='text-indigo-500 font-medium'>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp

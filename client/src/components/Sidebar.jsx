import { BarChart2, Home, Settings, Star } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    const menuitems = [
        { name: "Dashboard", icon: <Home size={20} />, path: '/dashboard' },
        { name: "Portfolio", icon: <BarChart2 size={20} />, path: '/portfolio' },
        { name: "WatchList", icon: <Star size={20} />, path: '/watchlist' },
        { name: "Settings", icon: <Settings size={20} />, path: '/settings' },
    ]
    return (
        <div className='w-60 min-h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4'>
            <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:border-gray-700 p-4'>StockApp</h2>
            <nav className='flex flex-col gap-2'>
                {menuitems.map((item, i) => (
                    <Link key={i} to={item.path} className='flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition'>{item.icon}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export default Sidebar

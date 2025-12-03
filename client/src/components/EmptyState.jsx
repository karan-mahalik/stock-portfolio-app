import React from 'react'

const EmptyState = ({ title, subtitle, buttonText, onButtonClick }) => {
    return (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
            {/* Icon Circle */}
            <div className='w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4'>
                <span className='text-4xl'>📉</span>
            </div>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-1000'>{title}</h2>
            <p className='text-gray-500 text-gray-400 mt-1 mb-6'>{subtitle}</p>
            {buttonText && (
                <button onClick={onButtonClick} className='px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition'>{buttonText}</button>
            )}
        </div>
    )
}

export default EmptyState

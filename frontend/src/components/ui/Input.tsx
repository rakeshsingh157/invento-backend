import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
    return (
        <div className="w-full mb-4">
            <label className="block text-sm font-bold text-black mb-1 ml-1 uppercase tracking-wide">
                {label}
            </label>
            <input
                className={`w-full px-4 py-3 bg-white border-2 ${error ? 'border-red-500' : 'border-black'} rounded-lg text-black placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600 font-bold ml-1">{error}</p>}
        </div>
    );
};

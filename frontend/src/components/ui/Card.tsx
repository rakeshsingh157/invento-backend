import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`glass p-8 rounded-2xl border border-white/10 shadow-2xl ${className}`}>
            {children}
        </div>
    );
};

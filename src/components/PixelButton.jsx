import React from 'react';

const PixelButton = ({ children, onClick, disabled, className = '', ...props }) => {
    return (
        <button
            className={`neon-btn ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default PixelButton;

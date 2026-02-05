import React from 'react';

const PixelCard = ({ children, className = '', title }) => {
    return (
        <div className={`premium-card ${className}`}>
            {title && (
                <div style={{
                    position: 'absolute',
                    top: '-1.2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#000',
                    color: 'var(--neon-cyan)',
                    padding: '0.25rem 1rem',
                    border: '2px solid var(--neon-cyan)',
                    boxShadow: '0 0 10px var(--neon-cyan)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    whiteSpace: 'nowrap'
                }}>
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};

export default PixelCard;

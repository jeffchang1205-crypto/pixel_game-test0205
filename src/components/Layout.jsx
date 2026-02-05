import React from 'react';
import { Outlet } from 'react-router-dom';
const Layout = () => {
    return (
        <div
            className="pixel-container crt"
            style={{
                background: 'linear-gradient(135deg, #0f0518 0%, #2b1055 100%)',
                // backgroundImage: '', // Image generation unavailable
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                minHeight: '100vh'
            }}
        >
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 5, 24, 0.7)', // Dark overlay for readability
                zIndex: 1
            }}></div>

            <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;

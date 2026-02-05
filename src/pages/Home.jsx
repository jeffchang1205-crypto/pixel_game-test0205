import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

const Home = () => {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (!userId.trim()) {
            alert('PLEASE ENTER YOUR ID');
            return;
        }
        // Save ID to session or pass via state
        localStorage.setItem('pixel_game_user_id', userId);
        navigate('/game');
    };

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h1 className="shake">PIXEL QUEST</h1>
            <PixelCard title="PLAYER SELECT">
                <p style={{ marginBottom: '2rem', textShadow: '0 0 5px #fff' }}>ENTER YOUR ID TO START</p>
                <input
                    type="text"
                    className="neon-input" // Changed to new class
                    placeholder="USER ID..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
                <PixelButton onClick={handleStart} style={{ width: '100%' }}>
                    INSERT COIN (START)
                </PixelButton>
            </PixelCard>
        </div>
    );
};

export default Home;

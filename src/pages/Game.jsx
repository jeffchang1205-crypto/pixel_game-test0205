import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, submitResult } from '../services/api';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

const Game = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
    const [bossImage, setBossImage] = useState('');
    const [score, setScore] = useState(0);
    const [canAnswer, setCanAnswer] = useState(false); // Prevention for ghost clicks

    const navigate = useNavigate();
    const userId = localStorage.getItem('pixel_game_user_id');

    const dataFetchedRef = React.useRef(false);

    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        const loadGame = async () => {
            try {
                const count = import.meta.env.VITE_QUESTION_COUNT || 5;
                const qData = await fetchQuestions(count);
                console.log("Loaded Questions:", qData); // Debug log
                setQuestions(qData);
                setBossImage(`https://api.dicebear.com/9.x/pixel-art/svg?seed=${Math.random()}`);
            } catch (error) {
                console.error("Game Load Error:", error);
                alert(`Failed to load questions: ${error.message}. Check console for details.`);
                setQuestions([]); // Set empty or mock
            } finally {
                setLoading(false);
                // Enable answering after a short delay to prevent "ghost clicks" from previous page
                setTimeout(() => setCanAnswer(true), 1000);
            }
        };
        loadGame();
    }, [userId, navigate]);

    const handleAnswer = (optionKey) => {
        if (!canAnswer) return; // Block answers if too early

        // Record answer
        const currentQ = questions[currentIndex];

        // Check correctness see if needed locally
        const isCorrect = currentQ.answer === optionKey;
        if (isCorrect) {
            setScore(s => s + 100); // 100 points per question
        }

        const newAnswers = { ...answers, [currentQ.id]: optionKey };
        setAnswers(newAnswers);

        // Next question or Finish
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setBossImage(`https://api.dicebear.com/9.x/pixel-art/svg?seed=${Math.random()}`);
        } else {
            finishGame(isCorrect ? score + 100 : score, questions.length, newAnswers);
        }
    };

    const finishGame = async (finalScore, total, finalAnswers) => {
        setLoading(true);
        // Submit result
        const threshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3);
        const passed = (finalScore / 100) >= threshold;

        try {
            await submitResult({
                id: userId,
                score: finalScore,
                totalQuestions: total,
                passed: passed,
                answers: finalAnswers
            });
        } catch (e) {
            console.error("Submission failed", e);
        }

        navigate('/result', {
            state: {
                score: finalScore,
                total,
                passed,
                questions,
                answers: finalAnswers
            }
        });
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>LOADING...</div>;
    if (questions.length === 0) return <div style={{ textAlign: 'center' }}>NO QUESTIONS FOUND. CHECK API.</div>;

    const currentQ = questions[currentIndex];

    return (
        <div style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img
                    src={bossImage}
                    alt="Boss"
                    style={{
                        width: '120px',
                        height: '120px',
                        imageRendering: 'pixelated',
                        border: '4px solid #fff',
                        backgroundColor: '#444'
                    }}
                />
                <h3 style={{ marginTop: '10px' }}>Level {currentIndex + 1} / {questions.length}</h3>
            </div>

            <PixelCard title={`BOSS QUIZ #${currentIndex + 1}`}>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    {currentQ.question}
                </p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {Object.entries(currentQ.options).map(([key, text]) => (
                        <PixelButton key={key} onClick={() => handleAnswer(key)} style={{ textAlign: 'left' }}>
                            {key}: {text}
                        </PixelButton>
                    ))}
                </div>
            </PixelCard>
        </div>
    );
};

export default Game;

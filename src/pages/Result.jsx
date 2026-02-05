import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { score, total, passed, questions = [], answers = {} } = state || { score: 0, total: 0, passed: false };

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h1>{passed ? 'MISSION COMPLETE' : 'GAME OVER'}</h1>

            <PixelCard title="SCORE REPORT">
                <div style={{ fontSize: '2rem', margin: '2rem 0', color: passed ? 'var(--secondary-color)' : 'var(--primary-color)' }}>
                    {score} / {total * 100}
                </div>
                <p>Correct Answers: {score / 100} / {total}</p>

                {passed ? (
                    <p style={{ color: 'var(--secondary-color)', marginTop: '1rem' }}>YOU PASS!</p>
                ) : (
                    <p style={{ color: 'var(--primary-color)', marginTop: '1rem' }}>TRY AGAIN!</p>
                )}

            </PixelCard>

            <PixelCard title="ANSWER REVIEW" className="mt-4">
                <div style={{ maxHeight: '300px', overflowY: 'auto', textAlign: 'left', padding: '0 5px' }}>
                    {questions.map((q, index) => {
                        const userAns = answers[q.id];
                        const isCorrect = userAns === q.answer;
                        return (
                            <div key={q.id} style={{
                                marginBottom: '1rem',
                                borderBottom: '2px dashed #444',
                                paddingBottom: '1rem',
                                color: isCorrect ? '#fff' : '#aaa'
                            }}>
                                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--neon-yellow)' }}>Q{index + 1}:</span> {q.question}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                    <span style={{ color: isCorrect ? 'lime' : 'red' }}>
                                        YOU: {userAns || '-'} ({q.options[userAns] || '-'})
                                    </span>
                                    {!isCorrect && (
                                        <span style={{ color: 'lime' }}>
                                            ANS: {q.answer} ({q.options[q.answer]})
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PixelCard>

            <PixelButton onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                BACK TO TITLE
            </PixelButton>
        </div>
    );
};

export default Result;

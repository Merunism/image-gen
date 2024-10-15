// pages/index.js
import { useState, useEffect } from 'react';
import { generateImage } from '../lib/generateImage';
import Head from 'next/head';

export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [imageData, setImageData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [steps, setSteps] = useState(1);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cooldown > 0) return;

        setLoading(true);
        setError('');
        try {
            const b64_json = await generateImage(prompt, steps);
            setImageData(`data:image/png;base64,${b64_json}`);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
            setCooldown(8); // Set 8-second cooldown
        }
    };

    return (
        <div className="container">
            <Head>
                <title>AI Image Generator</title>
                <meta name="description" content="Generate cute images using AI" />
            </Head>
            <h1>🎨 AI Image Generator</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your cute image..."
                    required
                />
                <div className="controls">
                    <label>
                        Steps: {steps}
                        <input
                            type="range"
                            value={steps}
                            onChange={(e) => setSteps(Number(e.target.value))}
                            min="1"
                            max="4"
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading || cooldown > 0}>
                    {loading ? '🌟 Creating...' : cooldown > 0 ? `⏳ Wait ${cooldown}s` : '✨ Generate Cute Image'}
                </button>
            </form>
            {loading && <div className="loader"></div>}
            {error && <p className="error">{error}</p>}
            {imageData && (
                <div className="result">
                    <img src={imageData} alt="Generated cute image" />
                </div>
            )}
            <style jsx>{`
                .container {
                    max-width: 500px;
                    margin: 2rem auto;
                    padding: 1rem;
                    background-color: #fff;
                    border-radius: 15px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #e91e63;
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                form {
                    display: flex;
                    flex-direction: column;
                }
                input[type="text"] {
                    padding: 0.5rem;
                    font-size: 1rem;
                    border: 2px solid #ffb6c1;
                    border-radius: 5px;
                    margin-bottom: 1rem;
                }
                .controls {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1rem;
                }
                .controls label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 0.9rem;
                }
                input[type="range"] {
                    width: 200px;
                    margin-top: 0.5rem;
                }
                button {
                    background-color: #e91e63;
                    color: white;
                    border: none;
                    padding: 0.7rem;
                    font-size: 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                button:hover:not(:disabled) {
                    background-color: #c2185b;
                }
                button:disabled {
                    background-color: #ffb6c1;
                    cursor: not-allowed;
                }
                .error {
                    color: #ff4040;
                    text-align: center;
                    margin-top: 1rem;
                }
                .result {
                    margin-top: 1rem;
                    text-align: center;
                }
                img {
                    max-width: 100%;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .loader {
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #e91e63;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

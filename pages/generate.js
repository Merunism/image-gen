// pages/generate.js
import { useState, useEffect } from 'react';
import { generateImage } from '../lib/generateImage';
import Head from 'next/head';

export default function Generate() {
    const [prompt, setPrompt] = useState('');
    const [imageData, setImageData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [steps, setSteps] = useState(4);
    const [numImages, setNumImages] = useState(1);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress((oldProgress) => {
                    const newProgress = oldProgress + 10;
                    return newProgress > 100 ? 100 : newProgress;
                });
            }, (steps * 1000) / 10);

            return () => clearInterval(interval);
        }
    }, [loading, steps]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setProgress(0);
        try {
            const b64_json = await generateImage(prompt, steps, numImages);
            setImageData(`data:image/png;base64,${b64_json}`);
        } catch (err) {
            setError('Failed to generate image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    return (
        <div className="container">
            <Head>
                <title>Generate an Image with AI</title>
                <meta name="description" content="Generate images using AI" />
            </Head>
            <h1>Generate an Image with AI</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a text prompt"
                    required
                />
                <div className="controls">
                    <label>
                        Steps:
                        <input
                            type="number"
                            value={steps}
                            onChange={(e) => setSteps(Number(e.target.value))}
                            min="1"
                            max="50"
                        />
                    </label>
                    <label>
                        Number of Images:
                        <input
                            type="number"
                            value={numImages}
                            onChange={(e) => setNumImages(Number(e.target.value))}
                            min="1"
                            max="4"
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Image'}
                </button>
            </form>
            {loading && (
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
            )}
            {error && <p className="error">{error}</p>}
            {imageData && (
                <div className="result">
                    <h2>Generated Image:</h2>
                    <img src={imageData} alt="Generated" />
                </div>
            )}
            <style jsx global>{`
                body {
                    background-color: #1a1a1a;
                    color: #ffffff;
                    font-family: Arial, sans-serif;
                }
            `}</style>
            <style jsx>{`
                .container {
                    padding: 2rem;
                    text-align: center;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    color: #0070f3;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 2rem;
                }
                input, button {
                    margin-bottom: 1rem;
                    padding: 0.5rem;
                    font-size: 1rem;
                    background-color: #333;
                    color: white;
                    border: none;
                    border-radius: 4px;
                }
                .controls {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .controls label {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .controls input {
                    width: 60px;
                }
                button {
                    background-color: #0070f3;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #0051a2;
                }
                button:disabled {
                    background-color: #666;
                }
                .error {
                    color: #ff4040;
                }
                .result {
                    margin-top: 2rem;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                }
                .progress-bar {
                    width: 100%;
                    height: 10px;
                    background-color: #333;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                .progress {
                    height: 100%;
                    background-color: #0070f3;
                    transition: width 0.5s ease;
                }
            `}</style>
        </div>
    );
}

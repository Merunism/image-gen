// lib/generateImage.js
import axios from 'axios';

export const generateImage = async (prompt, steps) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/images/generations`,
            {
                prompt,
                model: "black-forest-labs/FLUX.1-schnell-Free",
                width: 1024,
                height: 1024,
                steps: steps,
                n: 1,
                response_format: "b64_json"
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data && response.data.data && response.data.data[0] && response.data.data[0].b64_json) {
            return response.data.data[0].b64_json;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        if (error.response && error.response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few seconds.');
        }
        console.error('Error generating image:', error.response ? error.response.data : error.message);
        throw error;
    }
};

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('API Key:', process.env.NEXT_PUBLIC_API_KEY.substring(0, 5) + '...');

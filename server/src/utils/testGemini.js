import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || 'llama3-70b-8192';

async function testGroq() {
    console.log("Provider: Groq");
    console.log("Model:", model);
    console.log("API key exists:", !!apiKey);

    if (!apiKey) {
        console.error("GROQ_API_KEY is not set");
        process.exit(1);
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const body = {
        model: model,
        messages: [
            { role: 'user', content: 'Say hello' }
        ],
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });

        console.log("Response status:", res.status);

        const data = await res.json();
        console.log("Response body:", JSON.stringify(data, null, 2));

        if (res.ok) {
            const text = data?.choices?.[0]?.message?.content || '';
            console.log("\nExtracted text:", text);
        }
    } catch (err) {
        console.error("Error:", err.message);
    }

    process.exit(0);
}

testGroq();

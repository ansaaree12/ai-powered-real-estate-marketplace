import express from 'express';

const router = express.Router();
const RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook";

router.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        console.log("📤 Sending message to Rasa:", userMessage);

        const response = await fetch(RASA_SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: "user", message: userMessage }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Rasa API Error: ${response.status} - ${errorText}`);
            throw new Error(`Rasa API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Rasa Response:", JSON.stringify(data, null, 2));

        // ✅ Combine all responses from Rasa instead of just sending the first one
        const botReply = data.map((msg) => msg.text).join("\n");

        res.json({ reply: botReply });

    } catch (error) {
        console.error("❌ Rasa Communication Error:", error);
        res.status(500).json({ error: "Failed to communicate with Rasa", details: error.message });
    }
});

export default router;

import Message from '../models/messageModel.js';

export const createMessage = async (req, res) => {
    try {
        const { name, email, phone, message, agentId, agentName } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !message || !agentId || !agentName) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        // Create new message
        const newMessage = new Message({
            name,
            email,
            phone,
            message,
            agentId,
            agentName,
            timestamp: new Date()
        });

        // Save to database
        await newMessage.save();

        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully' 
        });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message', 
            error: error.message 
        });
    }
};
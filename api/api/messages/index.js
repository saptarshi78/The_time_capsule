// /api/messages/index.js
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { text, releaseDate } = req.body;

        // Here, you would save the message data to a database
        // Mocked response for this example:
        const id = Math.random().toString(36).substr(2, 9);  // Mocking message ID
        res.status(200).json({ success: true, id });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

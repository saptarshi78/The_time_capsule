export default function handler(req, res) {
    if (req.method === 'POST') {
        const { text, releaseDate } = req.body;

        // Mock response for creation
        const id = Math.random().toString(36).substr(2, 9);
        res.status(200).json({ success: true, id });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

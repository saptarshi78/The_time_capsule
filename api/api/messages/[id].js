// /api/messages/[id].js
export default function handler(req, res) {
    const { id } = req.query;  // Extract the ID from the URL

    if (req.method === 'GET') {
        // Mocked response for retrieving the message
        // In a real scenario, you would fetch the message from a database based on `id`
        const message = {
            text: `This is the message with ID: ${id}`,
            releaseDate: new Date().toISOString(),
        };

        res.status(200).json({
            success: true,
            message,
            remainingTime: 60,  // Mock remaining time (in seconds)
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

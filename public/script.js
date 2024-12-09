// Form Elements
const messageForm = document.getElementById('messageForm');
const retrieveForm = document.getElementById('retrieveForm');
const messageDisplay = document.getElementById('messageDisplay');
const displayedMessage = document.getElementById('displayedMessage');
const messageTimestamp = document.getElementById('messageTimestamp');
const countdownDisplay = document.getElementById('countdownDisplay'); // Add an element to show countdown

// Event Listener for Creating a Message
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = document.getElementById('messageText').value;
    const releaseDate = document.getElementById('releaseDate').value;
    const releaseTime = document.getElementById('releaseTime').value;

    try {
        console.log('Sending Create Request:', { messageText, releaseDate, releaseTime }); // Debug log
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: messageText,
                releaseDate: `${releaseDate}T${releaseTime}`,
            }),
        });
        const result = await response.json();
        console.log('Create Response Received:', result); // Debug log

        if (result.success) {
            alert(`Message created successfully! Your Message ID is: ${result.id}`);
            messageForm.reset();
        } else {
            alert('Failed to create message. Please try again.');
        }
    } catch (error) {
        console.error('Error in Creating Message:', error);
        alert('Error: Could not connect to the server.');
    }
});

// Event Listener for Retrieving a Message
retrieveForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageId = document.getElementById('messageId').value;

    try {
        console.log('Sending Retrieve Request for ID:', messageId); // Debug log
        const response = await fetch(`/api/messages/${messageId}`);
        const result = await response.json();
        console.log('Retrieve Response Received:', result); // Debug log

        if (result.success) {
            // Message is available now, show the message
            messageDisplay.classList.remove('hidden');
            displayedMessage.textContent = result.message.text;
            messageTimestamp.textContent = `Release Date: ${new Date(result.message.releaseDate).toLocaleString()}`;
            countdownDisplay.classList.add('hidden'); // Hide countdown if message is available
        } else {
            // Handle message not available yet, showing countdown
            if (result.error && result.remainingTime) {
                const countdownTime = result.remainingTime;
                countdownDisplay.classList.remove('hidden');
                startCountdown(countdownTime); // Start countdown from the remaining time

                alert(result.error); // Alert message with the countdown info
            } else {
                // Fallback in case no remainingTime or error message is returned
                alert('Message not found. Please check the ID and try again.');
            }
        }
    } catch (error) {
        console.error('Error in Retrieving Message:', error);
        alert('Error: Could not connect to the server.');
    }
});

// Countdown timer function
function startCountdown(seconds) {
    let countdown = seconds;
    const interval = setInterval(() => {
        if (countdown > 0) {
            const minutes = Math.floor(countdown / 60);
            const secs = countdown % 60;
            countdownDisplay.textContent = `Message will be available in ${minutes}m ${secs}s.`;
            countdown--;
        } else {
            clearInterval(interval);
            countdownDisplay.textContent = 'Message is now available!';
        }
    }, 1000); // Update every second
}

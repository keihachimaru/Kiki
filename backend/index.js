const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow CORS for frontend requests

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to upload audio and run Whisper
app.post('/api/upload-audio', upload.single('audio'), (req, res) => {
    console.log('Audio received');
    const audioBuffer = req.file.buffer;
    const audioPath = path.join(__dirname, 'uploads', 'recording.wav'); // Updated path

    // Ensure the uploads directory exists
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

    // Save the audio buffer to a file
    fs.writeFileSync(audioPath, audioBuffer);

    // Call the Python transcription script
    exec(`python transcribe.py "${audioPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error during transcription: ${error.message}`);
            return res.status(500).send('Error during transcription');
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }

        // Send back the transcription
        res.json({ transcription: stdout.trim() });
        console.log('Transcription sent')
        // Clean up the audio file
        //fs.unlinkSync(audioPath); // Optionally delete the saved audio file
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

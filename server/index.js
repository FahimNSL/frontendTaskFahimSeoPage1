import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { Attachment } from './models/attachment.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect('mongodb+srv://fahim:JDJ0DJrqGtafMFPx@cluster0.oj9ek.mongodb.net/kanban')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Middleware
app.use(cors({ origin: 'http://localhost:5173/' }));  // Explicitly specify the frontend origin
app.use(express.json());

// Configure upload path
const uploadPath = join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
app.use('/uploads', express.static(uploadPath));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes


app.post('/api/attachments/:taskId', upload.array('files'), async (req, res) => {
  try {
    const { taskId } = req.params;  // taskId from URL parameter
    console.log('Received taskId:', taskId);  // Debug log to ensure taskId is correct

    const files = req.files.map(file => ({
      taskId,  // The taskId is linked with the file to ensure it's only for that card
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype,
    }));

    // Save the files to the correct task (taskId)
    const attachments = await Attachment.insertMany(files);
    res.json(attachments);  // Respond with the saved attachment info
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});



app.get('/api/attachments/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    console.log('Fetching attachments for taskId:', taskId);  // Log taskId
    const attachments = await Attachment.find({ taskId });
    console.log('Fetched attachments:', attachments);  // Log results
    res.json(attachments);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

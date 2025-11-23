require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const User = require('./models/User');

const app = express();

// CORS Configuration - Allow requests from frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// DB Connection - Don't block server if MongoDB is not available
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aurapply', {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("⚠️  MongoDB connection failed - Server will continue but database operations may fail");
    console.log("   Error:", err.message);
    console.log("   Tip: Start MongoDB or use MongoDB Atlas");
  });

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY_CHANGE_IN_PRODUCTION';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Google Gemini Configuration (FREE)
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
const genAI = geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here' && geminiApiKey !== 'your_openai_api_key_here'
  ? new GoogleGenerativeAI(geminiApiKey)
  : null;

if (!genAI) {
  console.warn('⚠️  Google Gemini API key not configured. Job analysis feature will not work.');
  console.warn('   Add GEMINI_API_KEY to your backend/.env file');
  console.warn('   Get your FREE key from: https://aistudio.google.com/app/apikey');
  console.warn('   (Google Gemini has a generous free tier!)');
}

// Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ error: "Token required" });
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  
  if (!token) {
    return res.status(403).json({ error: "Token required" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired. Please login again." });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// File Storage Config
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Avatar upload config (images only)
const avatarUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Email Checking Function
async function checkEmailsForUser(userId) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.emailConfig?.user || !user.emailConfig?.pass) {
      return { success: false, error: 'Email config not set' };
    }

    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: user.emailConfig.user,
        password: user.emailConfig.pass,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
      });

      const emails = [];

      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          // Search for unread emails from last 7 days
          const since = new Date();
          since.setDate(since.getDate() - 7);
          
          imap.search(['UNSEEN', ['SINCE', since]], (err, results) => {
            if (err || !results || results.length === 0) {
              imap.end();
              return resolve({ success: true, count: 0, emails: [] });
            }

            const fetch = imap.fetch(results, { bodies: '' });
            let processed = 0;

            fetch.on('message', (msg, seqno) => {
              msg.on('body', (stream, info) => {
                simpleParser(stream, async (err, parsed) => {
                  if (err) {
                    processed++;
                    if (processed === results.length) {
                      imap.end();
                      resolve({ success: true, count: emails.length, emails });
                    }
                    return;
                  }

                  const emailData = {
                    messageId: parsed.messageId || `${Date.now()}-${seqno}`,
                    from: parsed.from?.text || parsed.from?.value?.[0]?.address || 'Unknown',
                    subject: parsed.subject || '(No Subject)',
                    body: parsed.text || parsed.html || '',
                    date: parsed.date || new Date()
                  };

                  emails.push(emailData);
                  processed++;

                  if (processed === results.length) {
                    imap.end();
                    
                    // Classify and save emails - only job-related ones
                    try {
                      const classifiedEmails = await classifyEmails(emails, genAI, user);
                      // Filter to only include job-related emails
                      const jobRelatedEmails = classifiedEmails.filter(email => 
                        email.type !== 'other' || email.isJobRelated
                      );
                      await saveEmailsToUser(userId, jobRelatedEmails);
                      resolve({ success: true, count: jobRelatedEmails.length, emails: jobRelatedEmails });
                    } catch (classifyErr) {
                      console.error('Error classifying emails:', classifyErr);
                      resolve({ success: true, count: 0, emails: [] });
                    }
                  }
                });
              });
            });

            fetch.once('error', (err) => {
              imap.end();
              reject(err);
            });
          });
        });
      });

      imap.once('error', (err) => {
        reject(err);
      });

      imap.connect();
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Classify emails using AI - STRICT: Only job application related emails
async function classifyEmails(emails, genAI, user) {
  if (!genAI || emails.length === 0) {
    return [];
  }

  // Get user's application history to match against
  const userApplications = (user.applications || []).map(app => ({
    company: (app.company || '').toLowerCase(),
    jobTitle: (app.jobTitle || '').toLowerCase()
  }));

  const classified = [];
  
  for (const email of emails) {
    try {
      // First, check if this looks like a promotional/advertisement email
      const promotionalKeywords = ['unsubscribe', 'marketing', 'newsletter', 'promotion', 'sale', 'discount', 
        'special offer', 'limited time', 'click here', 'buy now', 'advertisement', 'sponsored'];
      const emailText = (email.subject + ' ' + email.body).toLowerCase();
      const isPromotional = promotionalKeywords.some(keyword => emailText.includes(keyword));
      
      if (isPromotional) {
        // Skip promotional emails
        continue;
      }

      const prompt = `You are analyzing an email to determine if it's related to a job application the user submitted.

IMPORTANT RULES:
1. ONLY classify as "interview", "rejection", or "follow-up" if this email is clearly a response to a job application
2. If this is a promotional email, advertisement, newsletter, or spam, return type "other" and isJobRelated: false
3. If this email is not related to any job application, return type "other" and isJobRelated: false
4. The email must be from a company/recruiter responding to an application, not a general job posting or advertisement

User's job applications (for reference):
${userApplications.map(app => `- ${app.jobTitle} at ${app.company}`).join('\n') || 'None found'}

Email Subject: ${email.subject}
Email From: ${email.from}
Email Body (first 800 chars): ${email.body.substring(0, 800)}

Return ONLY a JSON object with this exact structure:
{
  "type": "interview" or "rejection" or "follow-up" or "other",
  "company": "Company name if mentioned and related to a job application, otherwise empty string",
  "jobTitle": "Job title if mentioned and related to a job application, otherwise empty string",
  "importance": "high" or "medium" or "low",
  "isJobRelated": true or false
}

If the email is promotional, spam, or not job-related, set isJobRelated to false and type to "other".

Return ONLY the JSON, no other text.`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let classification = response.text().trim();
      
      // Extract JSON from response
      const jsonMatch = classification.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        classification = JSON.parse(jsonMatch[0]);
        
        // Only include if it's job-related
        if (classification.isJobRelated === true || 
            (classification.type !== 'other' && classification.type !== undefined)) {
          classified.push({
            ...email,
            type: classification.type || 'other',
            company: classification.company || '',
            jobTitle: classification.jobTitle || '',
            importance: classification.importance || 'medium',
            isJobRelated: true
          });
        }
        // Skip if not job-related
      }
    } catch (err) {
      console.error('Error classifying email:', err);
      // Skip emails that fail classification
    }
  }

  return classified;
}

// Save emails to user
async function saveEmailsToUser(userId, emails) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    if (!user.receivedEmails) user.receivedEmails = [];

    for (const email of emails) {
      // Check if email already exists
      const exists = user.receivedEmails.some(e => e.messageId === email.messageId);
      if (!exists) {
        user.receivedEmails.push({
          messageId: email.messageId,
          from: email.from,
          subject: email.subject,
          body: email.body.substring(0, 2000), // Limit body length
          date: email.date,
          type: email.type,
          company: email.company,
          jobTitle: email.jobTitle,
          importance: email.importance,
          isRead: false
        });
      }
    }

    user.lastEmailCheck = new Date();
    await user.save();
  } catch (error) {
    console.error('Error saving emails:', error);
  }
}

// --- ROUTES ---

// DEV MODE: In-memory user storage when MongoDB is not available
const devUsers = new Map();

// Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    
    // DEV MODE: Use in-memory storage if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      if (devUsers.has(email)) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      devUsers.set(email, { email, password: hashedPassword, name: name || '', id: Date.now().toString() });
      console.log(`[DEV MODE] User registered: ${email}`);
      return res.json({ message: "User created successfully (DEV MODE)" });
    }
    
    // Production: Use MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name: name || '' });
    res.json({ message: "User created successfully" });
  } catch (e) {
    console.error('Registration error:', e);
    if (e.code === 11000) {
      return res.status(400).json({ error: "Email already registered" });
    }
    if (e.name === 'MongoServerSelectionError' || e.message.includes('MongoServerSelectionError')) {
      return res.status(503).json({ 
        error: "Database connection failed. Please start MongoDB or configure MongoDB Atlas." 
      });
    }
    res.status(400).json({ error: e.message || "Registration failed. Please try again." });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    
    // DEV MODE: Use in-memory storage if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      const devUser = devUsers.get(email);
      if (!devUser) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      
      const isPasswordValid = await bcrypt.compare(password, devUser.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      
      const token = jwt.sign({ id: devUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      console.log(`[DEV MODE] User logged in: ${email}`);
      return res.json({ token, user: { email: devUser.email, name: devUser.name, _id: devUser.id } });
    }

    // Production: Use MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ 
      token, 
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (e) {
    console.error('Login error:', e);
    if (e.name === 'MongoServerSelectionError' || e.message.includes('MongoServerSelectionError')) {
      return res.status(503).json({ 
        error: "Database connection failed. Please start MongoDB or configure MongoDB Atlas." 
      });
    }
    res.status(500).json({ error: e.message || "Login failed. Please try again." });
  }
});

// Upload Resume
app.post('/api/upload/resume', verifyToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = path.join('uploads', req.file.filename);
    const activity = { jobTitle: 'Resume Uploaded', company: 'Profile Update', status: 'Uploaded', date: new Date() };
    
    // DEV MODE: Just return success if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      console.log(`[DEV MODE] Resume uploaded for user ${req.user.id}: ${filePath}`);
      return res.json({ 
        message: "Resume uploaded successfully (DEV MODE)", 
        path: filePath,
        activity,
        success: true 
      });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!user.documents) user.documents = {};
    user.documents.resume = filePath;
    
    if (!user.applications) user.applications = [];
    user.applications.push(activity);
    
    await user.save();
    
    res.json({ 
      message: "Resume uploaded successfully", 
      path: filePath,
      activity,
      success: true 
    });
  } catch (e) {
    console.error('Upload resume error:', e);
    if (e.message && e.message.includes('Only PDF')) {
      return res.status(400).json({ error: "Only PDF files are allowed." });
    }
    if (e.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File size too large. Maximum size is 10MB." });
    }
    res.status(500).json({ error: e.message || "Failed to upload resume. Please try again." });
  }
});

// Upload Avatar
app.post('/api/upload/avatar', verifyToken, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = path.join('uploads', req.file.filename);
    
    // DEV MODE: Just return success if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      console.log(`[DEV MODE] Avatar uploaded for user ${req.user.id}: ${filePath}`);
      return res.json({ 
        message: "Avatar uploaded successfully (DEV MODE)", 
        path: filePath,
        avatar: filePath,
        success: true 
      });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        try {
          fs.unlinkSync(oldAvatarPath);
        } catch (e) {
          console.error('Error deleting old avatar:', e);
        }
      }
    }
    
    user.avatar = filePath;
    await user.save();
    
    res.json({ 
      message: "Avatar uploaded successfully", 
      path: filePath,
      avatar: filePath,
      success: true 
    });
  } catch (e) {
    console.error('Upload avatar error:', e);
    if (e.message && e.message.includes('Only image')) {
      return res.status(400).json({ error: "Only image files are allowed." });
    }
    if (e.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File size too large. Maximum size is 5MB." });
    }
    res.status(500).json({ error: e.message || "Failed to upload avatar. Please try again." });
  }
});

// Upload Cover Letter
app.post('/api/upload/coverletter', verifyToken, upload.single('coverLetter'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = path.join('uploads', req.file.filename);
    const activity = { jobTitle: 'Cover Letter Uploaded', company: 'Profile Update', status: 'Uploaded', date: new Date() };
    
    // DEV MODE: Just return success if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      console.log(`[DEV MODE] Cover letter uploaded for user ${req.user.id}: ${filePath}`);
      return res.json({ 
        message: "Cover letter uploaded successfully (DEV MODE)", 
        path: filePath,
        activity,
        success: true 
      });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!user.documents) user.documents = {};
    user.documents.coverLetter = filePath;
    
    if (!user.applications) user.applications = [];
    user.applications.push(activity);
    
    await user.save();
    
    res.json({ 
      message: "Cover letter uploaded successfully", 
      path: filePath,
      activity,
      success: true 
    });
  } catch (e) {
    console.error('Upload cover letter error:', e);
    if (e.message && e.message.includes('Only PDF')) {
      return res.status(400).json({ error: "Only PDF files are allowed." });
    }
    if (e.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File size too large. Maximum size is 10MB." });
    }
    res.status(500).json({ error: e.message || "Failed to upload cover letter. Please try again." });
  }
});

// Error handler for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File size too large. Maximum size is 10MB." });
    }
    return res.status(400).json({ error: error.message });
  }
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

// Get Email Config
app.get('/api/config', verifyToken, async (req, res) => {
  try {
    // DEV MODE: Return empty config if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({ user: '', pass: '' });
    }
    const user = await User.findById(req.user.id).select('emailConfig');
    res.json({ 
      user: user.emailConfig?.user || '', 
      pass: user.emailConfig?.pass || '' 
    });
  } catch (error) {
    res.json({ user: '', pass: '' }); // Return empty on error
  }
});

// Update Email Config
app.post('/api/config', verifyToken, async (req, res) => {
  try {
    const { emailUser, emailPass } = req.body;
    // DEV MODE: Just return success if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      console.log(`[DEV MODE] Config updated for user ${req.user.id}`);
      return res.json({ message: "Config updated (DEV MODE)" });
    }
    await User.findByIdAndUpdate(req.user.id, { 
      'emailConfig.user': emailUser, 
      'emailConfig.pass': emailPass 
    });
    res.json({ message: "Config updated" });
  } catch (e) {
    res.json({ message: "Config updated (DEV MODE)" });
  }
});

// Analyze Job Text with AI
app.post('/api/analyze-jobs', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }
    
    if (!genAI) {
      console.error('[Analyze Jobs] Google Gemini not initialized. Check GEMINI_API_KEY in .env');
      return res.status(500).json({ 
        error: "Google Gemini API key not configured. Please add GEMINI_API_KEY to your .env file. Get a FREE key from https://aistudio.google.com/app/apikey" 
      });
    }
    
    const prompt = `Analyze the following text and extract all job postings. For each job found, return a JSON array with the following structure:
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "location": "Location (or 'Remote' if remote)",
    "salary": "Salary range if mentioned, otherwise 'Not specified'",
    "description": "Brief job description (2-3 sentences)",
    "requirements": ["requirement1", "requirement2"],
    "type": "Full-time/Part-time/Contract",
    "email": "Contact email if mentioned, otherwise null"
  }
]

If no jobs are found, return an empty array [].

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, just the JSON array.

Text to analyze:
${text.substring(0, 8000)}`;

    console.log('[Analyze Jobs] Sending request to Google Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const fullPrompt = `You are a job posting analyzer. Extract job information from text and return valid JSON only, no markdown formatting. Always return a JSON array, even if empty.

${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const responseText = response.text().trim();
    console.log('[Analyze Jobs] Received response from Google Gemini, length:', responseText.length);
    
    // Try to extract JSON from the response (handle markdown code blocks)
    let jsonText = responseText;
    if (responseText.includes('```json')) {
      jsonText = responseText.split('```json')[1].split('```')[0].trim();
    } else if (responseText.includes('```')) {
      jsonText = responseText.split('```')[1].split('```')[0].trim();
    }
    
    // Try to find JSON array in the text
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    let jobs;
    try {
      jobs = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[Analyze Jobs] JSON parse error:', parseError);
      console.error('[Analyze Jobs] Response text:', responseText.substring(0, 500));
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }
    
    if (!Array.isArray(jobs)) {
      console.error('[Analyze Jobs] Response is not an array:', typeof jobs);
      throw new Error("AI response is not a valid array");
    }
    
    if (jobs.length === 0) {
      return res.json([]);
    }
    
    // Add IDs and default values
    const jobsWithIds = jobs.map((job, index) => ({
      id: Date.now() + index,
      title: job.title || "Untitled Position",
      company: job.company || "Unknown Company",
      location: job.location || "Not specified",
      salary: job.salary || "Not specified",
      description: job.description || "",
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      type: job.type || "Full-time",
      email: job.email || null,
      bg: `https://images.unsplash.com/photo-${1550745165 + index}?q=80&w=1000`
    }));
    
    console.log('[Analyze Jobs] Successfully parsed', jobsWithIds.length, 'jobs');
    res.json(jobsWithIds);
  } catch (error) {
    console.error('[Analyze Jobs] Error:', error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to analyze job text";
    
    if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.response) {
      // OpenAI API error
      if (error.response.status === 401) {
        errorMessage = "Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env";
      } else if (error.response.status === 429) {
        errorMessage = "OpenAI API rate limit exceeded. Please try again later.";
      } else if (error.response.status === 500) {
        errorMessage = "OpenAI API server error. Please try again later.";
      } else {
        errorMessage = `OpenAI API error: ${error.response.statusText || error.message}`;
      }
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = "Cannot connect to OpenAI API. Please check your internet connection.";
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Get Jobs (Mock Data for "Discovery")
app.get('/api/jobs', (req, res) => {
  // DEV MODE: No auth required, always return mock data
  // In a real app, this comes from a scraper or DB
  const jobs = [
    { id: 1, title: "Frontend Dev", company: "TechCorp", location: "Remote", color: "bg-blue-500" },
    { id: 2, title: "Backend Engineer", company: "DataSystems", location: "New York", color: "bg-purple-500" },
    { id: 3, title: "Full Stack Dev", company: "StartupHub", location: "San Francisco", color: "bg-green-500" },
    { id: 4, title: "UI/UX Designer", company: "CreativeWorks", location: "Remote", color: "bg-pink-500" },
  ];
  res.json(jobs);
});

// Helper function to read cover letter content
async function getCoverLetterContent(user) {
  // Try to read from uploaded cover letter file (if it's a text file)
  if (user.documents?.coverLetter) {
    const coverLetterPath = path.join(__dirname, user.documents.coverLetter);
    try {
      if (fs.existsSync(coverLetterPath)) {
        const content = fs.readFileSync(coverLetterPath, 'utf-8');
        // If it's a PDF, we can't read it easily, so use fallback
        if (coverLetterPath.endsWith('.pdf')) {
          return getDefaultCoverLetter(user);
        }
        return content;
      }
    } catch (e) {
      console.error('Error reading cover letter file:', e);
    }
  }
  
  // Fallback to default cover letter
  return getDefaultCoverLetter(user);
}

function getDefaultCoverLetter(user) {
  // Try to read from COVER_LETTER_REVISED.md
  const coverLetterPath = path.join(__dirname, '..', 'COVER_LETTER_REVISED.md');
  try {
    if (fs.existsSync(coverLetterPath)) {
      let content = fs.readFileSync(coverLetterPath, 'utf-8');
      // Remove everything after the "---" separator (metadata section)
      if (content.includes('---')) {
        content = content.split('---')[0].trim();
      }
      // Remove markdown header and formatting
      content = content.replace(/^#.*$/gm, '').trim();
      // Replace name placeholder if needed
      content = content.replace(/Appiah Elliot Richard/g, user.name || 'Appiah Elliot Richard');
      return content;
    }
  } catch (e) {
    console.error('Error reading default cover letter:', e);
  }
  
  // Ultimate fallback
  return `Dear Hiring Manager,

I'm thrilled at the prospect of joining your team. My journey—from prototyping interactive web tools that empower users to mentoring the next generation of coders—has equipped me with the technical depth and creative edge to tackle challenging projects head-on.

I specialize in building intuitive, responsive digital experiences using modern technologies including React, Node.js, Express.js, MongoDB, Python, HTML, CSS, JavaScript, Vue.js, MATLAB, and Figma.

Thank you for considering my application.

Sincerely,
${user.name || 'Appiah Elliot Richard'}`;
}

// Apply (Send Email)
app.post('/api/apply', verifyToken, async (req, res) => {
  try {
    const { jobTitle, company, recruiterEmail, jobDescription } = req.body;
    
    // DEV MODE: Just log and return success
    if (mongoose.connection.readyState !== 1) {
      console.log(`[DEV MODE] Application sent for ${jobTitle} at ${company}`);
      return res.json({ message: "Application sent successfully (DEV MODE)" });
    }
    
    const user = await User.findById(req.user.id);
    if (!user.emailConfig?.user || !user.documents?.resume) {
      return res.status(400).json({ error: "Missing email config or resume" });
    }

    // Get cover letter content
    const coverLetterBody = await getCoverLetterContent(user);
    
    // Generate AI subject line
    let subject = `Application for ${jobTitle}`;
    if (genAI && jobTitle && company) {
      try {
        const subjectPrompt = `Generate a professional, concise email subject line for a job application. 
Job Title: ${jobTitle}
Company: ${company}

Return only the subject line, nothing else. Make it professional and attention-grabbing. Do NOT include the applicant's name.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const fullSubjectPrompt = `You are an expert at writing professional email subject lines. Return only the subject line text, no quotes or formatting.

${subjectPrompt}`;
        
        const result = await model.generateContent(fullSubjectPrompt);
        const response = await result.response;
        const generatedSubject = response.text().trim();
        // Remove quotes if present
        subject = generatedSubject.replace(/^["']|["']$/g, '');
      } catch (aiError) {
        console.error('Error generating subject line:', aiError);
        // Use default subject if AI fails
      }
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: user.emailConfig.user, pass: user.emailConfig.pass }
    });

    // Prepare resume attachment
    const resumePath = path.join(__dirname, user.documents.resume);
    const attachments = [];
    if (fs.existsSync(resumePath)) {
      attachments.push({ path: resumePath, filename: path.basename(resumePath) });
    }

    const mailOptions = {
      from: user.emailConfig.user,
      to: "appiahelliot1@gmail.com", // Always send to this email
      subject: subject,
      text: coverLetterBody,
      html: coverLetterBody.replace(/\n/g, '<br>'), // Simple HTML conversion
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] Application for ${jobTitle} at ${company} sent to appiahelliot1@gmail.com`);
    
    // Save to history
    if (!user.applications) user.applications = [];
    user.applications.push({ 
      jobTitle, 
      company, 
      status: 'Sent',
      date: new Date()
    });
    await user.save();
    
    res.json({ message: "Application sent successfully" });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ error: error.message || "Failed to send application" });
  }
});

app.get('/api/history', verifyToken, async (req, res) => {
  try {
    // DEV MODE: Return mock data if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        { jobTitle: "Frontend Developer", company: "TechCorp", status: "Sent", date: new Date() },
        { jobTitle: "Product Designer", company: "DesignStudio", status: "Viewed", date: new Date(Date.now() - 86400000) }
      ]);
    }
    const user = await User.findById(req.user.id);
    res.json(user.applications || []);
  } catch (e) {
    res.json([]); // Return empty array on error
  }
});

// Get User Profile
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    // DEV MODE: Return mock data if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        name: 'Elliot Appiah',
        jobTitle: 'Full stack dev',
        email: req.user.email || 'user@example.com',
        avatar: null,
        documents: {
          resume: null,
          coverLetter: null
        }
      });
    }
    const user = await User.findById(req.user.id).select('name jobTitle email documents');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      name: user.name || 'Elliot Appiah',
      jobTitle: user.jobTitle || 'Full stack dev',
      email: user.email,
      avatar: user.avatar || null,
      documents: {
        resume: user.documents?.resume || null,
        coverLetter: user.documents?.coverLetter || null
      }
    });
  } catch (e) {
    console.error('Get profile error:', e);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update User Profile (support both PUT and POST for compatibility)
const updateProfileHandler = async (req, res) => {
  try {
    console.log('[PUT /api/user/profile] Request received:', { userId: req.user?.id, body: req.body });
    const { name, jobTitle, avatar } = req.body;
    
    // DEV MODE: Just return success if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      console.log(`[DEV MODE] Profile updated for user ${req.user.id}: name=${name}, jobTitle=${jobTitle}`);
      return res.json({ message: "Profile updated successfully (DEV MODE)" });
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (avatar !== undefined) updateData.avatar = avatar;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('name jobTitle email');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ 
      message: "Profile updated successfully",
      user: {
        name: user.name || '',
        jobTitle: user.jobTitle || '',
        email: user.email,
        avatar: user.avatar || null
      }
    });
  } catch (e) {
    console.error('Update profile error:', e);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

app.put('/api/user/profile', verifyToken, updateProfileHandler);
app.post('/api/user/profile', verifyToken, updateProfileHandler);

// Check for new emails
app.post('/api/emails/check', verifyToken, async (req, res) => {
  try {
    const result = await checkEmailsForUser(req.user.id);
    if (result.success) {
      res.json({ 
        message: `Found ${result.count} new email(s)`,
        count: result.count,
        emails: result.emails 
      });
    } else {
      res.status(400).json({ error: result.error || 'Failed to check emails' });
    }
  } catch (error) {
    console.error('Check emails error:', error);
    res.status(500).json({ error: error.message || 'Failed to check emails' });
  }
});

// Get received emails - only job-related ones
app.get('/api/emails', verifyToken, async (req, res) => {
  try {
    // DEV MODE: Return mock data if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        {
          messageId: 'mock-1',
          from: 'recruiter@company.com',
          subject: 'Interview Invitation - Software Engineer Position',
          body: 'We would like to invite you for an interview...',
          date: new Date(),
          type: 'interview',
          company: 'Tech Company',
          jobTitle: 'Software Engineer',
          importance: 'high',
          isRead: false
        }
      ]);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let emails = user.receivedEmails || [];
    
    // Filter out promotional/advertisement emails
    const promotionalKeywords = ['unsubscribe', 'marketing', 'newsletter', 'promotion', 'sale', 'discount'];
    emails = emails.filter(email => {
      const emailText = (email.subject + ' ' + email.body).toLowerCase();
      const isPromotional = promotionalKeywords.some(keyword => emailText.includes(keyword));
      // Only keep if it's a job-related type (interview, rejection, follow-up) or explicitly marked as job-related
      return !isPromotional && (email.type !== 'other' || email.isJobRelated === true);
    });
    
    // Sort by date, newest first
    emails.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(emails);
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch emails' });
  }
});

// Mark email as read
app.put('/api/emails/:messageId/read', verifyToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // DEV MODE: Just return success
    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: "Email marked as read (DEV MODE)" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const email = user.receivedEmails.find(e => e.messageId === messageId);
    if (email) {
      email.isRead = true;
      await user.save();
      res.json({ message: "Email marked as read" });
    } else {
      res.status(404).json({ error: "Email not found" });
    }
  } catch (error) {
    console.error('Mark email read error:', error);
    res.status(500).json({ error: error.message || 'Failed to mark email as read' });
  }
});

// Admin endpoint to list all users (for development)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}).select('email name applications').lean();
    const usersList = users.map(user => ({
      email: user.email,
      name: user.name || 'Not set',
      applicationsCount: user.applications?.length || 0,
      recentApplications: user.applications?.slice(-3).map(app => ({
        jobTitle: app.jobTitle,
        company: app.company,
        status: app.status
      })) || []
    }));
    res.json({ 
      count: usersList.length,
      users: usersList 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  if (mongoose.connection.readyState !== 1) {
    console.log(`\n⚠️  MongoDB not connected. Database operations may fail.`);
    console.log(`   To fix: Configure MongoDB Atlas or install MongoDB locally`);
    console.log(`   See: backend/SETUP_INSTRUCTIONS.md\n`);
  }
});
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  jobTitle: String,
  avatar: String, // path to avatar image file
  documents: {
    resume: String, // path to file
    coverLetter: String // path to file
  },
  emailConfig: {
    user: String,
    pass: String // Gmail App Password
  },
  preferences: {
    keywords: [String],
    locations: [String],
    remote: Boolean
  },
  applications: [{
    jobTitle: String,
    company: String,
    status: { type: String, default: 'Sent' },
    date: { type: Date, default: Date.now }
  }],
  receivedEmails: [{
    messageId: { type: String, unique: true },
    from: String,
    subject: String,
    body: String,
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['interview', 'rejection', 'follow-up', 'other'], default: 'other' },
    company: String,
    jobTitle: String,
    isRead: { type: Boolean, default: false },
    importance: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
  }],
  lastEmailCheck: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
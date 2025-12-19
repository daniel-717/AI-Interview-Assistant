const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  role: { type: String, required: true },
  questionCount: { type: Number, required: true },
  questions: [{
    questionText: String,
    userAnswer: { type: String, default: "" },
    feedback: {
      score: Number,
      improvement: String,
      suggestedAnswer: String
    },
    isAnswered: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', InterviewSchema);
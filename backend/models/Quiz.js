const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    questions: [{
        questionText: String,
        options: [String],
        correctAnswerIndex: Number, 
        explanation: String
    }],
    userAnswers: [Number],
    score: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
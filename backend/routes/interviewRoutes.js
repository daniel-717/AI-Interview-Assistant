const express = require('express');
const router = express.Router();
const {startInterview, submitAnswer, createQuiz, submitQuiz} = require('../controllers/interviewController');

router.post('/generate', startInterview);
router.post('/submit-answer', submitAnswer);
router.post('/generate-quiz', createQuiz);
router.post('/submit', submitQuiz);

module.exports = router;
const Interview = require('../models/Interview');
const { generateQuestions, evaluateAnswer, generateQuiz } = require('../services/aiService');
const Quiz = require('../models/Quiz');

const startInterview = async (req, res) => {
  console.log("Starting interview with data:", req.body);
  try {
    const { role, count } = req.body;

    if (!role || count < 1 || count > 10) {
      return res.status(400).json({ message: "Invalid role or question count (1-10)." });
    }

    const aiQuestions = await generateQuestions(role, count);

    // Format for MongoDB
    const formattedQuestions = aiQuestions.map(q => ({
      questionText: q.question
    }));

    const newInterview = new Interview({
      role,
      questionCount: count,
      questions: formattedQuestions
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, userAnswer, isSkipped } = req.body;

    const interview = await Interview.findById(interviewId);
    const question = interview.questions[questionIndex];

    let evaluation = {
      score: 0,
      feedback: "Question skipped. No feedback provided.",
      suggestedAnswer: ""
    };

    // Only call if the user actually answered
    if (!isSkipped) {
      evaluation = await evaluateAnswer(question.questionText, userAnswer);
    } else {
      // If skipped, just get the suggested answer without scoring
      const aiResponse = await evaluateAnswer(question.questionText, "User skipped this question.");
      evaluation.suggestedAnswer = aiResponse.suggestedAnswer;
      evaluation.feedback = "You skipped this question. Review the suggested answer below to learn.";
    }

    // Update DB
    question.userAnswer = isSkipped ? "SKIPPED" : userAnswer;
    question.feedback = evaluation;
    question.isAnswered = true;

    await interview.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 1. Create and Save a new Quiz
const createQuiz = async (req, res) => {
    console.log("Creating quiz with data:", req.body);
    try {
        const { topic, count } = req.body;
        const generatedQuestions = await generateQuiz(topic, count);

        const newQuiz = new Quiz({
            topic,
            totalQuestions: count,
            questions: generatedQuestions
        });

        await newQuiz.save();
        // Return quiz ID and questions 
        const clientQuestions = newQuiz.questions.map(q => ({
            questionText: q.questionText,
            options: q.options
        }));

        res.status(201).json({ quizId: newQuiz._id, questions: clientQuestions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Submit Final Answers & Calculate Score
const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body; // 'answers' is an array of indices
        const quiz = await Quiz.findById(quizId);

        let finalScore = 0;
        quiz.questions.forEach((q, index) => {
            if (q.correctAnswerIndex === answers[index]) {
                finalScore++;
            }
        });

        quiz.userAnswers = answers;
        quiz.score = finalScore;
        quiz.isCompleted = true;
        await quiz.save();

        res.json({ 
            score: finalScore, 
            total: quiz.totalQuestions,
            review: quiz.questions // Send full details for the final dashboard
        });
    } catch (error) {
        res.status(500).json({ message: "Submission failed." });
    }
};

module.exports = {
    startInterview,
    submitAnswer,
    createQuiz,
    submitQuiz
};
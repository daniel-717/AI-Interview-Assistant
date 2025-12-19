const Groq = require("groq-sdk");
require('dotenv').config();


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateQuestions = async (role, count) => {
    const prompt = `
        Task: Generate ${count} technical interview questions for a ${role} position.
        Format: Return a JSON array of objects. Each object must have "id" (number) and "question" (string).
        Example: [{"id": 1, "question": "Explain the virtual DOM in React."}]
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that outputs only valid JSON arrays."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile", 
            response_format: { type: "json_object" }
        });

        const content = chatCompletion.choices[0].message.content;
        const parsedData = JSON.parse(content);

        // Safety: If AI returns { "questions": [...] }, extract the array
        return Array.isArray(parsedData) ? parsedData : (parsedData.questions || parsedData);
        
    } catch (error) {
        console.error("Groq Generation Error:", error);
        throw new Error("AI failed to generate questions. Check Groq API key.");
    }
};


const evaluateAnswer = async (questionText, userAnswer) => {
    const prompt = `
        Question: ${questionText}
        User Answer: ${userAnswer}

        Act as an interviewer. Evaluate the answer.
        Format: Return strictly JSON with:
        - "score": Number (1-10)
        - "feedback": String (2-3 sentences on what was good/missing)
        - "suggestedAnswer": String (A high-quality model answer)
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Groq Evaluation Error:", error);
        return {
            score: 0,
            feedback: "Evaluation failed. The AI was unable to process this answer.",
            suggestedAnswer: "Refer to official documentation for the best answer."
        };
    }
};

const generateQuiz = async (topic, count) => {
    const prompt = `
        Task: Generate a technical quiz on the topic: "${topic}".
        Requirement: Generate ${count} unique multiple-choice questions.
        Format: Return ONLY a JSON object with this structure:
        {
          "quiz": [
            {
              "questionText": "...",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswerIndex": 0,
              "explanation": "small explanation of why this is correct."
            }
          ]
        }
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const data = JSON.parse(chatCompletion.choices[0].message.content);
        return data.quiz; 
    } catch (error) {
        console.error("Quiz Generation Error:", error);
        throw new Error("Failed to generate quiz questions.");
    }
};

module.exports = { generateQuestions, evaluateAnswer, generateQuiz };
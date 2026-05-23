
const groq = require("../services/groqAIServices");

exports.predictText = async (req, res) => {
  try {
    const { text, userTone } = req.body;

    const prompt = `
You are a smart typing assistant.

User tone: ${userTone}
User is typing: "${text}"

Return ONLY a valid JSON array.

Example:
["tomorrow", "at 5pm", "sounds good"]
`;

    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const rawText = result.choices[0].message.content;

    let suggestions = [];

    try {
      suggestions = JSON.parse(rawText);
    } catch (e) {
      console.log("JSON parse failed, raw output:", rawText);
      suggestions = [];
    }

    return res.json({ suggestions });
  } catch (err) {
    console.error("Prediction failed:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};

// exports.smartReplies = async (req, res) => {
//   try {
//     const { incomingMessage, userTone } = req.body;

//     const prompt = `
// You are a smart chat reply assistant.

// User tone: ${userTone}
// Incoming message: "${incomingMessage}"

// Return ONLY a valid JSON array of 3 replies.
// Rules:
// - Max 10 words each
// - Human sounding
// - Natural replies
// - No numbering
// - No explanation

// Example:
// ["Yes, I’ll be there", "Running late", "Can we reschedule"]
// `;

//     const model = ai.getGenerativeModel({
//     model: "gemini-pro",
//     });

//     // generate content
//     const result = await model.generateContent(prompt);

//     // extract response text
//     const rawText = result.response.text();

//     let replies = [];

//     try {
//       replies = JSON.parse(rawText);
//     } catch {
//       replies = rawText
//         .replace(/```json|```/g, "")
//         .trim()
//         .split("\n")
//         .map((s) => s.replace(/[-*]/g, "").trim())
//         .filter(Boolean);
//     }

//     return res.json({
//       success: true,
//       replies,
//     });

//   } catch (err) {
//     console.error("Smart reply failed:", err);

//     return res.status(500).json({
//       success: false,
//       error: "Smart reply failed",
//     });
//   }
// };
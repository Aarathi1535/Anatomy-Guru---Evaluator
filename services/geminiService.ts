
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationReport } from "../types";

const parseDataUrl = (dataUrl: string) => {
  try {
    const parts = dataUrl.split(',');
    if (parts.length !== 2) return null;
    const data = parts[1];
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    return { inlineData: { data, mimeType } };
  } catch (err) {
    return null;
  }
};

export const evaluateAnswerSheet = async (
  qpImages: string[],
  keyImages: string[],
  studentImages: string[]
): Promise<EvaluationReport> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = "gemini-3-pro-preview";

  const parts: any[] = [
    {
      text: `ACT AS AN UNCOMPROMISING, ELITE MEDICAL ACADEMIC EXAMINER. 

YOUR OBJECTIVE: Identify student incompetence through brutal, high-fidelity clinical auditing.

### THE RIGOR STANDARD:
- **Zero Generosity**: Marks are NOT a gift. They must be extracted through clinical excellence. If an answer is "mostly right" but lacks medical precision, it is WRONG.
- **The "Keyword" Failure**: In medicine, naming a procedure (e.g., "MTP") without explaining its clinical mechanism, legal limitations (IPC sections), or complications is worth ZERO marks. Do not award marks for a vocabulary list.
- **Theoretical Density**: For 5/10 mark questions, you expect structured, paragraph-based medical reasoning. Bulleted lists are for laypeople, not medical students. Penalize poor structure by 60%.
- **Contextual Accuracy**: If the answer key specifies "Vagal Inhibition" and the student says "heart stopped", award 0. "Heart stopped" is a result, not a clinical mechanism.

### AUDIT PROTOCOLS:
1. **DYNAMIC MAX SCORE**: Calculate the total marks by summing weights from the Question Paper. 
2. **UNATTEMPTED SCAN**: You must explicitly map Question Paper numbers to the Student Sheet. If a question is missing from the student sheet, it is "Not attempted" (0 marks).
3. **CLINICAL VAGUENESS**: Any answer that sounds like a common-sense explanation rather than a medical professional's analysis gets 0.
4. **FORENSIC PRECISION**: Especially for FMT, legal sections and exact physiological mechanisms are mandatory.

### OUTPUT:
- Return ONLY JSON.
- Feedback must be critical. Point out where the student is being "superficial" or "dangerous" in their lack of knowledge.`
    }
  ];

  const addFiles = (urls: string[], label: string) => {
    urls.forEach((url, i) => {
      const part = parseDataUrl(url);
      if (part) {
        parts.push({ text: `DOCUMENT: ${label} (Page ${i + 1})` });
        parts.push(part);
      }
    });
  };

  addFiles(qpImages, "Question Paper");
  addFiles(keyImages, "Expert Answer Key");
  addFiles(studentImages, "Student Handwritten Answer Sheet");

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        temperature: 0,
        seed: 42,
        thinkingConfig: { thinkingBudget: 24000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentInfo: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                rollNumber: { type: Type.STRING },
                subject: { type: Type.STRING },
                class: { type: Type.STRING },
                examName: { type: Type.STRING },
                date: { type: Type.STRING },
              },
              required: ["name", "subject"]
            },
            grades: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionNumber: { type: Type.STRING },
                  studentAnswer: { type: Type.STRING },
                  correctAnswer: { type: Type.STRING },
                  marksObtained: { type: Type.NUMBER },
                  totalMarks: { type: Type.NUMBER },
                  feedback: { type: Type.STRING },
                },
                required: ["questionNumber", "marksObtained", "totalMarks"]
              }
            },
            totalScore: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            percentage: { type: Type.NUMBER },
            generalFeedback: { type: Type.STRING },
          },
          required: ["studentInfo", "grades", "totalScore", "maxScore", "percentage", "generalFeedback"]
        }
      }
    });

    if (!response.text) throw new Error("Empty AI response.");
    const data = JSON.parse(response.text.trim());
    
    // Safety arithmetic check
    const calculatedTotal = data.grades.reduce((acc: number, g: any) => acc + (g.marksObtained || 0), 0);
    data.totalScore = calculatedTotal;
    data.percentage = data.maxScore > 0 ? (calculatedTotal / data.maxScore) * 100 : 0;

    return data;
  } catch (error: any) {
    console.error("Gemini Audit Failure:", error);
    throw error;
  }
};

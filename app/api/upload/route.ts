// app/protected/action.ts
"use server";
import pdfParse from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function handleForm(formData: FormData) {
  const question = formData.get("question") as string;
  const file = formData.get("file") as File;

  if (!question && !file) {
    throw new Error("Please provide a question or upload a file.");
  }

  let pdfText = "";
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer()); // This reads uploaded file
    const parsed = await pdfParse(buffer); // Parses buffer
    pdfText = parsed.text;
  }

  const prompt = `
    ${pdfText ? `PDF Content:\n${pdfText}` : ""}
    ${question ? `\n\nQuestion:\n${question}` : ""}
  `;

  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt.trim() },
    ],
  });

  console.log("Answer:", response.choices[0].message.content);
}

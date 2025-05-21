"use server"
import OpenAI from "openai";
import pdfParse from 'pdf-parse';
import * as  dotenv from 'dotenv'

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export async function handleForm(formData: FormData) {
  const question = formData.get('question');
  const file = formData.get('file') as File | null;

    if (!question && !file) {
    throw new Error('Please provide a question or upload a file.');
  }

  let pdfText = '';

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(buffer);
    const parsed = await pdfParse(buffer);
    pdfText = parsed.text;
  }
  console.log(pdfText)

  const prompt = `
    ${pdfText ? `PDF Content:\n${pdfText}` : ''}
    ${question ? `\n\nQuestion:\n${question}` : ''}
  `;

  console.log("Server received question:", question);
  console.log("PDF content:", pdfText.slice(0, 300)); // preview content

  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: prompt.trim(),
        },
    ],
});

console.log(response.choices[0].message.content);
  // You can save it to DB or process here
}
"use server";

// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse.js';
import OpenAI from "openai";
import { supabase } from '../../lib/supabase-server';
import path from 'path';
import fs from 'fs'


const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function handleForm(formData: FormData) {
  const question = formData.get("question") as string;
  const file = formData.get("file") as File;
    const userId = formData.get("user_id") as string; // Pass this from client


  if (!question && !file) {
    throw new Error("Please provide a question or upload a file.");
  }

  let pdfText = "";
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer()); // This reads uploaded file
    const parsed = await pdf(buffer); // Parses buffer
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

    const answer = response.choices[0].message.content;


  console.log("Answer:", response.choices[0].message.content);
  const { error } = await supabase.from("chat_history").insert([
    {
      user_id: userId,
      question: question || "[file only]",
      answer,
    },
  ]);

   const logPath = path.join(process.cwd(), 'public', 'chat-log.txt');
  const logContent = `\n\n[${new Date().toISOString()}]\nUser: ${question}\nAI: ${answer}\n`;

  fs.appendFileSync(logPath, logContent, 'utf-8');


  if (error) {
    console.error("Error saving chat:", error);
    throw new Error("Failed to save chat history.");
  }

  return { answer }; // Optional: return for client UI
}














// "use server"
// import OpenAI from "openai";
// // import pdfParse from 'pdf-parse';
// import * as  dotenv from 'dotenv'

// dotenv.config();

// const openai = new OpenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });

// // export async function handleForm(formData: FormData) {
// //   const question = formData.get('question');
// //   const file = formData.get('file') as File | null;

// //     if (!question && !file) {
// //     throw new Error('Please provide a question or upload a file.');
// //   }

// //   let pdfText = '';

// //   if (file && file.size > 0) {
// //     const buffer = Buffer.from(await file.arrayBuffer());
// //     console.log(buffer);
// //     const parsed = await pdfParse(buffer);
// //     pdfText = parsed.text;
// //   }
// //   console.log(pdfText)

// //   const prompt = `
// //     ${pdfText ? `PDF Content:\n${pdfText}` : ''}
// //     ${question ? `\n\nQuestion:\n${question}` : ''}
// //   `;

// //   console.log("Server received question:", question);
// //   console.log("PDF content:", pdfText.slice(0, 300)); // preview content

// //   const response = await openai.chat.completions.create({
// //     model: "gemini-2.0-flash",
// //     messages: [
// //         { role: "system", content: "You are a helpful assistant." },
// //         {
// //             role: "user",
// //             content: prompt.trim(),
// //         },
// //     ],
// // });

// // console.log(response.choices[0].message.content);
// //   // You can save it to DB or process here
// // }


// export async function handleForm(formData: FormData) {
//   const question = formData.get('question')?.toString() || '';
//   const file = formData.get('file') as File | null;
//   console.log(file)

//   if (!question && (!file || file.size === 0)) {
//     throw new Error('Please provide a question or upload a PDF.');
//   }

//   let pdfText = '';
//   if (file && file.size > 0) {
//     // dynamic import only on server at runtime
//     const { default: pdfParse } = await import('pdf-parse');
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const parsed = await pdfParse(buffer);
//     pdfText = parsed.text;
//   }

//   const prompt = [pdfText && `PDF Content:\n${pdfText}`, question && `Question:\n${question}`]
//     .filter(Boolean)
//     .join('\n\n');

//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: prompt },
//     ],
//   });

//   console.log(response.choices[0].message.content);
// }

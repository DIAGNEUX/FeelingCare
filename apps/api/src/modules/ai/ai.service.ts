// import { Injectable } from '@nestjs/common';
// import OpenAI from 'openai';
// import { buildSystemPrompt } from './prompts/system.prompt';

// @Injectable()
// export class AiService {
//   private readonly openai: OpenAI;

//   constructor() {
//     this.openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });
//   }

//   async generateReply(messages: any[], emotionName?: string | null) {
//     const systemPrompt = buildSystemPrompt(emotionName); // ✅ FIX

//     const completion = await this.openai.chat.completions.create({
//       model: 'gpt-4o-mini',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         ...messages,
//       ],
//     });

//     return completion.choices[0].message.content ?? 'Je suis là...';
//   }
// }
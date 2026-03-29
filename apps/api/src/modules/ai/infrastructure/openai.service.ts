import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(messages: any[], options?: any) {
    return this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      ...options,
    });
  }

  async chatStream(messages: any[], options?: any) {
    return this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      ...options,
    });
  }
}
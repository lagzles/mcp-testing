import { Anthropic } from '@anthropic-ai/sdk';
import { config } from './config.js';
import { z } from 'zod';

// Valid Claude models as of July 2025
const VALID_CLAUDE_MODELS = [
    "claude-3-5-sonnet-20241022",
] as const;

const ResponseSchema = z.object({
  risk_assessment: z.number().min(1).max(10),
  recommended_actions: z.array(z.string()),
  estimated_resolution_days: z.number().min(0),
  required_roles: z.array(z.string())
});

export class MCPClaudeProcessor {
  private anthropic: Anthropic;
  constructor() {

    this.anthropic = new Anthropic({
      apiKey: config.ANTHROPIC_API_KEY
    });
  }

  async process(payload: any) {
    const prompt = `
      Construction Issue Analysis:
      Title: ${payload.instructions.user.title}
      Priority: ${payload.instructions.user.priority}
      Description: ${payload.instructions.user.description}

      Respond with:
      1. Risk assessment (1-10)
      2. Recommended actions
      3. Estimated resolution time (days)
      4. Required team roles

      Format as JSON matching this schema:
      ${JSON.stringify(ResponseSchema.shape)}
    `;

    const response = await this.anthropic.messages.create({
      model:  "claude-3-5-sonnet-20241022",// payload.model.name,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const content = typeof response.content === 'string'
      ? response.content
      : (Array.isArray(response.content) && 'text' in response.content[0])
        ? (response.content[0] as { text: string }).text
        : JSON.stringify(response.content);
    const jsonMatch = content.match(/\{[\s\S]*\}/)?.[0] || content;
    
    try {
      return ResponseSchema.parse(JSON.parse(jsonMatch));
    } catch (err) {
      throw new Error(`Failed to validate response: ${err}`);
    }
  }
}
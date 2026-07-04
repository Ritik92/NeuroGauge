import OpenAI from 'openai'

// Lazily instantiate so a missing key doesn't crash module import / build.
let client: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return client
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

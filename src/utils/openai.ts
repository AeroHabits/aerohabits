import { supabase } from "@/integrations/supabase/client";

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

async function getOpenAIKey() {
  const { data, error } = await supabase.functions.invoke('get-openai-key');
  if (error) throw error;
  return data.key;
}

export async function enhanceToSmartGoal(goal: string): Promise<string> {
  const apiKey = await getOpenAIKey();
  
  const response = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a goal-setting expert. Convert user goals into SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). Be concise.'
        },
        {
          role: 'user',
          content: `Convert this goal into a SMART goal: "${goal}"`
        }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function suggestCategory(goal: string): Promise<string> {
  const apiKey = await getOpenAIKey();

  const response = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a habit categorization expert. Categorize habits into one of these categories: Health & Fitness, Self Mastery, Career Growth, Relationships, Personal Development, Creativity, or Learning. Respond with just the category name.'
        },
        {
          role: 'user',
          content: `Categorize this habit: "${goal}"`
        }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
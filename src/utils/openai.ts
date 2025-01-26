import { supabase } from "@/integrations/supabase/client";

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

async function getOpenAIKey() {
  try {
    const { data, error } = await supabase.functions.invoke('get-openai-key');
    
    if (error) {
      console.error('Failed to get OpenAI key:', error);
      throw new Error('Failed to get OpenAI key: ' + error.message);
    }
    
    if (!data?.key) {
      console.error('OpenAI key not found in response');
      throw new Error('OpenAI key not found in response');
    }
    
    // Validate key format (should start with 'sk-')
    if (!data.key.startsWith('sk-')) {
      console.error('Invalid OpenAI key format');
      throw new Error('Invalid OpenAI key format - should start with sk-');
    }
    
    return data.key;
  } catch (error) {
    console.error('Error getting OpenAI key:', error);
    throw new Error('Failed to get OpenAI key: ' + error.message);
  }
}

export async function enhanceToSmartGoal(goal: string): Promise<string> {
  try {
    const apiKey = await getOpenAIKey();
    console.log('Making OpenAI API request for goal enhancement...');
    
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that converts goals into SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals.'
          },
          {
            role: 'user',
            content: `Please convert this goal into a SMART goal: ${goal}`
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error enhancing goal:', error);
    throw new Error('Failed to enhance goal: ' + (error instanceof Error ? error.message : String(error)));
  }
}

export async function suggestCategory(goal: string): Promise<string> {
  try {
    const apiKey = await getOpenAIKey();
    console.log('Making OpenAI API request for category suggestion...');

    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that categorizes habits into one of these categories: Health & Fitness, Learning, Self Mastery, Career, Relationships, or Other. Respond with just the category name.'
          },
          {
            role: 'user',
            content: `Please categorize this habit: ${goal}`
          }
        ],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error suggesting category:', error);
    throw new Error('Failed to suggest category: ' + (error instanceof Error ? error.message : String(error)));
  }
}
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const key = Deno.env.get('OPENAI_API_KEY')
    
    if (!key) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not found' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
          } 
        }
      )
    }

    return new Response(
      JSON.stringify({ key }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
        } 
      }
    )
  }
})
import { serve } from "https://deno.fresh.dev/server.ts"

serve(async (req) => {
  const key = Deno.env.get('OPENAI_API_KEY')
  
  if (!key) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not found' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ key }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
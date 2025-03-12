
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept, stripe-version, stripe-signature',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Helper to handle CORS preflight requests
export const handleCORS = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Helper to format error responses consistently
export const formatErrorResponse = (error: any, status = 400) => {
  console.error('Error:', error);
  
  const message = error?.message || 'An unknown error occurred';
  const code = error?.code || 'unknown_error';
  
  return new Response(
    JSON.stringify({ 
      error: { message, code },
      success: false
    }),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      } 
    }
  );
};

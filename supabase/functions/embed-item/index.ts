import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || ''
const EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

async function hashText(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function embed(text: string): Promise<number[]> {
  const response = await fetch(EMBED_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini embedding request failed: ${errText}`)
  }

  const data = await response.json()
  return data.embedding.values
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { itemId } = await req.json()
    if (!itemId) {
      throw new Error('Missing itemId')
    }

    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('id, name, description, category, location, embedding_input_hash')
      .eq('id', itemId)
      .single()

    if (fetchError || !item) {
      throw new Error(fetchError?.message || 'Item not found')
    }

    const inputText = [item.name, item.description, item.category, item.location]
      .filter(Boolean)
      .join(' ')
    const inputHash = await hashText(inputText)

    if (inputHash === item.embedding_input_hash) {
      return new Response(JSON.stringify({ skipped: true, reason: 'text unchanged' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const embedding = await embed(inputText)

    const { error: updateError } = await supabase
      .from('items')
      .update({
        embedding,
        embedding_input_hash: inputHash,
        embedding_updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)

    if (updateError) {
      throw new Error(updateError.message)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('embed-item error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

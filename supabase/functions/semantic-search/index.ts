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

function normalizeQuery(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

async function hashText(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function embedQuery(text: string): Promise<number[]> {
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
    throw new Error(`Gemini embedding request failed: ${await response.text()}`)
  }

  const data = await response.json()
  return data.embedding.values
}

async function getQueryEmbedding(query: string): Promise<number[]> {
  const normalized = normalizeQuery(query)
  const hash = await hashText(normalized)

  const { data: cached } = await supabase
    .from('search_query_cache')
    .select('embedding')
    .eq('query_hash', hash)
    .maybeSingle()

  if (cached) {
    return cached.embedding as number[]
  }

  const embedding = await embedQuery(normalized)

  await supabase
    .from('search_query_cache')
    .upsert({ query_hash: hash, query_text: normalized, embedding })

  return embedding
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { query, category, minPrice, maxPrice } = await req.json()
    if (!query || typeof query !== 'string') {
      throw new Error('Missing query')
    }

    let embedding: number[] | null = null
    try {
      embedding = await getQueryEmbedding(query)
    } catch (embedError) {
      console.error('Embedding failed, falling back to keyword-only search:', embedError)
    }

    const { data, error } = await supabase.rpc('search_items', {
      query_embedding: embedding,
      query_text: query,
      p_category: category ?? null,
      p_min_price: minPrice ?? null,
      p_max_price: maxPrice ?? null,
      match_count: 4,
    })

    if (error) {
      throw new Error(error.message)
    }

    return new Response(JSON.stringify({ results: data || [], semantic: embedding !== null }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('semantic-search error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

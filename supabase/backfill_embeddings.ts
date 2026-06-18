import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}
if (!geminiApiKey) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiApiKey}`;

function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
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
  });

  if (!response.ok) {
    throw new Error(`Gemini embedding request failed: ${await response.text()}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

async function backfill() {
  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, description, category, location, embedding_input_hash');

  if (error) throw error;
  if (!items || items.length === 0) {
    console.log('No items found.');
    return;
  }

  console.log(`Found ${items.length} items. Embedding...`);

  for (const item of items) {
    const inputText = [item.name, item.description, item.category, item.location]
      .filter(Boolean)
      .join(' ');
    const inputHash = hashText(inputText);

    if (inputHash === item.embedding_input_hash) {
      console.log(`- ${item.name}: skipped (unchanged)`);
      continue;
    }

    try {
      const embedding = await embed(inputText);
      const { error: updateError } = await supabase
        .from('items')
        .update({
          embedding,
          embedding_input_hash: inputHash,
          embedding_updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (updateError) throw updateError;
      console.log(`- ${item.name}: embedded`);
    } catch (err) {
      console.error(`- ${item.name}: failed`, err);
    }
  }

  console.log('Backfill complete.');
}

backfill();

/*
  Semantic search for items.

  Adds pgvector-based embeddings alongside Postgres full-text search, and a
  single SQL function that fuses both rankings (Reciprocal Rank Fusion) so
  search understands intent ("I want to go skiing") without losing exact
  keyword matches ("Tesla").
*/

create extension if not exists vector;

alter table items
  add column embedding vector(768),
  add column embedding_input_hash text,
  add column embedding_updated_at timestamptz,
  add column search_vector tsvector
    generated always as (
      to_tsvector('english',
        coalesce(name, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        coalesce(category, '') || ' ' ||
        coalesce(location, '')
      )
    ) stored;

create index items_search_vector_idx on items using gin (search_vector);
create index items_embedding_idx on items using hnsw (embedding vector_cosine_ops);

-- Caches query embeddings so repeat/demo queries skip the embedding API call.
create table search_query_cache (
  query_hash text primary key,
  query_text text not null,
  embedding vector(768) not null,
  created_at timestamptz default now()
);

alter table search_query_cache ENABLE ROW LEVEL SECURITY;

-- Edge Functions call this table via the service role key, which bypasses
-- RLS — these policies only matter if it's ever queried with a user JWT.
create policy "Query cache is readable by everyone"
  on search_query_cache for select
  using (true);

create or replace function search_items(
  query_embedding vector(768) default null,
  query_text text default null,
  p_category text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  match_count int default 20
)
returns setof items as $$
  with vector_ranked as (
    select id, row_number() over (order by embedding <=> query_embedding) as rank
    from items
    where query_embedding is not null
      and embedding is not null
      and (p_category is null or category = p_category)
      and (p_min_price is null or price_per_day >= p_min_price)
      and (p_max_price is null or price_per_day <= p_max_price)
    order by embedding <=> query_embedding
    limit 50
  ),
  keyword_ranked as (
    select id, row_number() over (
      order by ts_rank_cd(search_vector, websearch_to_tsquery('english', query_text)) desc
    ) as rank
    from items
    where search_vector @@ websearch_to_tsquery('english', query_text)
      and (p_category is null or category = p_category)
      and (p_min_price is null or price_per_day >= p_min_price)
      and (p_max_price is null or price_per_day <= p_max_price)
    limit 50
  ),
  fused as (
    select coalesce(v.id, k.id) as id,
           (1.0 / (60 + coalesce(v.rank, 1000))) + (1.0 / (60 + coalesce(k.rank, 1000))) as score
    from vector_ranked v
    full outer join keyword_ranked k on v.id = k.id
  )
  select items.* from items
  join fused on fused.id = items.id
  order by fused.score desc
  limit match_count;
$$ language sql stable;

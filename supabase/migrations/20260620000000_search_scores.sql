/*
  Expose ranking signals from search_items() so the frontend can show a
  recruiter-facing "debug mode" (similarity score, which signal matched).
  Returns jsonb instead of setof items so the embedding/search_vector
  columns are dropped server-side rather than stripped post-hoc in the
  Edge Function.
*/

drop function if exists search_items(vector(768), text, text, numeric, numeric, int);

create or replace function search_items(
  query_embedding vector(768) default null,
  query_text text default null,
  p_category text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  match_count int default 20
)
returns setof jsonb as $$
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
           v.rank as vector_rank,
           k.rank as keyword_rank,
           (1.0 / (60 + coalesce(v.rank, 1000))) + (1.0 / (60 + coalesce(k.rank, 1000))) as score
    from vector_ranked v
    full outer join keyword_ranked k on v.id = k.id
  )
  select jsonb_build_object(
           'id', items.id,
           'name', items.name,
           'description', items.description,
           'category', items.category,
           'price_per_day', items.price_per_day,
           'location', items.location,
           'location_id', items.location_id,
           'image_url', items.image_url,
           'owner_id', items.owner_id,
           'status', items.status,
           'created_at', items.created_at,
           'match_score', fused.score,
           'vector_rank', fused.vector_rank,
           'keyword_rank', fused.keyword_rank
         )
  from items
  join fused on fused.id = items.id
  order by fused.score desc
  limit match_count;
$$ language sql stable;

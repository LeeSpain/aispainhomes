import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  numResults?: number;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, numResults = 5 }: SearchRequest = await req.json();

    // Input validation
    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate query length to prevent DoS
    if (query.length > 500) {
      return new Response(JSON.stringify({ error: 'Invalid request parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate numResults is reasonable
    if (numResults < 1 || numResults > 20) {
      return new Response(JSON.stringify({ error: 'Invalid request parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Searching for: ${query}`);

    // Use DuckDuckGo HTML (free, no API key needed)
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const html = await response.text();
    const document = new DOMParser().parseFromString(html, 'text/html');

    if (!document) {
      throw new Error('Failed to parse search results');
    }

    const results: SearchResult[] = [];
    const resultElements = document.querySelectorAll('.result');

    for (let i = 0; i < Math.min(resultElements.length, numResults); i++) {
      const el = resultElements[i];
      
      const titleEl = el.querySelector('.result__title, .result__a');
      const snippetEl = el.querySelector('.result__snippet');
      const linkEl = el.querySelector('.result__url');

      const title = titleEl?.textContent?.trim() || '';
      const snippet = snippetEl?.textContent?.trim() || '';
      let url = linkEl?.textContent?.trim() || '';

      // Clean up URL
      if (url && !url.startsWith('http')) {
        url = 'https://' + url;
      }

      if (title && url) {
        results.push({
          title,
          url,
          snippet,
        });
      }
    }

    console.log(`Found ${results.length} results`);

    return new Response(
      JSON.stringify({
        success: true,
        query,
        results,
        count: results.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Search error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An error occurred processing your request',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

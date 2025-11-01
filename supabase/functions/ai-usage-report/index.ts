import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UsageQuery {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'model';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify admin role
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { startDate, endDate, groupBy }: UsageQuery = await req.json();

    console.log('Generating usage report for user:', user.id);

    // Set default date range (last 30 days)
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Fetch usage metrics
    let query = supabase
      .from('ai_usage_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: true });

    const { data: metrics, error: metricsError } = await query;

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
      throw new Error('Failed to fetch usage metrics');
    }

    // Calculate totals
    const totals = {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      byModel: {} as Record<string, { requests: number; tokens: number; cost: number }>,
      byDate: {} as Record<string, { requests: number; tokens: number; cost: number }>,
    };

    metrics?.forEach(metric => {
      totals.totalRequests += metric.total_requests;
      totals.totalTokens += metric.total_tokens;
      totals.totalCost += parseFloat(metric.estimated_cost);

      // Group by model
      if (!totals.byModel[metric.model]) {
        totals.byModel[metric.model] = { requests: 0, tokens: 0, cost: 0 };
      }
      totals.byModel[metric.model].requests += metric.total_requests;
      totals.byModel[metric.model].tokens += metric.total_tokens;
      totals.byModel[metric.model].cost += parseFloat(metric.estimated_cost);

      // Group by date
      if (!totals.byDate[metric.date]) {
        totals.byDate[metric.date] = { requests: 0, tokens: 0, cost: 0 };
      }
      totals.byDate[metric.date].requests += metric.total_requests;
      totals.byDate[metric.date].tokens += metric.total_tokens;
      totals.byDate[metric.date].cost += parseFloat(metric.estimated_cost);
    });

    // Calculate averages
    const daysInRange = Object.keys(totals.byDate).length || 1;
    const averages = {
      requestsPerDay: totals.totalRequests / daysInRange,
      tokensPerDay: totals.totalTokens / daysInRange,
      costPerDay: totals.totalCost / daysInRange,
      tokensPerRequest: totals.totalRequests > 0 ? totals.totalTokens / totals.totalRequests : 0,
    };

    console.log('Usage report generated:', {
      requests: totals.totalRequests,
      tokens: totals.totalTokens,
      cost: totals.totalCost.toFixed(4),
    });

    return new Response(JSON.stringify({
      period: { start, end },
      totals,
      averages,
      rawData: metrics,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-usage-report function:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred processing your request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

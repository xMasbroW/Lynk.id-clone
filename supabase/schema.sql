-- Database Architecture for Link-in-bio SaaS

-- Note: In Supabase, the 'users' table is managed by auth.users.
-- We create a 'profiles' table that links to auth.users.

-- 1. Profiles Table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Themes Table
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    mode TEXT DEFAULT 'dark', -- 'light' or 'dark'
    background_color TEXT,
    button_color TEXT,
    button_text_color TEXT,
    font_family TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Links Table
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    url TEXT NOT NULL,
    icon_key TEXT,
    featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Analytics (Aggregated views) Table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    total_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4a. Analytics Events (Append-only for scale)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    link_id UUID REFERENCES links(id) ON DELETE SET NULL, -- nullable for profile views
    event_type TEXT NOT NULL, -- 'view' or 'click'
    device_type TEXT DEFAULT 'desktop',
    referrer_url TEXT DEFAULT 'direct',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4b. Analytics Daily Snapshots (Aggregated scale)
CREATE TABLE analytics_daily_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    UNIQUE(user_id, date)
);

-- 4c. Analytics Materialized View (for high-speed dashboard reads)
CREATE MATERIALIZED VIEW analytics_materialized AS
SELECT
    user_id,
    date_trunc('day', created_at) as day,
    count(*) filter (where event_type = 'view') as total_views,
    count(*) filter (where event_type = 'click') as total_clicks
FROM analytics_events
GROUP BY user_id, date_trunc('day', created_at);

-- Unique index to refresh materialized view concurrently
CREATE UNIQUE INDEX idx_analytics_materialized_user_day ON analytics_materialized(user_id, day);

-- 5. Subscriptions (Billing Prep) Table
-- 5. Billing Plans (Platform config)
CREATE TABLE billing_plans (
    id TEXT PRIMARY KEY, -- e.g., 'free', 'pro', 'enterprise'
    name TEXT NOT NULL,
    max_links INTEGER DEFAULT 5,
    has_custom_themes BOOLEAN DEFAULT false,
    has_analytics BOOLEAN DEFAULT false,
    price_monthly INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pre-seed billing plans
INSERT INTO billing_plans (id, name, max_links, has_custom_themes, has_analytics) VALUES
('free', 'Free', 5, false, false),
('pro', 'Pro', 50, true, true),
('enterprise', 'Enterprise', 1000, true, true);

-- 6. Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES billing_plans(id) DEFAULT 'free',
    status TEXT DEFAULT 'active',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- 6a. Billing Events (Audit Trail for Payments)
CREATE TABLE billing_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'checkout.session.completed', 'invoice.paid', 'customer.subscription.deleted'
    stripe_event_id TEXT UNIQUE NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Workspaces (Multi-tenant Foundation)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7a. Workspace Members
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer', -- 'owner', 'admin', 'editor', 'viewer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, user_id)
);

-- 8. API Keys (Developer Platform Foundation)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL, -- Never store raw API keys
    name TEXT NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Marketplace Templates
CREATE TABLE marketplace_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    theme_data JSONB NOT NULL,
    price_cents INTEGER DEFAULT 0,
    clones INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Automation Workflows
CREATE TABLE automation_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL,
    action_payload JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE automation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'success', 'failed'
    logs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Growth & Affiliates
CREATE TABLE referral_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexing
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_themes_user_id ON themes(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Set up Row Level Security (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_events ENABLE ROW LEVEL SECURITY;

-- Policies for platform config
CREATE POLICY "Billing plans are viewable by everyone."
    ON billing_plans FOR SELECT
    USING (true);

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Policies for themes
CREATE POLICY "Themes are viewable by everyone."
    ON themes FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own theme."
    ON themes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own theme."
    ON themes FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies for links
CREATE POLICY "Links are viewable by everyone."
    ON links FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own links."
    ON links FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links."
    ON links FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links."
    ON links FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions."
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Policies for workspaces
CREATE POLICY "Users can view their own workspaces."
    ON workspaces FOR SELECT
    USING (auth.uid() = owner_id);

-- Policies for API Keys
CREATE POLICY "Users can manage API keys for their workspaces."
    ON api_keys FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workspaces WHERE workspaces.id = api_keys.workspace_id AND workspaces.owner_id = auth.uid()
        )
    );

-- Policies for analytics
CREATE POLICY "Users can view their own analytics."
    ON analytics FOR SELECT
    USING (auth.uid() = user_id);

-- RPC for incrementing views
CREATE OR REPLACE FUNCTION increment_view(target_user_id UUID, p_device_type TEXT DEFAULT 'desktop', p_referrer_url TEXT DEFAULT 'direct')
RETURNS void AS $$
BEGIN
  -- 1. Insert into append-only events table
  INSERT INTO public.analytics_events (user_id, event_type, device_type, referrer_url)
  VALUES (target_user_id, 'view', p_device_type, p_referrer_url);

  -- 2. Upsert daily snapshot
  INSERT INTO public.analytics_daily_snapshots (user_id, date, views)
  VALUES (target_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date) DO UPDATE
  SET views = public.analytics_daily_snapshots.views + 1;

  -- 3. Update legacy aggregated table (can be deprecated later)
  UPDATE public.analytics
  SET total_views = total_views + 1,
      updated_at = timezone('utc'::text, now())
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC for incrementing clicks
CREATE OR REPLACE FUNCTION increment_click(target_user_id UUID, target_link_id UUID)
RETURNS void AS $$
BEGIN
  -- 1. Insert into append-only events table
  INSERT INTO public.analytics_events (user_id, link_id, event_type)
  VALUES (target_user_id, target_link_id, 'click');

  -- 2. Upsert daily snapshot
  INSERT INTO public.analytics_daily_snapshots (user_id, date, clicks)
  VALUES (target_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date) DO UPDATE
  SET clicks = public.analytics_daily_snapshots.clicks + 1;

  -- 3. Update legacy aggregated table
  UPDATE public.analytics
  SET total_clicks = total_clicks + 1,
      updated_at = timezone('utc'::text, now())
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );

  -- Create default theme for user
  INSERT INTO public.themes (user_id) VALUES (new.id);

  -- Create initial analytics record
  INSERT INTO public.analytics (user_id) VALUES (new.id);

  -- Give user a default free subscription
  INSERT INTO public.subscriptions (user_id, plan_id) VALUES (new.id, 'free');

  -- Create default workspace
  INSERT INTO public.workspaces (name, owner_id) VALUES ('Personal Workspace', new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- PHASE 11: DISTRIBUTED AUTOMATION PIPELINE
-- ==========================================

-- 12. Job Queue Architecture
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_name TEXT NOT NULL,
    job_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    retries INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    last_error TEXT,
    run_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    deduplication_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for worker polling
CREATE INDEX idx_jobs_pending ON jobs(queue_name, status, run_at) WHERE status = 'pending';

-- 13. AI Execution Logs
CREATE TABLE ai_execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    prompt_type TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    model_used TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Expand Automation Tables (Workflow Engine)
ALTER TABLE automation_workflows
ADD COLUMN definition JSONB,
ADD COLUMN description TEXT;

ALTER TABLE automation_runs
ADD COLUMN current_node_id TEXT,
ADD COLUMN context JSONB,
ADD COLUMN error TEXT,
ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- RPC for fetching and locking jobs safely in Postgres
CREATE OR REPLACE FUNCTION fetch_pending_jobs(p_queue_name TEXT, p_limit INTEGER)
RETURNS SETOF jobs AS $$
BEGIN
  RETURN QUERY
  UPDATE jobs
  SET status = 'processing'
  WHERE id IN (
    SELECT id
    FROM jobs
    WHERE queue_name = p_queue_name
      AND status = 'pending'
      AND run_at <= timezone('utc'::text, now())
    ORDER BY run_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT p_limit
  )
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

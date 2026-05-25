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

-- 5. Subscriptions (Billing Prep) Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_type TEXT DEFAULT 'free',
    status TEXT DEFAULT 'active',
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

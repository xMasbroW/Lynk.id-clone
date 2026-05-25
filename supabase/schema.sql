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

-- Set up Row Level Security (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

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
CREATE OR REPLACE FUNCTION increment_view(target_user_id UUID, device_type TEXT DEFAULT 'desktop', referrer_url TEXT DEFAULT 'direct')
RETURNS void AS $$
BEGIN
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

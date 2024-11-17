-- Create API keys table
create table public.api_keys (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects not null,
    key_type text not null check (key_type in ('production', 'development')),
    key_value text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_used_at timestamp with time zone,
    is_active boolean default true not null
);

-- Enable RLS
alter table public.api_keys enable row level security;

-- Create API keys policies
create policy "Users can view their project's API keys"
    on api_keys for select
    using (
        exists (
            select 1 from projects
            where projects.id = api_keys.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can create API keys for their projects"
    on api_keys for insert
    with check (
        exists (
            select 1 from projects
            where projects.id = api_keys.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can update their project's API keys"
    on api_keys for update
    using (
        exists (
            select 1 from projects
            where projects.id = api_keys.project_id
            and projects.user_id = auth.uid()
        )
    );

-- Create project settings table
create table public.project_settings (
    project_id uuid references public.projects primary key,
    notification_email boolean default true not null,
    notification_slack boolean default false not null,
    notification_discord boolean default false not null,
    notification_threshold integer default 5 not null,
    ip_whitelist text[],
    rate_limit integer default 1000 not null,
    enable_source_maps boolean default true not null,
    error_retention_days integer default 30 not null,
    logs_retention_days integer default 7 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.project_settings enable row level security;

-- Create project settings policies
create policy "Users can view their project settings"
    on project_settings for select
    using (
        exists (
            select 1 from projects
            where projects.id = project_settings.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can update their project settings"
    on project_settings for update
    using (
        exists (
            select 1 from projects
            where projects.id = project_settings.project_id
            and projects.user_id = auth.uid()
        )
    );

-- Function to generate API key
create or replace function generate_api_key(key_type text)
returns text
language plpgsql
as $$
declare
    key_prefix text;
    random_bytes bytea;
    base64_key text;
begin
    -- Set prefix based on key type
    key_prefix := case
        when key_type = 'production' then 'et_live_'
        when key_type = 'development' then 'et_dev_'
        else 'et_test_'
    end;
    
    -- Generate 32 random bytes
    random_bytes := gen_random_bytes(32);
    
    -- Convert to base64 and remove non-alphanumeric characters
    base64_key := encode(random_bytes, 'base64');
    base64_key := regexp_replace(base64_key, '[^a-zA-Z0-9]', '', 'g');
    
    -- Return prefixed key truncated to 40 characters
    return key_prefix || substring(base64_key, 1, 32);
end;
$$;
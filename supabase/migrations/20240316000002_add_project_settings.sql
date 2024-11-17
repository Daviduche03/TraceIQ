-- Create project settings table if it doesn't exist
create table if not exists public.project_settings (
    project_id uuid references public.projects primary key,
    notification_email boolean default true not null,
    notification_slack boolean default false not null,
    notification_discord boolean default false not null,
    notification_threshold integer default 5 not null,
    ip_whitelist text[] default array[]::text[],
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

create policy "Users can insert their project settings"
    on project_settings for insert
    with check (
        exists (
            select 1 from projects
            where projects.id = project_settings.project_id
            and projects.user_id = auth.uid()
        )
    );
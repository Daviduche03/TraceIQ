-- Create projects table
create table public.projects (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    environment text not null check (environment in ('Production', 'Staging', 'Development')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Create projects policies
create policy "Users can view their own projects"
    on projects for select
    using (auth.uid() = user_id);

create policy "Users can create their own projects"
    on projects for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own projects"
    on projects for update
    using (auth.uid() = user_id);

create policy "Users can delete their own projects"
    on projects for delete
    using (auth.uid() = user_id);

-- Create errors table
create table public.errors (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects not null,
    message text not null,
    type text not null,
    stack_trace text,
    browser text,
    os text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status text not null check (status in ('open', 'resolved', 'ignored')) default 'open',
    severity text not null check (severity in ('critical', 'error', 'warning')) default 'error'
);

-- Enable RLS
alter table public.errors enable row level security;

-- Create errors policies
create policy "Users can view errors from their projects"
    on errors for select
    using (
        exists (
            select 1 from projects
            where projects.id = errors.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can create errors in their projects"
    on errors for insert
    with check (
        exists (
            select 1 from projects
            where projects.id = errors.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can update errors in their projects"
    on errors for update
    using (
        exists (
            select 1 from projects
            where projects.id = errors.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can delete errors in their projects"
    on errors for delete
    using (
        exists (
            select 1 from projects
            where projects.id = errors.project_id
            and projects.user_id = auth.uid()
        )
    );

-- Create indexes
create index errors_project_id_idx on errors(project_id);
create index errors_created_at_idx on errors(created_at);
create index errors_status_idx on errors(status);
create index errors_severity_idx on errors(severity);
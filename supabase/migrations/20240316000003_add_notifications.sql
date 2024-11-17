-- Create notifications table
create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    project_id uuid references public.projects,
    title text not null,
    message text not null,
    type text not null check (type in ('error', 'warning', 'info', 'success')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    read_at timestamp with time zone,
    metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Create notifications policies
create policy "Users can view their own notifications"
    on notifications for select
    using (auth.uid() = user_id);

create policy "Users can update their own notifications"
    on notifications for update
    using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
    on notifications for delete
    using (auth.uid() = user_id);

-- Create function to create error notifications
create or replace function create_error_notification()
returns trigger as $$
begin
    insert into notifications (
        user_id,
        project_id,
        title,
        message,
        type
    )
    select 
        p.user_id,
        NEW.project_id,
        case
            when NEW.severity = 'critical' then 'Critical Error Detected'
            when NEW.severity = 'error' then 'New Error Detected'
            else 'Warning Detected'
        end,
        NEW.message,
        case
            when NEW.severity = 'critical' then 'error'
            when NEW.severity = 'error' then 'warning'
            else 'info'
        end
    from projects p
    where p.id = NEW.project_id;
    
    return NEW;
end;
$$ language plpgsql;

-- Create trigger for error notifications
create trigger error_notification_trigger
    after insert on errors
    for each row
    execute function create_error_notification();
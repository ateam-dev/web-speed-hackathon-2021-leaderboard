-- This code was created manually.
-- enable moddatetime
-- WARNING!!! Please pre-run this SQL from the supabase web console.
-- This operation can only be performed by a super user.
-- create extension moddatetime;

-- create trigger
create trigger handle_updated_at_Team before update on "Team"
    for each row execute procedure moddatetime ("updatedAt");
create trigger handle_updated_at_User before update on "User"
    for each row execute procedure moddatetime ("updatedAt");
create trigger handle_updated_at_Measurement before update on "Measurement"
    for each row execute procedure moddatetime ("updatedAt");
create trigger handle_updated_at_Queue before update on "Queue"
    for each row execute procedure moddatetime ("updatedAt");
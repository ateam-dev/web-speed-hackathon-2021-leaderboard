-- This code was created manually.
-- enable RLS
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Measurement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Queue" ENABLE ROW LEVEL SECURITY;

-- public read anyone
CREATE POLICY "Enable access to all users" ON "Measurement" FOR SELECT USING (true);
CREATE POLICY "Enable access to all users" ON "Queue" FOR SELECT USING (true);
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env["SUPABASE_URL"] || "",
  process.env["SUPABASE_API_KEY"] || ""
);

export const fetchTeamInfo = async (queueId: string) => {
  const { data, error } = await supabaseClient
    .from<{ Team: { id: string; pageUrl: string } }>("Queue")
    .select("Team(id, pageUrl)")
    .match({ id: queueId });
  if (error?.message) {
    console.error(error.message);
    throw new Error(error.message);
  } else if (data === null || !data[0]) {
    throw new Error("not found Quere");
  }
  return data[0].Team;
};

export const updateQueueStatus = async (
  id: string,
  status: "RUNNING" | "FAILED" | "DONE"
) => {
  const { data, error } = await supabaseClient
    .from("Queue")
    .update({ status })
    .match({ id });
  if (error?.message) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data;
};

export const createMeasurement = async (
  teamId: string,
  score: number,
  vrtUrl: string
) => {
  const { data, error } = await supabaseClient
    .from("Measurement")
    .insert({ teamId, score, vrtUrl });
  if (error?.message) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data;
};

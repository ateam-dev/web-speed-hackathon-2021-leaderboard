import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env["SUPABASE_URL"] || "",
  process.env["SUPABASE_API_KEY"] || ""
);

export const fetchTeamInfo = async (queueId: string) => {
  const { data, error } = await supabaseClient
    .from<{ Team: { id: string; pageUrl: string } }>("Queue")
    .select("Team!inner!Queue_teamId_fkey(id, pageUrl)")
    .match({ id: queueId, status: "WAITING" });
  if (error?.message) {
    console.error(error.message);
    throw new Error(error.message);
  } else if (data === null || !data[0]) {
    throw new Error("not found Queue");
  }

  return data[0]?.Team;
};

export const fetchQueue = async (queueId: string) => {
  const { data } = await supabaseClient
    .from<{
      id: string;
      status: "RUNNING" | "FAILED" | "DONE" | "WAITING";
      teamId: string;
    }>("Queue")
    .select("*")
    .match({ id: queueId })
    .throwOnError()
    .single();

  return data;
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
  queueId: string,
  score: number,
  vrtUrl: string,
  message: string
) => {
  const { data, error } = await supabaseClient
    .from("Measurement")
    .insert({ teamId, queueId, score, vrtUrl, message });
  if (error?.message) {
    console.error(error.message);
    throw new Error(error.message);
  }
  return data;
};

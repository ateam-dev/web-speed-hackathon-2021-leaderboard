import { supabaseClient } from "~/libs/supabase.server";
import { QueueStatus } from "@prisma/client";

export const myQueues = async ({
  email,
}: {
  email: string;
}): Promise<
  { createdAt: string; status: QueueStatus; duration: null | number }[]
> => {
  const { data } = await supabaseClient
    .from<{
      createdAt: string;
      status: QueueStatus;
      updatedAt: string;
      "Team.User.email": string;
    }>("Queue")
    .select("createdAt, status, updatedAt, Team!inner(User!inner(*))")
    .eq("Team.User.email", email)
    .order("createdAt", { ascending: false })
    .limit(5)
    .throwOnError();
  if (!data) return [];

  return data.map(({ createdAt, status, updatedAt }) => {
    const duration = ["DONE", "FAILED"].includes(status)
      ? new Date(updatedAt).getTime() - new Date(createdAt).getTime()
      : null;

    return {
      createdAt,
      status,
      duration,
    };
  });
};

export const lineup = async (variables: {
  teamId: string;
  pageUrl: string;
}) => {
  return Promise.all([
    supabaseClient
      .from("Queue")
      .insert({ teamId: variables.teamId })
      .throwOnError(),
    supabaseClient
      .from("Team")
      .update({ pageUrl: variables.pageUrl })
      .eq("id", variables.teamId)
      .throwOnError(),
  ]);
};

export const hasProcessingQueue = async ({ teamId }: { teamId: string }) => {
  const { data } = await supabaseClient
    .from("Queue")
    .select("*")
    .match({ teamId })
    .in("status", ["WAITING", "RUNNING"])
    .limit(1)
    .throwOnError();

  return data && data.length > 0;
};

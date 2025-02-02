import { supabaseClient } from "~/libs/supabase.server";
import { queue_status } from "@prisma/client";

export const myQueues = async ({
  email,
}: {
  email: string;
}): Promise<
  {
    createdAt: string;
    status: queue_status;
    vrtUrl: string | null;
    message: string | null;
    score: number | null;
    duration: null | number;
  }[]
> => {
  const { data } = await supabaseClient
    .from<{
      createdAt: string;
      status: queue_status;
      updatedAt: string;
      Measurement: {
        vrtUrl: string;
        message: string;
        score: number;
      }[];
      "Team.User.email": string;
    }>("Queue")
    .select(
      "createdAt, status, updatedAt, Measurement(vrtUrl, message, score), Team!inner!Queue_teamId_fkey(User!inner(email))"
    )
    .eq("Team.User.email", email)
    .order("createdAt", { ascending: false })
    .limit(10)
    .throwOnError();
  if (!data) return [];

  return data.map(({ createdAt, status, Measurement, updatedAt }) => {
    const duration = ["DONE", "FAILED"].includes(status)
      ? Math.floor(
          (new Date(updatedAt).getTime() - new Date(createdAt).getTime()) / 1000
        )
      : null;

    return {
      createdAt,
      status,
      vrtUrl: Measurement[0]?.vrtUrl ?? null,
      message: Measurement[0]?.message ?? null,
      score: Measurement[0]?.score ?? null,
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

import { supabaseClient } from "~/libs/supabase.client";
import { useEffect } from "react";
import { useDataRefresh } from "remix-utils";
import { useTeamContext } from "~/components/contexts/UserAndTeam";

export const ObserveAndRefresh = () => {
  const teamId = useTeamContext()?.id;
  const { refresh } = useDataRefresh();
  useEffect(() => {
    const subscribe = supabaseClient
      .from("Measurement")
      .on("INSERT", () => {
        refresh();
      })
      .subscribe();
    return () => {
      subscribe.unsubscribe();
    };
  }, [refresh]);
  useEffect(() => {
    if (!teamId) return;
    const subscribe = supabaseClient
      .from(`Queue:teamId=eq.${teamId}`)
      .on("UPDATE", () => {
        refresh();
      })
      .on("INSERT", () => {
        refresh();
      })
      .subscribe();
    return () => {
      subscribe.unsubscribe();
    };
  }, [refresh, teamId]);
  return null;
};

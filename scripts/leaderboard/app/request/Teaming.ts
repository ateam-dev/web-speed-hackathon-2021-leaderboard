import { supabaseClient } from "~/libs/supabase.server";

export const signup = async (variables: { email: string; name: string }) => {
  const { data } = await supabaseClient
    .from("User")
    .upsert(variables, { onConflict: "email" })
    .throwOnError();
  return data;
};

export const createTeam = async (variables: { name: string }) => {
  const { data } = await supabaseClient
    .from("Team")
    .insert(variables)
    .throwOnError();

  return data;
};

export const joinTeam = async (variables: {
  teamId: string;
  email: string;
}) => {
  const { data } = await supabaseClient
    .from("User")
    .update({ teamId: variables.teamId })
    .match({ email: variables.email });

  return data;
};

export const listTeams = async (): Promise<
  {
    users: { email: string; name: string }[];
    id: string;
    name: string | null;
    pageUrl: string | null;
  }[]
> => {
  const { data } = await supabaseClient
    .from("Team")
    .select("id, name, pageUrl, users:User(email, name)")
    .order("createdAt", { ascending: false })
    .limit(100)
    .throwOnError();

  return data ?? [];
};

export const getMyTeam = async (variables: { email: string }) => {
  const { data } = await supabaseClient
    .from("Team")
    .select("*, User!inner(*)")
    .eq("User.email", variables.email)
    .single();

  return data;
};

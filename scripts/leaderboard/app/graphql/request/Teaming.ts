import { client } from "../apollo-client";
import {
  CreateTeamDocument,
  CreateTeamMutation,
  CreateTeamMutationVariables,
  // JoinTeamDocument,
  // JoinTeamMutation,
  JoinTeamMutationVariables,
  ListTeamsDocument,
  ListTeamsPrevDocument,
  ListTeamsPrevQuery,
  ListTeamsQuery,
  SignupDocument,
  SignupMutation,
  SignupMutationVariables,
} from "generated/graphql";
import { ApolloError } from "@apollo/client";
import { supabaseClient } from "~/libs/supabase.server";

export const signup = async (variables: SignupMutationVariables) => {
  try {
    return await client.mutate<SignupMutation>({
      mutation: SignupDocument,
      variables,
    });
  } catch (e) {
    if (e instanceof ApolloError) {
      const error = e.graphQLErrors[0];
      if (error.message.includes("duplicate key")) return null;
    }
    console.error(e);

    throw e;
  }
};

export const createTeam = async (variables: CreateTeamMutationVariables) => {
  return client.mutate<CreateTeamMutation>({
    mutation: CreateTeamDocument,
    variables,
    refetchQueries: [{ query: ListTeamsDocument, variables: { cursor: null } }],
    awaitRefetchQueries: true,
  });
};

export const joinTeam = async (variables: JoinTeamMutationVariables) => {
  const { data } = await supabaseClient
    .from("User")
    .update({ teamId: variables.teamId })
    .match({ email: variables.email });

  await client.clearStore();

  return data;

  // TODO: When the error on the supabase side is resolved, revert back to this code.
  // return client.mutate<JoinTeamMutation>({
  //   mutation: JoinTeamDocument,
  //   variables,
  // });
};

export const listTeams = async (cursor: string | null, prev = false) => {
  if (!prev)
    return client.query<ListTeamsQuery>({
      query: ListTeamsDocument,
      variables: {
        cursor,
      },
    });
  else
    return client.query<ListTeamsPrevQuery>({
      query: ListTeamsPrevDocument,
      variables: {
        cursor,
      },
    });
};

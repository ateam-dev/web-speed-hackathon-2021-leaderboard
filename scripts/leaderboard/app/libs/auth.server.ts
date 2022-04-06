import { Authenticator, AuthorizationError } from "remix-auth";
import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { SupabaseStrategy } from "@afaik/remix-auth-supabase-strategy";
import { supabaseClient } from "~/libs/supabase.server";
import type { Session } from "@supabase/supabase-js";

// for development
export const skipAuth =
  process.env.NODE_ENV === "development" && SUPABASE_API_KEY === "sample";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "sb",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3ts-fpc"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const supabaseStrategy = new SupabaseStrategy(
  {
    supabaseClient,
    sessionStorage,
  },
  async ({ req, supabaseClient }) => {
    const form = await req.formData();
    const refreshToken = form?.get("refreshToken");
    if (typeof refreshToken === "string") {
      const { session, error } = await supabaseClient.auth.signIn({
        refreshToken,
      });

      if (error || !session) {
        throw new AuthorizationError(error?.message ?? "No user session found");
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete session.user;
      return session;
    }

    throw new AuthorizationError("No user session found");
  }
);

export const authenticator = new Authenticator<Session>(sessionStorage, {
  sessionKey: supabaseStrategy.sessionKey, // keep in sync
  sessionErrorKey: supabaseStrategy.sessionErrorKey, // keep in sync
});

authenticator.use(supabaseStrategy);

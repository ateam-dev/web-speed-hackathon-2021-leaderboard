import { createCookie } from "@remix-run/cloudflare";

export const backdoorCookie = createCookie("backdoor", {
  maxAge: 3600 * 24,
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: ["s3cr3ts"],
  secure: process.env.NODE_ENV === "production",
});

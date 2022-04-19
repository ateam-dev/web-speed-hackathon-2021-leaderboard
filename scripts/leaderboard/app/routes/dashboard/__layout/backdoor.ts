import { LoaderFunction, redirect } from "@remix-run/cloudflare";
import { backdoorCookie } from "~/libs/backdoor.server";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie =
    (await backdoorCookie.parse(request.headers.get("Cookie"))) ?? {};
  cookie.nakanohito = "true";

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await backdoorCookie.serialize(cookie),
    },
  });
};

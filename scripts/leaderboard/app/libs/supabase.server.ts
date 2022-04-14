import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  fetch: (url, inits) => {
    if (!url.toString().includes("/rest/v1")) return fetch(url, inits);
    return fetch(url, {
      ...inits,
      ...(inits?.headers && {
        headers: {
          ...inits.headers,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
      }),
    });
  },
});

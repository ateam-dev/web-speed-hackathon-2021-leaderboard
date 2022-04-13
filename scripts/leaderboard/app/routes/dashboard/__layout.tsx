import { LoaderFunction, redirect } from "@remix-run/cloudflare";
import { supabaseStrategy } from "~/libs/auth.server";
import { useLoaderData, Outlet, useCatch } from "@remix-run/react";
import { Box, Container } from "@chakra-ui/react";
import { Navbar } from "~/components/Navbar";
import { getMyTeam } from "~/request/Teaming";
import {
  UserAndTeam,
  UserAndTeamContextProvider,
} from "~/components/contexts/UserAndTeam";
import { StatusPage } from "~/components/StatusPage";
import { ErrorPage } from "~/components/ErrorPage";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request, {
    failureRedirect: "/auth/login",
  });

  const team = await getMyTeam({ email: session.user?.email ?? "" });
  if (!team && new URL(request.url).pathname === "/dashboard")
    return redirect("/dashboard/teams", { status: 302 });

  return { user: session.user, team } as UserAndTeam;
};

const Layout = () => {
  const data = useLoaderData<UserAndTeam>();
  return (
    <>
      <Box pos="fixed" w="100%" zIndex={10}>
        <Navbar user={data.user} />
      </Box>
      <Container maxW="8xl" pt={24}>
        <UserAndTeamContextProvider value={data}>
          <Outlet />
        </UserAndTeamContextProvider>
      </Container>
    </>
  );
};

export default Layout;

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <>
      <Box pos="fixed" w="100%" zIndex={10}>
        <Navbar user={null} />
      </Box>
      <Container maxW="8xl" pt={24}>
        <StatusPage {...caught} />
      </Container>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <Box pos="fixed" w="100%" zIndex={10}>
        <Navbar user={null} />
      </Box>
      <Container maxW="8xl" pt={24}>
        <ErrorPage message={error.message} />
      </Container>
    </>
  );
}

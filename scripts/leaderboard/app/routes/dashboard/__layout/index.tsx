import { MeasurementRequest } from "~/components/MeasurementReuest";
import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/cloudflare";
import { useTeamContext } from "~/components/contexts/UserAndTeam";
import { scoresForGraph } from "~/request/Measurement";
import { Chart } from "~/components/Chart";
import { useLoaderData } from "@remix-run/react";
import {
  Box,
  Switch,
  FormControl,
  FormLabel,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { ObserveAndRefresh } from "~/components/Observer";
import { Ranking } from "~/components/Ranking";
import { useReducer } from "react";
import { handler } from "~/components/forms/MeasureRequest";
import { QueueList } from "~/components/QueueList";
import { myQueues } from "~/request/Queue";
import { supabaseStrategy } from "~/libs/auth.server";
import { promiseHash } from "remix-utils";
import { Statistics } from "~/components/Statistics";
import { getMyTeam } from "~/request/Teaming";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

type Data = {
  scores: Awaited<ReturnType<typeof scoresForGraph>>;
  queues: Awaited<ReturnType<typeof myQueues>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await supabaseStrategy.checkSession(request);

  dayjs.extend(utc);
  const team =
    dayjs() > dayjs("2022-04-28 08:00:00").utc(true)
      ? await getMyTeam({ email: session?.user?.email ?? "" })
      : null;

  return promiseHash({
    queues: myQueues({ email: session?.user?.email ?? "" }),
    scores: scoresForGraph(team?.id),
  });
};

export const action: ActionFunction = async ({
  request,
  context: { event },
}: {
  request: Request;
  context: { event: FetchEvent };
}) => {
  const data = await request.formData();
  try {
    if (await handler(data, event)) return null;
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }

  throw new Error("invalid request");
};

const Index = () => {
  const team = useTeamContext();
  const { scores, queues } = useLoaderData<Data>();
  const [flag, toggle] = useReducer((s) => !s, false);
  if (!team) return null;

  return (
    <>
      <Stack direction={["column", "row"]} spacing={8}>
        <Box maxH="160px" w="full">
          <MeasurementRequest teamId={team.id} url={team.pageUrl ?? ""} />
        </Box>
        <Box maxH="200px" overflowY="scroll" w="full">
          <QueueList queues={queues} />
        </Box>
      </Stack>
      <Box mt={8}>
        <Statistics scores={scores} />
      </Box>
      <Box mt={8} height="600px">
        <Flex alignItems="end" mb={4} direction="row-reverse">
          <Box>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Sequence</FormLabel>
              <Switch size="lg" onChange={toggle} defaultChecked={flag} />
              <FormLabel mb="0" ml={4}>
                Ranking
              </FormLabel>
            </FormControl>
          </Box>
        </Flex>
        {flag ? <Ranking data={scores} /> : <Chart data={scores} />}
        <ObserveAndRefresh />
      </Box>
    </>
  );
};

export default Index;

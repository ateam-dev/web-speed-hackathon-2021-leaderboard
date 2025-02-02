import fastify from "fastify";
import { main as mainScoring } from "@web-speed-hackathon/scoring";
import { executeVrt } from "./vrt";
import {
  startMeasurement,
  updateQueueStatusToFail,
  updateQueueStatusToDone,
} from "./measure";
import { fetchQueue, updateQueueStatus } from "./database";

const server = fastify();

server.get("/ping", async (_request, _reply) => {
  return "pong\n";
});

server.post<{
  Params: { queueId: string };
}>("/execute/:queueId", async (request, reply) => {
  let team = null;
  let vrtResult = null;

  try {
    // 計測開始
    team = await startMeasurement(request.params.queueId);
    if (team === null) {
      reply.callNotFound();
      return;
    }

    // VRTの実行
    const vrtResult = await executeVrt(request.params.queueId, team.pageUrl);
    if (!vrtResult.success) {
      await updateQueueStatusToFail(
        request.params.queueId,
        team.id,
        vrtResult.url ?? "none",
        vrtResult.message
      );
      reply.status(400);
      return;
    }

    // スコアの取得
    const { result } = await mainScoring(request.params.queueId, team.pageUrl);
    if ("error" in result) {
      await updateQueueStatusToFail(
        request.params.queueId,
        team.id,
        vrtResult.url,
        `スコア計測ができませんでした: ${result.error.message}`
      );
      reply.status(400);
      return;
    }

    // 計測終了
    await updateQueueStatusToDone(
      request.params.queueId,
      team.id,
      vrtResult.url,
      result.score
    );

    return result;
  } catch (e) {
    console.error(e);
    if (team) {
      await updateQueueStatusToFail(
        request.params.queueId,
        team.id,
        vrtResult?.url ?? "none",
        `スコア計測が異常終了しました: ${e.message}`
      );
    }
    throw e;
  }
});

server.post<{
  Params: { queueId: string };
}>("/self-kill/:queueId", async (request, reply) => {
  try {
    const queue = await fetchQueue(request.params.queueId);
    if (!["DONE", "FAILED"].includes(queue.status)) {
      await updateQueueStatusToFail(
        queue.id,
        queue.teamId,
        "none",
        "The measurement job timed out."
      );

      return `Killed the queue; ${request.params.queueId}`;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }

  return `No dead queues.`;
});

server.listen(process.env["PORT"] || 8080, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

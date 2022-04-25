import {
  updateQueueStatus,
  createMeasurement,
  fetchTeamInfo,
} from "./database";
import { CloudTasksClient } from "@google-cloud/tasks";

export const startMeasurement = async (queueId: string) => {
  const team = await fetchTeamInfo(queueId);
  if (!team) {
    return null;
  }

  await Promise.all([
    updateQueueStatus(queueId, "RUNNING"),
    selfCheckTimeout(queueId, 10 * 60 + 30), // 10 min and 30 sec
  ]);

  return team;
};

export const updateQueueStatusToFail = async (
  queueId: string,
  teamId: string,
  vrtUrl: string,
  message: string
) => {
  await createMeasurement(teamId, queueId, 0, vrtUrl, message);
  await updateQueueStatus(queueId, "FAILED");
};

export const updateQueueStatusToDone = async (
  queueId: string,
  teamId: string,
  vrtUrl: string,
  score: number
) => {
  await createMeasurement(
    teamId,
    queueId,
    score,
    vrtUrl,
    "正常に計測が完了しました。"
  );
  await updateQueueStatus(queueId, "DONE");
};

const client = new CloudTasksClient();
const selfCheckTimeout = async (queueId: string, afterSec: number) => {
  const parent = client.queuePath(
    process.env["GCP_PROJECT_ID"],
    process.env["GCP_REGION"],
    process.env["GCP_CLOUD_TASK_QUEUE_NAME"]
  );
  await client.createTask({
    parent,
    task: {
      scheduleTime: { seconds: afterSec + Date.now() / 1000 },
      httpRequest: {
        url: `${process.env["MEASURE_SERVER_URI"]}/self-kill/${queueId}`,
        httpMethod: "POST",
      },
    },
  });
};

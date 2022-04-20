import { updateQueueStatus, createMeasurement, fetchTeamInfo } from './database';

export const startMeasurement = async (queueId: string) => {
  const team = await fetchTeamInfo(queueId);
  if (!team) {
    return null;
  }

  await updateQueueStatus(queueId, 'RUNNING');

  return team;
}

export const updateQueueStatusToFail = async (queueId: string, teamId: string, vrtUrl: string, message: string) => {
  await createMeasurement(teamId, queueId, 0, vrtUrl, message);
  await updateQueueStatus(queueId, 'FAILED');
}

export const updateQueueStatusToDone = async (queueId: string, teamId: string, vrtUrl: string, score: number) => {
  await createMeasurement(teamId, queueId, score, vrtUrl, '正常に計測が完了しました。');
  await updateQueueStatus(queueId, 'FAILED');
}

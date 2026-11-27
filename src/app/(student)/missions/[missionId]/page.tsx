import { notFound } from "next/navigation";
import { getMission } from "@/data/missions";
import { MissionBriefing } from "@/components/mission/mission-briefing";

export default async function MissionBriefingPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;
  const mission = getMission(missionId);
  if (!mission) notFound();

  return <MissionBriefing mission={mission} />;
}

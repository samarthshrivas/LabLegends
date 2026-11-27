import { notFound } from "next/navigation";
import { LabWorkspace } from "@/components/lab/lab-workspace";
import { getMission } from "@/data/missions";

export default async function LabPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;
  const mission = getMission(missionId);
  if (!mission || !mission.available) notFound();

  return <LabWorkspace mission={mission} />;
}

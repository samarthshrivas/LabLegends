import { notFound } from "next/navigation";
import { ClassDetail } from "@/components/teacher/class-detail";
import { DEMO_CLASSES } from "@/data/demo";

export default async function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const demoClass = DEMO_CLASSES.find((item) => item.id === classId);
  if (!demoClass) notFound();

  return <ClassDetail classId={classId} />;
}

import Header from "@/components/Header";
import BackupTool from "@/components/BackupTool";

export default function BackupPage() {
  return (
    <>
      <Header title="백업 / 복원" subtitle="모든 편집 내용을 JSON으로" />
      <BackupTool />
    </>
  );
}

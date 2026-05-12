import { useParams, useNavigate } from "react-router-dom";
import { ProjectDetailPage } from "@/components/projects/ProjectDetailPage";

export default function ClientProjectDetail() {
  const { id, projectId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/client/${id}/projects`);
  };

  return (
    <div className="p-6">
      <ProjectDetailPage
        projectId={projectId || "1"}
        isAgencyView={false}
        onBack={handleBack}
      />
    </div>
  );
}

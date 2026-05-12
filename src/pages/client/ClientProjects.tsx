import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectsListPage } from "@/components/projects/ProjectsListPage";
import { useNavigation } from "@/contexts/NavigationContext";

export default function ClientProjects() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentClient } = useNavigation();

  const handleViewProject = (projectId: string) => {
    navigate(`/client/${id}/projects/${projectId}`);
  };

  return (
    <div className="p-6">
      <ProjectsListPage
        clientName={currentClient?.name}
        isAgencyView={false}
        onViewProject={handleViewProject}
      />
    </div>
  );
}

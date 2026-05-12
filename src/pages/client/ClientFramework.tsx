import { useNavigate, useParams } from "react-router-dom";
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow";
import { useNavigation } from "@/contexts/NavigationContext";

export default function ClientFramework() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentClient } = useNavigation();

  const handleComplete = () => {
    navigate(`/client/${id}`);
  };

  return (
    <div className="p-6">
      <AssessmentFlow
        clientName={currentClient?.name || "Client"}
        onComplete={handleComplete}
      />
    </div>
  );
}

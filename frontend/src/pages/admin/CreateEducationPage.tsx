import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import { createEducation } from "../../api/portfolioApi";
import { type EducationRequest } from "../../api/requestTypes";
import EducationForm from "../../components/admin/EducationForm";

export default function CreateEducationPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  useEffect(() => {
    setTitleOverride("Create Education");
    setHeaderAction(
      <div className="flex gap-4 items-center">
        <button
          onClick={() => navigate("/admin/education")}
          className="text-sm text-neutral-400 hover:text-white"
        >
          Close
        </button>
      </div>
    );

    return () => setHeaderAction(null);
  }, [navigate, setHeaderAction, setTitleOverride]);

  async function handleSubmit(data: EducationRequest) {
    if (!token) return;
    await createEducation(data, token);
    navigate("/admin/education");
  }

  return (
    <div>
      <EducationForm onSubmit={handleSubmit} submitLabel="Create Education" />
    </div>
  );
}
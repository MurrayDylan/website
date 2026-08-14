import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import { getEducationById, updateEducation } from "../../api/portfolioApi";
import { type EducationRequest } from "../../api/requestTypes";
import { type EducationResponse } from "../../api/responseTypes";
import EducationForm from "../../components/admin/EducationForm";

export default function EditEducationPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();
  const [education, setEducation] = useState<EducationResponse | null>(null);

  useEffect(() => {
    if (id) getEducationById(Number(id)).then(setEducation);
  }, [id]);

  useEffect(() => {
    setTitleOverride("Edit Education");
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
    if (!token || !id) return;
    await updateEducation(Number(id), data, token);
    navigate("/admin/education");
  }

  if (!education) return <p className="text-sm text-neutral-400">Loading…</p>;

  return (
    <div>
      <EducationForm
        initialValues={education}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
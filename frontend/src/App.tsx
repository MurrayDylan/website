import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { PortfolioProvider } from "./context/PortfolioContext";
import { EducationProvider } from "./context/EducationContext";

import EducationPage from "./pages/EducationPage";
import WorkPage from "./pages/WorkPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import DynamicPage from "./pages/DynamicPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPagesPage from "./pages/admin/AdminPagesPage";
import AdminProjectsPage from "./pages/admin/AdminProjectPage";
import AdminWorkPage from "./pages/admin/AdminWorkPage";
import AdminLayoutTemplatesPage from "./pages/admin/AdminLayoutTemplatePage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminEducationPage from "./pages/admin/AdminEducationPage";
import AdminTechnologiesPage from "./pages/admin/AdminTechnologiesPage";

import CreateProjectPage from "./pages/admin/CreateProjectPage";
import CreateWorkPage from "./pages/admin/CreateWorkPage";
import CreatePagePage from "./pages/admin/CreatePagePage";
import CreateEducationPage from "./pages/admin/CreateEducationPage";

import EditWorkPage from "./pages/admin/EditWorkPage";
import EditProjectPage from "./pages/admin/EditProjectPage";
import EditPagePage from "./pages/admin/EditPagePage";
import EditEducationPage from "./pages/admin/EditEducationPage";

export default function App() {
  return (
    <PortfolioProvider>
      <EducationProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/login" element={<LoginPage />} />
            <Route index element={<Navigate to="/about" replace />} />

            {/* Static Interactive Routes */}
            <Route path="/education" element={<EducationPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/projects" element={<ProjectsPage />} />

            {/* Admin Management Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/layout-templates" element={<AdminLayoutTemplatesPage />} />
              <Route path="/admin/projects" element={<AdminProjectsPage />} />
              <Route path="/admin/projects/new" element={<CreateProjectPage />} />
              <Route path="/admin/projects/:id/edit" element={<EditProjectPage />} />
              <Route path="/admin/work" element={<AdminWorkPage />} />
              <Route path="/admin/work/new" element={<CreateWorkPage />} />
              <Route path="/admin/work/:id/edit" element={<EditWorkPage />} />
              <Route path="/admin/pages" element={<AdminPagesPage />} />
              <Route path="/admin/pages/new" element={<CreatePagePage />} />
              <Route path="/admin/pages/:slug/edit" element={<EditPagePage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/education" element={<AdminEducationPage />} />
              <Route path="/admin/education/new" element={<CreateEducationPage />} />
              <Route path="/admin/education/:id/edit" element={<EditEducationPage />} />
              <Route path="/admin/technologies" element={<AdminTechnologiesPage />}/>
            </Route>

            {/* Dynamic Page Engine Route Catch-All */}
            <Route path="/:slug" element={<DynamicPage />} />
          </Route>
        </Routes>
      </EducationProvider>
    </PortfolioProvider>
  );
}
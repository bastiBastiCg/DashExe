import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import PublishedDashboards from "./pages/PublishedDashboards";
import DashboardView from "./pages/DashboardView";
import PresenterDashboards from "./pages/PresenterDashboards";
import PresenterNew from "./pages/PresenterNew";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<PublishedDashboards />} />
          <Route path="/dashboard/:id" element={<DashboardView />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["presenter", "admin"]} />}>
          <Route path="/presenter" element={<PresenterDashboards />} />
          <Route path="/presenter/new" element={<PresenterNew />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App

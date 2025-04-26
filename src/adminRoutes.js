import Dashboard from "pages/Admin/dashboard/Index";
import Users from "pages/Admin/users/Index";

const adminRoutes = [
  {
    name: "Dashboard",
    icon: "fas fa-home",
    route: "dashboard",
    component: <Dashboard />,
  },
  {
    name: "Users",
    icon: "fas fa-users",
    route: "users",
    component: <Users />,
  },
];

export default adminRoutes;

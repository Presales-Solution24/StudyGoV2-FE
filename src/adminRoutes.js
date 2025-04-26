import Dashboard from "pages/Admin/dashboard/Index";
import Users from "pages/Admin/users/Index";
import CategoriesPage from "pages/Admin/categories/Index";

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
  {
    name: "Kategori",
    route: "categories",
    icon: "fas fa-tags",
    component: <CategoriesPage />,
  },
];

export default adminRoutes;

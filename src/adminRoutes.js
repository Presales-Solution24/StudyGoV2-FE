import CategoriesPage from "pages/Admin/categories/Index";
import Dashboard from "pages/Admin/dashboard/Index";
import Users from "pages/Admin/users/Index";
import Products from "pages/Admin/products/Index";
import ProductForm from "pages/Admin/products/ProductForm";

const adminRoutes = [
  {
    key: "dashboard",
    name: "Dashboard",
    icon: "fas fa-home",
    route: "dashboard",
    component: <Dashboard />,
  },
  {
    key: "users",
    name: "Users",
    icon: "fas fa-users",
    route: "users",
    component: <Users />,
  },
  {
    key: "categories",
    name: "Kategori",
    route: "categories",
    icon: "fas fa-tags",
    component: <CategoriesPage />,
  },
  {
    key: "products",
    name: "Products",
    icon: "fas fa-box",
    route: "products",
    component: <Products />,
  },

  // ✅ Tidak ditampilkan di sidebar karena tidak punya name/icon
  {
    key: "products-create",
    route: "products/create",
    component: <ProductForm />,
    hidden: true,
  },
  {
    key: "products-edit",
    route: "products/edit/:id",
    component: <ProductForm />,
    hidden: true,
  },
];

export default adminRoutes;

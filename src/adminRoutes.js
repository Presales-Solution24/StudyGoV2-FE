import CategoriesPage from "pages/Admin/categories/Index";
import CategoryForm from "pages/Admin/categories/categoryForm";
import Dashboard from "pages/Admin/dashboard/Index";
import ProductForm from "pages/Admin/products/ProductForm";
import Products from "pages/Admin/products/Index";
import Users from "pages/Admin/users/Index";

import SpecDefinitionIndex from "pages/Admin/specdefinition/SpecDefinitionIndex";
import SpecDefinitionForm from "pages/Admin/specdefinition/SpecDefinitionForm";
import SpecValueIndex from "pages/Admin/specvalue/SpecValueIndex";

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
    key: "categories-create",
    route: "categories/create",
    component: <CategoryForm />,
    hidden: true,
  },
  {
    key: "products",
    name: "Products",
    icon: "fas fa-box",
    route: "products",
    component: <Products />,
  },
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

  // 👇 Spec Definition routes
  {
    key: "spec-definition",
    name: "Spec Definition",
    route: "spec-definition",
    icon: "fas fa-list-alt",
    component: <SpecDefinitionIndex />,
  },
  {
    key: "spec-definition-create",
    route: "spec-definition/create",
    component: <SpecDefinitionForm />,
    hidden: true,
  },
  {
    key: "spec-definition-edit",
    route: "spec-definition/edit/:id",
    component: <SpecDefinitionForm />,
    hidden: true,
  },

  {
    key: "spec-value",
    name: "Spec Value",
    icon: "fas fa-ruler",
    route: "spec-value",
    component: <SpecValueIndex />,
  },
];

export default adminRoutes;

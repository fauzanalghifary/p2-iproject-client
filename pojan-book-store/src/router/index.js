import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import LoginView from "../views/LoginView.vue";
import WishlistsView from "../views/WishlistsView.vue";
import ProductDetails from "../views/ProductDetails.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/wishlists",
      name: "Wishlists",
      component: WishlistsView,
    },
    {
      path: "/products/:productId",
      name: "Product Detail",
      component: ProductDetails,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("accessToken");
  if (to.name === "Wishlists" && !isAuthenticated) {
    next({ name: "Home" });
  } else if (
    (to.name === "Login" || to.name === "Register") &&
    isAuthenticated
  ) {
    next({ name: "Home" });
  } else next();
});

export default router;
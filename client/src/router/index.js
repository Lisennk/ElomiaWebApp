import { createRouter, createWebHistory } from "vue-router";
import ChatView from "../views/ChatView.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/session",
      name: "chat",
      component: ChatView,
    },
  ],
});

export default router;

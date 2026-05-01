<script>
import SideNavbarComponent from "./shared/components/side-navbar.vue";
export default {
  name: "App",
  components: {
    "side-navbar": SideNavbarComponent,
  },
  data() {
    return {
      sidebarExpanded: false
    };
  },
  computed: {
    showSidebar() {
      const hiddenRoutes = ["sign-in", "sing-up", "not-found"];
      return this.$route && this.$route.name && !hiddenRoutes.includes(this.$route.name);
    }
  }
};
</script>

<template>
  <div class="app-layout">
    <side-navbar v-if="showSidebar" @toggle="sidebarExpanded = $event"></side-navbar>
    <main :class="['main-content', { 'with-sidebar': showSidebar, 'expanded': sidebarExpanded }]">
      <router-view></router-view>
    </main>
    <pv-toast />
    <pv-confirm-dialog />
  </div>
</template>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: "Roboto", sans-serif;
  background-color: #f4ecec;
}

#app {
  min-height: 100vh;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  transition: padding-left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  padding-left: 0;
  width: 100%;
  box-sizing: border-box;
}

.main-content.with-sidebar {
  padding-left: 80px;
}

.main-content.expanded {
  padding-left: 260px;
}
</style>

<template>
  <v-app-bar
    app
    color="blue darken-3"
    dark
    clipped-left
  >
    <v-toolbar-title class="ml-0">
      <v-app-bar-nav-icon @click.stop="toggleMenu()"></v-app-bar-nav-icon>
      <v-btn
        text
        @click="$router.push('/')"
      >{{$store.state.settings.websiteName || 'Home'}}</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  computed: {
    user() {
      return (this.$store.state.auth || {}).user || null;
    }
  },
  methods: {
    toggleMenu() {
      if (this.$store.state.leftMenu) {
        this.showMenu(false);
      } else {
        this.showMenu(true);
      }
    },
    ...mapMutations({ showMenu: "showMenu" })
  }
};
</script>

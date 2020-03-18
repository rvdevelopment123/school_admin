<template>
  <v-app>
    <Leftmenu />
    <Header />
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>
<script>
const Header = () => import("~/components/Header");
const Footer = () => import("~/components/Footer");
const Leftmenu = () => import("~/components/Leftmenu");

export default {
  components: { Header, Leftmenu, Footer }
};
</script>

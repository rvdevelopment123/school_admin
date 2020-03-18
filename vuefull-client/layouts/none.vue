<template>
  <v-app>
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <nuxt />
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
const Footer = () => import("~/components/Footer");

export default {
  components: {
    Footer
  }
};
</script>
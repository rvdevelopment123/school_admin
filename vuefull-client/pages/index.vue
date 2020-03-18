<template>
  <v-layout
    align-center
    justify-center
    wrap
  >
    <v-flex
      v-for="c in cards"
      :key="c.title"
      v-if="c.dashboard"
    >
      <v-card
        :color="c.color"
        dark
        link
        :to="`/${c.href}`"
      >
        <v-card-text class="white--text">
          <div class="headline mb-2">{{c.title}}</div>
          Manage List of {{c.title}} using this VueFull automator
        </v-card-text>

        <v-card-actions>
          <v-btn text>Manage</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import menu from "~/config/menu.json";
export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("shipper"))
      return redirect("/account/login");
  },
  data: () => {
    return {
      data: {},
      cards: menu
    };
  },

  methods: {
    go(to) {
      this.$router.push(to);
    }
  },
  components: {},
  async created() {},
  head() {
    return {
      title: `Dashboard`
    };
  }
};
</script>
<style>
.flex {
  margin: 20px;
}
</style>


<template>
  <v-layout
    align-center
    justify-center
  >
    <v-flex
      xs12
      sm8
      md4
    >
      <login-form-email @hide="go('/')" />
    </v-flex>
  </v-layout>
</template>

<script>
const account = () => import("~/layouts/account");
const loginFormEmail = () => import("~/components/LoginFormEmail");
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({ error: "error" })
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/account/login");
      }
    }
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  },
  components: {
    loginFormEmail
  },
  layout: "none",
  head() {
    return {
      title: "Login your account"
    };
  }
};
</script>

<template>
  <div>
    <v-progress-circular
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
</template>
<script>
export default {
  async created() {
    await this.$store.commit("auth/setToken", this.$route.query.token);
    let user = await this.$axios.$get("users/me");
    await this.$store.commit("auth/setUser", user);
    if (user.role == "user") {
      this.$router.push("/registration-successful");
    } else {
      this.$router.push("/");
    }
  },
  layout: "account",
  head() {
    return {
      title: "Login successful"
    };
  }
};
</script>

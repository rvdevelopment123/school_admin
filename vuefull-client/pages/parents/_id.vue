<template>
  <edit
    :f="f"
    :api="api"
    :heading="heading"
    :id="$route.params.id"
  ></edit>
</template>

<script>
const Edit = () => import("~/components/Edit");
import { fields, api, heading } from "./config";

export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  data: () => {
    return { api, heading, f: fields, id: {} };
  },
  components: { Edit },
  head() {
    return {
      title: "Edit " + heading
    };
  }
};
</script>

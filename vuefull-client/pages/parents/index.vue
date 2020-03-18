<template>
  <list
    :f="f"
    :api="api"
    :heading="heading"
  ></list>
</template>
<script>
const List = () => import("~/components/List");
import { api, heading, fields } from "./config";
export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user")) {
      return redirect("/account/login");
    }
  },
  data: () => {
    return {
      api,
      heading,
      f: fields
    };
  },
  components: { List },
  head() {
    return {
      title: "Manage " + heading
    };
  }
};
</script>
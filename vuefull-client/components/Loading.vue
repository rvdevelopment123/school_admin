<template>
  <v-dialog
    v-model="thisLoading"
    hide-overlay
    persistent
    width="300"
  >
    <v-card
      color="#4c75a3"
      dark
    >
      <v-card-text>
        Please Wait
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { loadingTimeout } from "~/config";
export default {
  data: () => ({
    thisLoading: false
  }),
  computed: {
    ...mapGetters(["error", "loading"])
  },
  watch: {
    loading(err) {
      clearTimeout(this.loadingTimer);
      let vm = this;
      this.loadingTimer = setTimeout(function() {
        vm.thisLoading = vm.loading;
      }, loadingTimeout);
    }
  },
  methods: {
    start() {
      this.thisLoading = true;
    },
    finish() {
      this.thisLoading = false;
    }
  }
};
</script>

<template>
  <v-footer height="auto">
    <v-container fluid>
      <v-layout
        row
        wrap
        class="baseline"
      >
        <v-flex>

        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      v-if="error"
      :timeout="error.timeout"
      :color="error.color"
      :bottom="true"
      v-model="error.is"
    >
      {{ t(error.msg) }}
      <v-btn
        text
        class="primary"
        @click="$store.commit('clearErr')"
      >{{t('Close')}}</v-btn>
    </v-snackbar>
  </v-footer>
</template>
<script>
import { hu, fr } from "~/i18n/";
import { typingTimeout } from "~/config";
import { mapGetters } from "vuex";
export default {
  locales: { hu, fr },
  computed: {
    error() {
      return this.$store.state.error || {};
    }
  },
  watch: {
    "$store.state.settings.language": {
      async handler(val) {
        this.$translate.setLang(val);
      }
    }
  },
  created() {
    this.$translate.setLang(this.$store.state.settings.language);
  }
};
</script>
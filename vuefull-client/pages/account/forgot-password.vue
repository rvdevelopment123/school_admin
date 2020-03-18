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
      <v-card class="elevation-12">
        <v-toolbar
          color="primary"
          dark
        >
          <v-toolbar-title><b>{{t('FORGOT')}}</b> {{t('PASSWORD')}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form
          novalidate
          @submit.stop.prevent="submit"
          ref="form"
          v-model="valid"
          :lazy-validation="true"
        >
          <v-card-text>
            <v-text-field
              name="email"
              prepend-icon="email"
              :label="t('E-mail')"
              v-model="email"
              :rules="emailRules"
              required
              :error-messages="errors.collect('email')"
            />
          </v-card-text>
          <v-card-actions>
            <Submit
              color="success"
              :loading="loading"
              :disabled="!valid"
              :block="true"
              icon="mail"
              text="Send Email"
              class="mr-4"
              Send
              Reset
              Password
              Email
            />
            <v-btn
              text
              @click="go('/account/login')"
            >
              <v-icon>keyboard_backspace</v-icon>{{t('Back')}}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const Submit = () => import("~/components/Submit");
import { mapGetters } from "vuex";

export default {
  props: {
    id: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      valid: true,
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  computed: {
    ...mapGetters({ error: "error", loading: "loading" })
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    submit() {
      if (!this.email)
        this.$store.commit("setInfo", "Please enter your email id");
      else {
        this.$store.dispatch("auth/forgotPassword", { email: this.email });
      }
    },
    onDismissed() {}
  },
  components: {
    Submit
  },
  created() {
    this.email = this.$route.query.email;
  },
  layout: "none",
  head() {
    return {
      title: "Recovery of Password"
    };
  }
};
</script>
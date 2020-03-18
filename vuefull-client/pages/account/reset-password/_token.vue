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
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          <v-toolbar-title><b>{{t('RESET')}}</b> {{t('PASSWORD')}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form
          @submit.stop.prevent="submit"
          novalidate
          autocomplete="off"
          ref="form"
          v-model="valid"
          :lazy-validation="true"
        >
          <v-card-text>
            <v-text-field
              :label="t('New Password')"
              name="password"
              :type="showPassword?'text':'password'"
              prepend-icon="lock"
              :append-icon="showPassword?'visibility':'visibility_off'"
              @click:append="showPassword=!showPassword"
              v-model="password"
              v-validate="'required'"
              :error-messages="errors.collect('password')"
              autofocus
            ></v-text-field>
            <!-- <v-text-field
              :label="t('Repeat Password')"
              name="confirm"
              :type="showPassword?'text':'password'"
              prepend-icon="lock"
              :append-icon="showPassword?'visibility':'visibility_off'"
              @click:append="showPassword=!showPassword"
              v-model="confirm"
              v-validate="'required'"
              :error-messages="errors.collect('confirm')"
            ></v-text-field> -->
          </v-card-text>
          <v-card-actions>
            <Submit
              color="primary"
              :loading="loading"
              :disabled="!valid"
              block
              rounded
              icon="mail"
              text="Reset Password"
            ></Submit>
            <v-spacer />
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
      showPassword: false,
      valid: true,
      token: null,
      password: "",
      confirm: ""
    };
  },
  created() {
    this.token = this.$route.params.token;
  },
  computed: {
    ...mapGetters({ error: "error", loading: "loading" })
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    submit() {
      this.$store.dispatch("auth/resetPassword", {
        id: this.token,
        password: this.password
      });
    }
  },
  components: {
    Submit
  },
  head() {
    return {
      title: "Reset Password"
    };
  },
  layout: "none"
};
</script>

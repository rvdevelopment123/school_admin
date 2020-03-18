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
          <v-toolbar-title><b>{{t('SIGN UP')}}</b> {{t('NEW ACCOUNT')}}</v-toolbar-title>
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
              prepend-icon="mail_outline"
              :label="t('E-mail')"
              v-model="email"
              :rules="emailRules"
              required
              :error-messages="errors.collect('email')"
            />
            <v-text-field
              name="firstName"
              prepend-icon="arrow_right_alt"
              :label="t('First Name')"
              v-model="firstName"
              required
              :error-messages="errors.collect('firstName')"
            />
            <v-text-field
              name="lastName"
              prepend-icon="arrow_right_alt"
              :label="t('Last Name')"
              v-model="lastName"
              required
              :error-messages="errors.collect('lastName')"
            />
            <v-text-field
              name="password"
              prepend-icon="lock_outline"
              :append-icon="showPassword?'visibility':'visibility_off'"
              @click:append="showPassword=!showPassword"
              color="primary"
              :type="showPassword?'text':'password'"
              v-model="password"
              v-validate="'required'"
              :error-messages="errors.collect('password')"
              :label="t('Password')"
            />
          </v-card-text>
          <v-card-actions>
            <Submit
              color="success"
              :loading="loading"
              :disabled="!valid"
              :block="true"
              icon="vpn_key"
              text="Sign Up"
              class="mr-4"
            />
            <v-spacer></v-spacer>
            <v-btn
              class="mr-4"
              color="info"
              text
              :to="'/account/login'"
            >{{t('Login')}}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const account = () => import("~/layouts/account");
const Submit = () => import("~/components/Submit");
const OauthButtons = () => import("~/components/OauthButtons");
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "vendor",
      loading: false,
      showPassword: false,
      valid: true,
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  computed: {
    ...mapGetters({ error: "error" })
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/registration-successful");
      }
    }
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    async submit() {
      try {
        const data = await this.$store.dispatch("auth/signup", {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          role: this.role
        });
        if (data) {
          this.$store.commit("setSuccess", {msg:"Signup Successful"});
          this.$router.push("/");
        }
      } catch (err) {}
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  },
  components: {
    Submit,
    OauthButtons
  },
  layout: "none",
  head() {
    return {
      title: "Create a new account"
    };
  }
};
</script>
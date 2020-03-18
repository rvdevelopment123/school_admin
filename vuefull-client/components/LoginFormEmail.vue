<template>
  <v-card class="elevation-12">
    <v-toolbar
      color="primary"
      dark
    >
      <v-toolbar-title><b>{{t('SIGN IN')}}</b> {{t('TO YOUR ACCOUNT')}}</v-toolbar-title>
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

        <v-text-field
          name="password"
          prepend-icon="lock"
          :append-icon="showPassword?'visibility':'visibility_off'"
          @click:append="showPassword=!showPassword"
          color="primary"
          :type="showPassword?'text':'password'"
          v-model="password"
          v-validate="'required'"
          :error-messages="errors.collect('password')"
          :label="t('Password')"
        />
        <div class="fxr">
          <v-btn
            class="forgot-password"
            color="error"
            text
            link
            :to="'/account/forgot-password?email='+email"
          >{{t('Forgot Password?')}}</v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <Submit
          color="success"
          :loading="loading"
          :disabled="!valid"
          :block="true"
          icon="vpn_key"
          :text="t('Login')"
          class="mr-4"
        />
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          text
          link
          to="/account/signup"
        >{{t('Signup')}}</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
const Submit = () => import("~/components/Submit");
const OauthButtons = () => import("~/components/OauthButtons");
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      showPassword: false,
      userExists: undefined,
      valid: true,
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      email: "admin@codenx.com",
      password: "codenx"
    };
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
    async submit() {
      let data;
      if (this.password === "") {
        this.$store.commit("setErr", "Please enter your Password");
        return;
      }
      try {
        this.loading = true;
        data = await this.$store.dispatch("auth/login", {
          email: this.email,
          password: this.password
        });
        if (!!data) {
          this.$emit("hide");
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    close() {
      this.show = false;
      this.$emit("hide");
    }
  },
  components: {
    Submit,
    OauthButtons
  }
};
</script>
<style scoped>
.fxr {
  display: flex;
  justify-content: flex-end;
}
.forgot-password {
  font-size: 0.5rem;
  margin-top: -1rem;
}
</style>

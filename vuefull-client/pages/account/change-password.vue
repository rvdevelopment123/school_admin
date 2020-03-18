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
          <v-toolbar-title><b>{{t('CHANGE')}}</b> {{t('PASSWORD')}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="$router.go(-1)"
          >
            <v-icon>keyboard_backspace</v-icon>
          </v-btn>
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
              :type="showOldPassword?'text':'password'"
              prepend-icon="lock"
              :append-icon="showOldPassword?'visibility':'visibility_off'"
              @click:append="showOldPassword=!showOldPassword"
              v-model="password.oldPassword"
              name="oldPassword"
              v-validate="'required'"
              :error-messages="errors.collect('oldPassword')"
              autofocus
              :label="t('Current Password')"
            ></v-text-field>
            <v-text-field
              :type="showNewPassword?'text':'password'"
              prepend-icon="lock"
              :append-icon="showNewPassword?'visibility':'visibility_off'"
              @click:append="showNewPassword=!showNewPassword"
              v-model="password.newPassword"
              name="newPassword"
              v-validate="'required'"
              :error-messages="errors.collect('newPassword')"
              :label="t('New Password')"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <submit
              color="primary"
              :loading="loading"
              :disabled="!valid"
              :block="true"
              icon="vpn_key"
              text="Submit"
            ></submit>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const Submit = () => import("~/components/Submit");

export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  data() {
    return {
      showOldPassword: false,
      showNewPassword: false,
      valid: true,
      loading: false,
      password: { oldPassword: "", newPassword: "" }
    };
  },
  methods: {
    async submit() {
      if (!this.password || this.password.oldPassword === "") {
        this.$store.commit("setWarning", "Current Password can not be blank");
        return;
      } else if (!this.password || this.password.newPassword === "") {
        this.$store.commit("setWarning", "New Password can not be blank");
        return;
      }
      try {
        let res = await this.$store.dispatch(
          "auth/changePassword",
          this.password
        );
      } catch (e) {}
    }
  },
  components: { Submit },
  head() {
    return {
      title: "Change Password"
    };
  },
  layout: "account"
};
</script>
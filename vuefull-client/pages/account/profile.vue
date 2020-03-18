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
          <v-toolbar-title><b>{{t('UPDATE')}}</b> {{t('PROFILE')}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="$router.go(-1)"
          >
            <v-icon>keyboard_backspace</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form
          @submit.stop.prevent="save(profile)"
          novalidate
          autocomplete="off"
          ref="form"
          v-model="valid"
          :lazy-validation="true"
        >
          <v-card-text>
            <v-text-field
              name="firstName"
              autofocus
              v-model="profile.firstName"
              :label="t('First Name')"
              prepend-icon="arrow_right_alt"
              icon="face"
              v-validate="'required'"
              :error-messages="errors.collect('firstName')"
            ></v-text-field>
            <v-text-field
              name="lastName"
              v-model="profile.lastName"
              :label="t('Last Name')"
              prepend-icon="arrow_right_alt"
              icon="face"
              v-validate="'required'"
              :error-messages="errors.collect('lastName')"
            ></v-text-field>
            <v-text-field
              disabled
              name="email"
              v-model="profile.email"
              :label="t('Email')"
              prepend-icon="mail_outline"
              icon="face"
              v-validate="'required|email'"
              :error-messages="errors.collect('email')"
            ></v-text-field>
            <v-text-field
              name="phone"
              v-model="profile.phone"
              prepend-icon="phone"
              :label="t('Phone No')"
              v-validate="'max:10|numeric'"
              :error-messages="errors.collect('phone')"
            >
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <submit
              :loading="loading"
              :disabled="!valid"
              :block="true"
              icon="save"
              text="Update"
              color="primary"
            ></submit>
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
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user"))
      return redirect("/account/login");
  },
  data() {
    return {
      valid: true,
      profile: {},
      user: null,
      showImageModal: false
    };
  },
  async created() {
    let userDetails = await this.$store.dispatch("auth/fetch");
    this.profile = Object.assign({}, userDetails);
  },
  computed: {
    ...mapGetters({ loading: "loading" })
  },
  methods: {
    save(profile) {
      try {
        this.$store.dispatch("auth/updateProfile", profile);
      } catch (e) {}
    }
  },
  components: { Submit },
  layout: "account",
  head() {
    return {
      title: "Update profile"
    };
  }
};
</script>


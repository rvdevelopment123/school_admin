<template>
  <v-form
    novalidate
    @submit.stop.prevent="save(settings)"
    ref="form"
    v-model="valid"
    :lazy-validation="true"
    v-if="settings"
  >
    <v-container fluid>

      <v-card>
        <h3>
          <v-toolbar class="orange white--text">&nbsp;&nbsp;&nbsp;{{t('Shop Settings')}}</v-toolbar>
        </h3>
        <v-card-text>
          <v-text-field
            :label="t('Website Name')"
            v-model="settings.websiteName"
          />
          <v-text-field
            :label="t('Shop Email')"
            v-model="settings.shopEmail"
          />
          <v-text-field
            :label="t('Email From')"
            v-model="settings.emailFrom"
          />
          <v-text-field
            :label="t('Shop Phone')"
            v-model="settings.shopPhone"
          />
          <v-text-field
            :label="t('Shop Address')"
            v-model="settings.shopAddress"
          />
          <v-text-field
            :label="t('Country')"
            v-model="settings.country"
          />
          <v-text-field
            :label="t('Language')"
            v-model="settings.language"
          />
          <v-text-field
            :label="t('Page Size')"
            v-model="settings.pageSize"
          />
          <v-text-field
            :label="t('CDN Url')"
            v-model="settings.CDN_URL"
          />
          <v-text-field
            :label="t('Title')"
            v-model="settings.title"
          />
          <v-text-field
            :label="t('Description')"
            v-model="settings.description"
          />
          <v-text-field
            :label="t('Keywords')"
            v-model="settings.keywords"
          />
        </v-card-text>
        <v-card-actions>
          <Submit
            color="success"
            :loading="loading"
            :block="true"
            icon="save"
            text="Save"
            class="mr-4"
            :disabled="!valid"
          />
        </v-card-actions>
      </v-card>
    </v-container>
  </v-form>
</template>
<script>
const Submit = () => import("~/components/Submit");
export default {
  data() {
    return {
      valid: false,
      loading: false,
      settings: {}
    };
  },
  async created() {
    try {
      this.loading = true;
      this.settings = await this.$axios.$get("settings/admin");
      this.loading = false;
    } catch (e) {
      this.loading = false;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async save(item) {
      try {
        this.$store.commit("demo", "unable to save changes", { root: false });
      } catch (e) {
        return e;
      }
      try {
        let itemCopy = { ...item };
        this.loading = true;
        let result = await this.$axios.$put("settings/" + item._id, itemCopy);
        this.$store.commit("setSuccess", { msg: "Settings Updated" });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$store.commit("setErr", e);
      } finally {
        this.loading = false;
      }
    }
  },
  components: { Submit }
};
</script>


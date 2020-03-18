<template>
  <div style="width: 100%">
    <v-btn
      :color="color"
      :block="block"
      :rounded="rounded"
      :disabled="loading || disabled"
      :loading="loading"
      type="submit"
    >
      <v-icon>{{icon}}</v-icon>
      &nbsp;
      <span>{{text}}</span>
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: {
    loading: Boolean,
    disabled: Boolean,
    rounded: Boolean,
    block: Boolean,
    form: String,
    icon: String,
    text: String,
    color: String
  }
};
</script>

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
          <v-toolbar-title v-if="id==='new'">{{t('Add')}} &nbsp;{{heading | titlecase}}</v-toolbar-title>
          <v-toolbar-title v-else>{{t('Edit')}} &nbsp;{{heading | titlecase}} - <span style="font-size:12px">{{id}}</span></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="$router.go(-1)"
          >
            <v-icon>keyboard_backspace</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form
          novalidate
          @submit.stop.prevent="save(newRecord)"
          ref="form"
          v-model="valid"
          :lazy-validation="true"
        >
          <v-card-text>
            <div
              v-for="(f,ix) in f"
              :key="ix"
              v-if="!f.noEdit"
            >
              <v-switch
                inset
                color="pink"
                v-model="newRecord[f.value]"
                v-if="f.type==='boolean'"
                :label="f.text"
                :disabled="f.disabled"
              >{{f.text | titlecase}}</v-switch>
              <v-checkbox
                inset
                color="pink"
                v-model="newRecord[f.value]"
                v-else-if="f.type==='boolean-checkbox'"
                :label="f.text"
                :disabled="f.disabled"
              >{{f.text | titlecase}}</v-checkbox>
              <single-image-upload
                v-else-if="f.type==='image'"
                :image="newRecord[f.value]"
                :name="f.value"
                :folder="api"
                @remove="saveImage(f.value,'');"
                @save="saveImage"
              />
              <v-menu
                v-else-if="f.type==='date'"
                ref="menu"
                :close-on-content-click="false"
                v-model="menu"
                :nudge-right="40"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    slot="activator"
                    :value="newRecord[f.value] | date"
                    :label="f.text"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                </template>
                <div v-if="newRecord[f.value]">
                  <v-date-picker
                    :value="new Date(newRecord[f.value]).toISOString().substr(0,10)"
                    @change="dateChanged(f.value,$event)"
                  />
                  <v-time-picker
                    :value="new Date(newRecord[f.value]).toString().substr(16,5)"
                    @input="timeChanged(f.value,$event)"
                  />
                </div>
                <div v-else>
                  <v-date-picker
                    :value="new Date().toISOString().substr(0,10)"
                    @change="dateChanged(f.value,$event)"
                  />
                  <v-time-picker
                    :value="new Date().toString().substr(16,5)"
                    @input="timeChanged(f.value,$event)"
                  />
                </div>
              </v-menu>
              <div v-else>
                <v-select
                  v-bind:items="f.options"
                  v-model="newRecord[f.value]"
                  :label="f.text"
                  menu-props="bottom"
                  v-if="f.type=='select'"
                  :disabled="f.disabled"
                ></v-select>
                  <v-select
                  v-bind:items="parents"
                  v-model="newRecord[f.value]"
                  :label="f.text"
                  menu-props="bottom"
                  v-else-if="f.type=='selectParent'"
                  :disabled="f.disabled"
                ></v-select>
                <v-combobox
                  v-else-if="f.type=='array'"
                  v-model="newRecord[f.value]"
                  :label="f.text"
                  multiple
                  persistent-hint
                  small-chips
                >
                </v-combobox>
                <div v-else-if="f.type=='deeparray'">
                  <h3>{{f.text}}</h3>
                  <div
                    v-for="(i,ix) in newRecord[f.value]"
                    :key="ix+'deep'"
                  >
                    <span
                      v-for="(v,k,ixx) in i"
                      :key="ixx"
                    >
                      <input
                        type="text"
                        :label="k"
                        v-model="i[k]"
                      />
                    </span>
                  </div>
                </div>
                <v-textarea
                  :label="f.text"
                  :name="f.value"
                  v-model="newRecord[f.value]"
                  v-else-if="f.type==='textarea'"
                  :rows="3"
                  :rowsMax="6"
                  :disabled="f.disabled"
                >
                </v-textarea>
                <v-text-field
                  :label="f.text"
                  v-model="newRecord[f.value]"
                  v-else-if="f.type==='hidden'"
                  v-show=" false"
                  :autofocus="ix===0"
                ></v-text-field>
                <v-text-field
                  :label="f.text"
                  :name="f.value"
                  v-validate="'required|numeric'"
                  :error-messages="errors.collect(f.value)"
                  v-model="newRecord[f.value]"
                  v-else-if="f.type==='number'"
                  :autofocus="ix===0"
                  :disabled="f.disabled"
                >
                </v-text-field>
                <v-text-field
                  :label="f.text"
                  :name="f.value"
                  v-validate="'required|decimal'"
                  :error-messages="errors.collect(f.value)"
                  v-model="newRecord[f.value]"
                  v-else-if="f.type==='decimal'"
                  :autofocus="ix===0"
                  :disabled="f.disabled"
                >
                </v-text-field>
                <v-text-field
                  :label="f.text"
                  :name="f.value"
                  v-validate="'required'"
                  :error-messages="errors.collect(f.value)"
                  v-model="newRecord[f.value]"
                  v-else-if="f.required===true"
                  :autofocus="ix===0"
                  :disabled="f.disabled"
                >
                </v-text-field>
                <div v-else-if="f.type=='emailmask' || f.type=='phonemask'"></div>
                <v-text-field
                  :label="f.text"
                  :name="f.value"
                  v-model="newRecord[f.value]"
                  :error-messages="errors.collect(f.value)"
                  v-else
                  :autofocus="ix===0"
                  :disabled="f.disabled"
                >
                </v-text-field>
              </div>
            </div>
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
            <v-spacer></v-spacer>
            <v-btn
              class="mr-4"
              text
              @click="$router.go(-1)"
            >{{t('Cancel')}}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
const Submit = () => import("./Submit");
const SingleImageUpload = () => import("./SingleImageUpload");
import Filter from "~/filters/";
export default {
  props: {
    f: {
      type: Array,
      required: true,
      default: []
    },
    api: {
      type: String,
      required: true,
      default: ""
    },
    heading: {
      type: String,
      required: false,
      default: ""
    },
    id: {
      type: String,
      required: true,
      default: ""
    }
  },
  data() {
    return {
      valid: true,
      menu: "",
      date: new Date().toISOString().substr(0, 10),
      loading: false,
      newRecord: {},
      parents: []
    };
  },
  methods: {
    dateChanged(key, value) {
      this.newRecord[key] = value;
    },
    timeChanged(key, value) {
      let newDate = new Date(this.newRecord[key]);
      let hours = value.substr(0, 2);
      let minutes = value.substr(3, 2);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      this.newRecord[key] = newDate;
    },
    saveImage(name, img) {
      try {
        this.newRecord[name] = img;
        this.save(this.newRecord);
      } catch (e) {
        this.$store.commit("setErr", e);
      }
    },
    async save(item) {
      try {
        this.$store.commit("demo", "unable to save changes", { root: true });
      } catch (e) {
        return e;
      }
      try {
        let itemCopy = { ...item };
        let result;
        this.loading = true;
        if (this.id === "new") {
          result = await this.$axios.$post(this.api, itemCopy);
        } else {
          delete itemCopy._id;
          result = await this.$axios.$put(this.api + "/" + this.id, itemCopy);
        }
        this.loading = false;
        this.$emit("saved");
        this.$router.go(-1);
      } catch (e) {
        this.loading = false;
        this.$store.commit("setErr", e);
      }
    }
  },
  async created() {
    let tempParents = await this.$axios.$get("parents");
    this.parents = tempParents.data.map(function(item){
      return item.first+" "+item.last;
    })
    console.info(this.parents)
    if (this.id === "new" || this.id === null) {
      this.newRecord = {};
      return;
    } else {
      try {
        this.$store.commit("busy", true);
        let data = await this.$axios.$get(this.api + "/" + this.id);
        if (data) {
          this.newRecord = data;
        }
        this.$store.commit("busy", false);
      } catch (e) {
        this.$store.commit("busy", false);
      } finally {
        this.$store.commit("busy", false);
      }
    }
  },
  destroyed() {
    this.newRecord = {};
  },
  components: { Submit, SingleImageUpload }
};
</script>

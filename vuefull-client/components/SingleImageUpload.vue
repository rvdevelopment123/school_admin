<template>
  <v-container>
    <v-card
      max-width="375"
      class="mx-auto"
    >
      <v-img
        v-if="image"
        :src="$store.state.settings.CDN_URL+image"
        height="300px"
        dark
      >
        <v-layout
          column
          fill-height
        >
          <v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              fab
              dark
              small
              color="pink"
              @click="removeImage(image)"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-title class="white--text pl-12 pt-12">
            <div class="display-1 pl-12 pt-12">{{name}}</div>
          </v-card-title>
        </v-layout>
      </v-img>
      <form
        enctype="multipart/form-data"
        novalidate
        v-else
      >
        <div class="dropbox">
          <input
            type="file"
            name="photos"
            :disabled="isSaving"
            @change="filesChange($event.target.name, $event.target.files,name); fileCount = $event.target.files.length"
            accept="image/*"
            class="input-file"
          >
          <p v-if="isInitial">
            {{t('Drag your')}} {{name}} here to upload<br> or click to browse
          </p>
          <p v-if="isSaving">
            {{t('Uploading')}}{{ fileCount }} {{t('files...')}}
          </p>
          <p v-if="isSuccess">
            {{ fileCount }} {{t('files uploaded successfully...')}}
          </p>
          <p v-if="isFailed">
            {{t('Upload failed. Please')}} <a @click="currentStatus=0">{{t('try again')}}</a>
          </p>
        </div>
      </form>
    </v-card>
  </v-container>
</template>

<script>
const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;
export default {
  // name required for removing
  props: {
    image: { type: String, required: true, default: "" },
    name: { type: String, required: true },
    folder: { type: String, required: true },
    crunch: { type: Boolean, default: false },
    maxWidth: ""
  },
  data() {
    return {
      currentStatus: 0,
      img: this.image
    };
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    imgPath(i) {
      return `${i}?a=${Math.random()}`;
    },
    save(imagePath) {
      this.img = imagePath;
      this.$emit("save", this.name, imagePath);
    },
    removeImage(img) {
      let vm = this;
      this.$swal({
        title: "Delete image?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          vm.deleteConfirmed(img);
        }
      });
    },
    async deleteConfirmed(img) {
      this.img = "";
      await this.$axios.$delete("media/single", {
        data: { img: img }
      });
      this.$emit("remove", this.name);
    },
    filesChange(fieldName, fileList, name) {
      const formData = new FormData();
      if (!fileList.length) return;
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });
      this.saveImage(formData, name);
    },

    async saveImage(formData, name) {
      try {
        this.currentStatus = 1;
        let x = await this.$axios.$post(
          "media/nocrunch/" + this.folder,
          formData
        ); // When name is passed, it acts as logo upload. Where it uploads to img directory and replaces the original file rather than adding it to the uploads directory
        const path = x[0]; // Where the variable is assigned
        this.currentStatus = 2;
        this.save(path); // Save the image against api
      } catch (e) {
        this.currentStatus = 3;
        this.err(e);
      }
    },
    err(e) {
      this.$store.commit("setErr", e);
    }
  }
};
</script>

<style scoped>
.dropbox {
  outlined: 2px dashed grey;
  outlined-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px;
  position: relative;
  cursor: pointer;
}
.input-file {
  opacity: 0;
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}
.dropbox:hover {
  background: lightblue;
}
.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>

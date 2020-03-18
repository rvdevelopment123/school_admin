<template>
  <list
    :f="f"
    :api="api"
    :heading="heading"
    :filters="filters"
  ></list>
</template>
<script>

const List = () => import("~/components/List");
import { api, heading, fields,mylevel } from "./config";
export default {
  fetch({ store, redirect }) {
    if (!store.getters["auth/hasRole"]("user")) {
      return redirect("/account/login");
    }
  },
   data: () => {
    return {
      api,
      heading,
      f: fields,
      filters: []
    };
  },
  created(){
    var self = this
      // let tempParents =  this.$axios.$get("parents");
      // console.info(console.info());
     let sections =  this.$axios.get('students/mysection')
      .then(function (response) {
        // handle success
        console.log("Response");
        let section = response.data.map(function(item){
          return item
        })
        let entrysection = {"type":"section","data":section,"selected":section}
        self.filters.push(entrysection)
          let entrylevel = {"type":"level","data":mylevel,"selected":mylevel}
        self.filters.push(entrylevel)
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    // this.filters = tempParents.data.map(function(item){
    //   return item.first+" "+item.last;
    // })
    //this.filters 
  },
 
  components: { List },
  head() {
    return {
      title: "Manage " + heading
    };
  }
};
</script>
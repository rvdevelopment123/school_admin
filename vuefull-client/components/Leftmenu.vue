<template>
  <v-navigation-drawer
    v-model="drawer"
    :clipped="$vuetify.breakpoint.lgAndUp"
    src="/bg.webp"
    absolute
    dark
    app
  >
    <v-list
      dense
      nav
      class="py-0"
    >
      <v-list-item
        two-line
        v-if="user"
      >
        <v-list-item-avatar>
          <img
            src="/boy.png"
            alt=""
          >
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{user.firstName}}</v-list-item-title>
          <v-list-item-subtitle
            class="cursor"
            @click="$router.push('/account/profile')"
          >{{user.email}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <template v-for="(item,index) in menus">
        <v-list-item
          v-if="item.href"
          :key="item.title"
          link
          :to="`/${item.href}`"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }} &nbsp; &nbsp;</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider
          v-else-if="item.divider"
          :key="index"
        ></v-divider>
        <v-subheader
          v-else-if="item.header"
          :key="item.header"
        >
          {{ item.header }}
        </v-subheader>
      </template>
    </v-list>
    <v-divider />
    <v-subheader>
      Settings
    </v-subheader>
    <v-list
      dense
      nav
      class="py-0"
    >
      <v-list-item
        link
        to="/users"
      >
        <v-list-item-icon>
          <v-icon>face</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list
      dense
      nav
      class="py-0"
    >
      <v-list-item
        link
        to="/settings"
      >
        <v-list-item-icon>
          <v-icon>settings</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list
      dense
      nav
      class="py-0"
    >
      <v-list-item
        link
        to="/account/change-password"
      >
        <v-list-item-icon>
          <v-icon>lock</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Change Password</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list
      dense
      nav
      class="py-0"
    >
      <v-list-item
        link
        to="/account/profile"
      >
        <v-list-item-icon>
          <v-icon>person</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list
      dense
      nav
      class="py-0"
    >
      <v-list-item @click="logout()">
        <v-list-item-icon>
          <v-icon>lock_open</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapMutations } from "vuex";
import menu from "~/config/menu.json";
export default {
  data: () => ({
    link: {},
    menus: menu,
    mini: false,
    scrollSettings: {
      maxScrollbarLength: 160
    }
  }),
  computed: {
    user() {
      return (this.$store.state.auth || {}).user || null;
    },
    drawer: {
      get: function() {
        return this.$store.state.leftMenu;
      },
      set: function(value) {
        this.showMenu(value);
      }
    }
  },
  props: {
    showDrawer: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push("/account/login");
    },
    hasRole(role) {
      return this.$store.getters["auth/hasRole"](role);
    },
    ...mapMutations({ showMenu: "showMenu" })
  },
  created() {
    if (this.$vuetify.breakpoint.lgAndUp) {
      this.drawer = true;
    }
  }
};
</script>
<style>
.v-application a {
  color: #fff !important;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgb(161, 160, 160);
  border-radius: 8px;
}
::webkit-scrollbar-thumb:hover {
  background: rgb(161, 160, 160);
}
</style>

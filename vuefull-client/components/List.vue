<template>
  <v-container fluid>
    <v-layout column>
      <div class="text-xs-center pt-2">
        <v-pagination
          v-if="noOfPages>1"
          v-model="currentPage"
          @input="changePage(currentPage)"
          :length="noOfPages"
          :total-visible="10"
          circle
        ></v-pagination>
      </div>
      <v-spacer />
      <v-card>
        <v-card-title>
          {{ heading | titlecase}}
          <v-spacer></v-spacer>
          <a
            nuxt
            :href="'/api/'+api+'/export'"
            v-if="!no.export"
          ><img
              src="/excel.png"
              alt=""
            /> </a>
          <v-text-field
            prepend-inner-icon="search"
            append-icon="close"
            @click:append="hideFilterBox"
            :label="t('Search')"
            text
            v-model="filterInput"
            autofocus
          />
        </v-card-title>
        
        <v-row>
         <v-col v-for="(item,index) in filters" :key="index" cols="10" sm="10">
          <v-select
            v-model="item.selected"
            :items="item.data"
            chips
            :label="item.type"
            multiple
            outlined
            @blur="filterData"
          >
          </v-select>
        </v-col>
        </v-row>
        <!-- {{filters}} -->
        <v-data-table
          :headers="listFields"
          :items="data"
          hide-default-header
          hide-default-footer
          class="elevation-1"
          disable-pagination
          :loading="$store.state.loading"
        >
          <template v-slot:header="{ props: { headers } }">
            <thead class="v-data-table-header">
              <tr>
                <th style="text-align:center;">
                  <span v-if="!no.action">Action</span>
                </th>
                <th
                  style="text-align:left;"
                  v-for="header in headers"
                  :key="header.text"
                  :class="['text-start sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '']"
                  @click="sort(header.value)"
                >
                  {{ header.text | titlecase}}
                  <v-icon
                    small
                    v-if="sortBy==header.value && !descending"
                  >arrow_downward</v-icon>
                  <v-icon
                    small
                    v-else-if="sortBy==header.value && descending"
                  >arrow_upward</v-icon>
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:body="{ items }">
            <tbody>
              <tr
                v-for="(item,ix) in data"
                :key="ix"
              >
                <td>
                  <span>
                    <v-icon
                      small
                      class="mr-2"
                      @click="go(item._id)"
                      v-if="!no.edit"
                    >
                      edit
                    </v-icon>
                    <v-icon
                      small
                      @click="clone1(item)"
                      v-if="!no.clone"
                    >
                      content_copy
                    </v-icon>
                    <v-icon
                      small
                      @click="remove(item._id)"
                      v-if="!no.delete"
                    >
                      delete
                    </v-icon>
                  </span>
                </td>
                <td
                  v-for="(f,ix) in listFields"
                  :key="ix"
                >
                  <v-switch
                    v-if="f.type==='boolean'"
                    v-model="item[f.value]"
                    color="pink"
                    inset
                    disabled
                  ></v-switch>
                  <v-checkbox
                    v-else-if="f.type==='boolean-checkbox'"
                    v-model="item[f.value]"
                    disabled
                    color="success"
                  ></v-checkbox>
                  <v-chip
                    v-else-if="f.type==='boolean-label'"
                    label
                    :color="parse(item,f.value)?'green':'red'"
                    text-color="white"
                  >{{parse(item,f.value)?'Active':'Inactive'}}</v-chip>
                  <v-chip
                    v-else-if="f.type==='payment'"
                    label
                    :color="parse(item,f.value)==='Paid'?'green':'red'"
                    text-color="white"
                  >{{parse(item,f.value)}}</v-chip>
                  <router-link
                    v-else-if="f.type==='detail'"
                    :to="api+'/'+item['_id']"
                  >Detail</router-link>
                  <router-link
                    v-else-if="f.type==='url'"
                    :to="url"
                  >{{parse(item,f.value)}}</router-link>
                  <span v-else-if="f.type==='array'">
                    <div
                      v-for="(i,ix) in parse(item,f.value)"
                      :key="ix+'a'"
                    >
                      <v-chip>{{i}}</v-chip>
                    </div>
                  </span>
                  <span v-else-if="f.type==='deeparray'">
                    <div
                      v-for="(i,ix) in parse(item,f.value)"
                      :key="ix+'d'"
                    >
                      <v-chip
                        v-for="(v,k,ixx) in i"
                        :key="ixx+'x'"
                      >{{v}}</v-chip>
                    </div>
                  </span>
                  <span v-else-if="f.type==='date'">{{ parse(item,f.value) | date}}</span>
                  <span v-else-if="f.type==='currency'">{{ parse(item,f.value) | currency}}</span>
                  <span v-else-if="f.type==='phonemask'">{{ parse(item,f.value) | mask(3)}}</span>
                  <span v-else-if="f.type==='emailmask'">{{ parse(item,f.value) | mask(6)}}</span>
                  <v-avatar v-else-if="f.type==='image'">
                    <img
                      :src="$store.state.settings.CDN_URL+parse(item,f.value)"
                      v-if="parse(item,f.value) && parse(item,f.value)!=''"
                      @error="setListImage(parse(item,f.value))"
                      alt=""
                    >
                    <list-image
                      :text="item.name"
                      size="small"
                      v-else
                    />
                  </v-avatar>
                  <span v-else-if="f.type==='nested'"> <span>{{parseNested(item,f.value)}}</span></span>
                  <span v-else>{{ parse(item,f.value) }}</span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card>
    </v-layout>
    <v-btn
      color="pink"
      fab
      dark
      bottom
      right
      fixed
      nuxt
      :to="'/'+api+'/new'"
      v-if="!no.add"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>
<script>
import basic from "~/mixins/basic";

export default {
   data: () => ({
   
    }),
  mixins: [basic],
  props: {
    page: 1,
    f: {},
    no: {
      type: Object,
      default() {
        return {};
      }
    },
    api: "",
    apiQ: "",
    heading: "",
    filters: ""
  }
};
</script>

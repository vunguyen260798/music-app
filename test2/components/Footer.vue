<template>
  <v-footer
    dark
    padless
  >
    <!-- <v-card
      flat
      tile
      class="indigo lighten-1 white--text text-center"
    > -->
      <v-row>
        <v-col cols="4">123</v-col>
        <v-col cols="4">ádf</v-col>
        <v-col cols="4">adsf</v-col>
      </v-row>
      <v-row>
        <v-cols>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-card-text>
        </v-cols>
      </v-row> 
    <!-- </v-card> -->
  </v-footer>
</template>

<script>
export default {
    name:"footer-custom"
    
}
</script>
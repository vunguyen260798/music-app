<template>
  <v-app dark>
    <nav-bar/>
    <nuxt/>
    <footer-custom/>
  </v-app>
</template>

<script>
import NavBar from "../components/NavBar"
import FooterCustom from "../components/Footer"
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  components:{
    NavBar,
    FooterCustom
  }
}
</script>

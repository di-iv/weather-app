import Vue from 'vue'
import VueRouter from 'vue-router'
import Weather from '../components/Weather.vue'
import WeatherItem from '../components/WeatherItem.vue'

Vue.use(VueRouter)

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Weather
    },
    {
      path: '/:id',
      name: 'item',
      component: WeatherItem
    },
    {
      path: '/:id*',
      name: 'note found',
      component: Weather
    }
  ]
  
  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })

export default router
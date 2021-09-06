import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        fullForecast: JSON.parse((localStorage.fullForecast) || '[]'),
        cityName: JSON.parse((localStorage.cityName) || '[]'),
        shortForecast: JSON.parse((localStorage.shortForecast) || '[]'),
        nowWeather: JSON.parse((localStorage.nowWeather) || '[]'),
    },
    mutations: {
        fullForecast(state, {newForecast, cityName}){
            state.fullForecast = newForecast
            localStorage.fullForecast = JSON.stringify(state.fullForecast)
            state.cityName = cityName
            localStorage.cityName = JSON.stringify(state.cityName)
        },
        shortForecast(state, newShortForecast){
            state.shortForecast = newShortForecast
            localStorage.shortForecast = JSON.stringify(state.shortForecast)
        },
        nowWeather(state, newNowWeather){
            state.nowWeather = newNowWeather
            localStorage.nowWeather = JSON.stringify(state.nowWeather)
        }
    },
    actions: {
        fullForecast({commit}, {newForecast, cityName}){
            commit('fullForecast', {newForecast, cityName})
        },
        shortForecast({commit}, newShortForecast){
            commit('shortForecast', newShortForecast)
        },
        nowWeather({commit}, newNowWeather){
            commit('nowWeather', newNowWeather)
        }
    },
    getters: {
        fullForecast: (state) => {
            return state.fullForecast
        },
        shortForecast: (state) => {
            return state.shortForecast
        },
        nowWeather: (state) => {
            return state.nowWeather
        },
        cityName: (state) => {
            return state.cityName
        }
    }
})
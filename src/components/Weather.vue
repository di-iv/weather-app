<template>
<div class="container">
  <div class="search" >
    <input type="text" v-model="query" @keyup.enter="fetchWeather" placeholder="Enter city name..." v-focus>
    <button @click="fetchWeather">
      <span class="fas fa-search"></span>
    </button>    
  </div>

  <div class="city-name" v-if="cityName">
    <i class="fas fa-map-marker-alt"></i><h1>{{cityName}}, {{nowWeather.sys.country}}</h1>
  </div>

  <div class="forecast" v-if="shortForecast">
    <div class="forecast-item now" >
      <router-link :to="{name: 'item', params: {id: 1+'-day'}}">
        <div>Now</div>
        <div class="temp"><span class="bigTemp">{{Math.round(nowWeather.main['temp'])}}&deg;</span><img :src="`https://openweathermap.org/img/wn/${nowWeather.weather[0]['icon']}@2x.png`" alt=""></div>
        <div>{{nowWeatherDate.week}}</div>
        <span class="night"><div>{{nowWeatherDate.date}}</div></span>
      </router-link>
    </div>

    <div class="forecast-item" v-for="(forecast, index) in shortForecast" :key="index">
      <router-link :to="{name: 'item', params: {id: index+2+'-day'}}">
        <div class="temp small"><img :src="`https://openweathermap.org/img/wn/${forecast.img}.png`" alt="">
        {{Math.round(forecast.tempDay)}}&deg;
        <span class="night"><br>{{Math.round(forecast.tempNight)}}&deg;</span>
        </div>
        <div>{{forecast.week}}</div>
        <span class="night"><div>{{forecast.date}}</div></span>
      </router-link>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Weather',
  data(){
    return{
      api_key: 'f6013adc357d259bcaea9db2ac822d1e',
      url_base: 'http://api.openweathermap.org/data/2.5/weather',
      url_base_f: 'http://api.openweathermap.org/data/2.5/forecast',
      query: '',
      sucsess: false,
      sucsess_f: false,
      weather: {},
      forecast: {},
      months: ["Jan", "Feb", "March", "April", "May", "June", "July", 
        "August", "September", "October", "November", "December"],
      weeks: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      days: [],//для краткого прогноза на 5 дней. дата, ср.температура день-ночь(sys.pod(n/d)), иконка
      today: [],
      tomorrow: [],
      thirdDay: [],
      forthDay: [],
      fifthDay: [],
      allDays: []
    }
  },
  mounted(){
    if (this.nowWeatherDate != null){
      let newDate = new Date()
      let today = [
        newDate.getDate(),
        this.months[(newDate.getMonth())]
      ].join(' ')
      if(this.nowWeatherDate.date != today) {
        this.query = this.cityName
        fetch(`${this.url_base}?q=${this.query}&appid=${this.api_key}&units=metric`)
            .then(resp => resp.json())
            .then(data => {
              this.weather = data
              this.$store.dispatch('nowWeather', this.weather)
              if (typeof this.weather.main != 'undefined') {this.sucsess = true}
              this.fetchWeather_f()
        })
      }
    }
  },
  computed:{
    shortForecast(){
      if (this.$store.getters.shortForecast.length == 0) {
        return null
      }else{
        return this.$store.getters.shortForecast
      }
    },
    cityName(){
      if (this.$store.getters.shortForecast.length == 0) {
        return null
      }else{
        return this.$store.getters.cityName
      }
    },
    nowWeather(){
      if (this.$store.getters.nowWeather.length == 0) {
        return null
      }else{
        return this.$store.getters.nowWeather
      }
    },
    nowWeatherDate(){
      if(this.nowWeather != null){
        let newDate = new Date(this.nowWeather.dt*1000)
      let result = [
        newDate.getDate(),
        this.months[(newDate.getMonth())]
      ].join(' ')
      let weekResult = this.weeks[newDate.getDay()]
      return {date: result, week: weekResult}
      }else{
        return null
      }
      
    }
  },
  methods: {
    fetchWeather(){
      fetch(`${this.url_base}?q=${this.query}&appid=${this.api_key}&units=metric`)
        .then(resp => resp.json())
        .then(data => {
          if((data.cod !== '404') && (data.cod !== '400')){
            this.weather = data
            this.$store.dispatch('nowWeather', this.weather)
            if (typeof this.weather.main != 'undefined') {this.sucsess = true}
            this.fetchWeather_f()
          }else this.query = ''
        })
    },
    fetchWeather_f(){
      fetch(`${this.url_base_f}?q=${this.query}&appid=${this.api_key}&units=metric`)
        .then(resp => resp.json())
        .then(this.setResults)
    },
    setResults(data){
      this.query = ''
      this.forecast = data
      if (typeof this.forecast.list != 'undefined') {this.sucsess_f = true}

      let todayDate = new Date().getDate();
      this.today = []
      this.tomorrow = []
      this.thirdDay = []
      this.forthDay = []
      this.fifthDay = []
      this.allDays = []
      this.days = []
      let newDate = new Date()
      let tomorrowDate = new Date(newDate.setDate(todayDate+1)).getDate()
      let thirdDayDate = new Date(newDate.setDate(todayDate+2)).getDate()
      let forthDayDate = new Date(newDate.setDate(todayDate+3)).getDate()
      let fifthDayDate = new Date(newDate.setDate(todayDate+4)).getDate()

      for(let i=0;i<this.forecast.list.length;i++){
        let weatherDate = new Date(this.forecast.list[i]['dt_txt']).getDate()
        if(todayDate==weatherDate){
          this.today.push(this.forecast.list[i])
        }
        if(tomorrowDate==weatherDate){
          this.tomorrow.push(this.forecast.list[i])
          this.tomorrow2 = this.forecast.list[i]
          
        }
        if(thirdDayDate==weatherDate){
          this.thirdDay.push(this.forecast.list[i])
        }
        if(forthDayDate==weatherDate){
          this.forthDay.push(this.forecast.list[i])
        }
        if(fifthDayDate==weatherDate){
          this.fifthDay.push(this.forecast.list[i])
        }        
      }
      this.allDays.push( this.today, this.tomorrow, this.thirdDay, this.forthDay, this.fifthDay)
      this.$store.dispatch('fullForecast', {newForecast: this.allDays, cityName: this.weather.name})
      this.setShortResults()
    },
    setShortResults(){
      let tempDay = [], tempNight = []
      for (let j=1;j<this.allDays.length;j++){
        for(let i=0;i<this.allDays[j].length;i++){
          if (this.allDays[j][i]['sys']['pod'] == 'n'){
            //для краткого прогноза на 5 дней. дата, ср.температура день-ночь(sys.pod(n/d)), иконка
            tempNight.push(Math.round(this.allDays[j][i].main.temp))
          }else {tempDay.push(Math.round(this.allDays[j][i].main.temp))}
          
        }
        let maxTempDay = Math.max.apply(null,tempDay)
        let minTempNight = Math.min.apply(null,tempNight)
        let date = new Date(this.allDays[j][0]['dt_txt'])
        let result = [
            date.getDate(),
            this.months[(date.getMonth())]
        ].join(' ')
        let weekResult = this.weeks[date.getDay()]
        this.days.push({date: result, week: weekResult, tempDay: maxTempDay, tempNight: minTempNight, img: this.allDays[j][4].weather[0].icon})
        this.$store.dispatch('shortForecast', this.days)
        tempDay = []
        tempNight = []
      }    
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  background: rgba(24,24,27,0.6);
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
}
.search{
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 40px 80px 0 0;
}
.search input{
  background-color: rgba(0,0,0,0.4);
  border: none;
  border-radius: 10px;
  color: #fff;
  padding: 7px;
  outline: none;
}
.search button{
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
}
.city-name{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 80px;
  font-size: 1.5em;
}
.city-name h1{
  padding-left: 7px;
}
.weather-item{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid #fff;
  border-radius: 15px;
  padding: 10px;
  background: rgba(0,0,0,0.2);
}
.forecast{
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 180px;
  padding: 0 100px 0 100px;
}
.red{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid red;
}
.forecast-item{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 15px;
  padding: 10px;
  margin: 10px;
}
.forecast-item a{
  color: #fff;
  text-decoration: none;
}
.temp{
  display: flex;
  justify-content: center;
  align-items: center;
}
.small{
  padding-right: 5px;
}
.night{
  font-size: 0.8em;
  color: #d4d4d4;
}
.now{
  font-size: 1.4em;
}
.bigTemp{
  font-size: 2em;
  padding-left: 20px;
  font-weight: bold;
}
@media screen and (max-width: 1000px){
    .forecast{
        margin-top: 180px;
        padding: 0 10px 0 10px;
        
    }
}
@media screen and (max-width: 820px) {
    .forecast{
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 80px;
        margin-bottom: 40px;
    }
    .forecast-item{
      font-size: 1.4em;
    }
}
@media screen and (max-width: 670px) {
    .city-name{
        padding: 0;
        justify-content: center;
        margin-top: 20px;
        font-size: 3vw;
    }
    .search{
      padding-right: 40px;
    }
    .forecast{
        font-size: 0.8em;
    }
}
@media screen and (max-width: 425px) {
    .search{
        justify-content: center;
        padding: 40px 0 0 0;
    }
    .forecast{
      margin-top: 30px;
    }
}
</style>

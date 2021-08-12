<template>
<div class="container">
  <div class="weather" >
    <input type="text" v-model="query">
    <button @click="fetchWeather">Update</button>
    <div class="weather-item" v-if="sucsess">
      <div class="name">{{weather.name}}</div>
      <div class="description"><img :src="img" alt=""></div>
      <div class="temp">{{Math.round(weather.main['temp'])}}&deg;</div>
    </div>
    <button @click="fetchWeather_f">Forecast</button>
    <div class="weather-item" v-if="sucsess_f">
      <div class="name">{{forecast.city.name}}</div>
      <div class="temp">{{Math.round(forecast.list[0].main['temp'])}}&deg;</div>
    </div>
    
  </div>
  <div class="forecast" v-if="sucsess_f">
    <h1>Today</h1>
      <div class="forecast-item" v-for="weather in today" :key="weather.index">
        <div>{{weather.dt_txt}}</div>
        <div><img :src="`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`" alt=""></div>
        <div>{{Math.round(weather.main.temp)}}&deg;</div>
        
        <!-- <div class="name">{{forecast.city.name}}</div> -->
        <!-- <div class="temp">{{Math.round(forecast.list[0].main['temp'])}}&deg;</div> -->
      </div>
      <h1>Tomorrow</h1>
      <div class="forecast-item" v-for="weather in tomorrow" :key="weather.index">
        <div>{{weather.dt_txt}}</div>
        <div><img :src="`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`" alt=""></div>
        <div>{{Math.round(weather.main.temp)}}&deg;</div>
        
        <!-- <div class="name">{{forecast.city.name}}</div> -->
        <!-- <div class="temp">{{Math.round(forecast.list[0].main['temp'])}}&deg;</div> -->
      </div>

      <h1>3rd</h1>
      <div class="forecast-item" v-for="weather in tomorrow" :key="weather.index">
        <div>{{weather.dt_txt}}</div>
        <div><img :src="`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`" alt=""></div>
        <div>{{Math.round(weather.main.temp)}}&deg;</div>
        
        <!-- <div class="name">{{forecast.city.name}}</div> -->
        <!-- <div class="temp">{{Math.round(forecast.list[0].main['temp'])}}&deg;</div> -->
      </div>

      <h1>4th</h1>
      <div class="forecast-item" v-for="weather in tomorrow" :key="weather.index">
        <div>{{weather.dt_txt}}</div>
        <div><img :src="`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`" alt=""></div>
        <div>{{Math.round(weather.main.temp)}}&deg;</div>
        
        <!-- <div class="name">{{forecast.city.name}}</div> -->
        <!-- <div class="temp">{{Math.round(forecast.list[0].main['temp'])}}&deg;</div> -->
      </div>

      <h1>5th</h1>
      <div class="forecast-item" v-for="weather in tomorrow" :key="weather.index">
        <div>{{weather.dt_txt}}</div>
        <div><img :src="`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`" alt=""></div>
        <div>{{Math.round(weather.main.temp)}}&deg;</div>
        
        <!-- <div class="name">{{forecast.city.name}}</div> -->
        <!-- <div class="temp">{{Math.round(forecast.list[0].main['temp'])}}&deg;</div> -->
      </div>
    
    </div>
    <div class="red" v-if="sucsess_f">
      <h1>AllDays</h1>
      <div class="forecast-item" v-for="weather in tomorrow" :key="weather.index">
        <div>{{weather.dt_txt}}</div>
        <div><img :src="`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`" alt=""></div>
        <div>{{Math.round(weather.main.temp)}}&deg;</div>
        
        <!-- <div class="name">{{forecast.city.name}}</div> -->
        <!-- <div class="temp">{{Math.round(forecast.list[0].main['temp'])}}&deg;</div> -->
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
      img: '',
      query: 'Moscow',
      sucsess: false,
      sucsess_f: false,
      weather: {},
      forecast: {},
      days: [],//для краткого прогноза на 5 дней. дата, ср.температура день-ночь(sys.pod(n/d)), иконка
      today: [],
      tomorrow: [],
      tomorrow2: '',
      thirdDay: [],
      forthDay: [],
      fifthDay: [],
      allDays: []
    }
  },
  methods: {
    fetchWeather(){
      fetch(`${this.url_base}?q=${this.query}&appid=${this.api_key}&units=metric`)
        .then(resp => resp.json())
        .then(data => {
          this.weather = data
          console.log(data)
          if (typeof this.weather.main != 'undefined') {this.sucsess = true}
          this.img = `https://openweathermap.org/img/wn/${this.weather.weather[0]['icon']}@2x.png`
        })
    },
    fetchWeather_f(){
      fetch(`${this.url_base_f}?q=${this.query}&appid=${this.api_key}&units=metric`)
        .then(resp => resp.json())
        .then(this.setResults)
    },
    setResults(data){
      this.forecast = data
      console.log(data)
      if (typeof this.forecast.list != 'undefined') {this.sucsess_f = true}
      
      let todayDate = new Date().getDate();
      // console.log(todayDate)
      this.today = []
      this.tomorrow = []
      this.thirdDay = []
      this.forthDay = []
      this.fifthDay = []
      let newDate = new Date()
      let tomorrowDate = new Date(newDate.setDate(todayDate+1)).getDate()
      let thirdDayDate = new Date(newDate.setDate(todayDate+2)).getDate()
      let forthDayDate = new Date(newDate.setDate(todayDate+3)).getDate()
      let fifthDayDate = new Date(newDate.setDate(todayDate+4)).getDate()
      // console.log("tommorowDate"+tomorrowDate)
      for(let i=0;i<this.forecast.list.length;i++){
        let weatherDate = new Date(this.forecast.list[i]['dt_txt']).getDate()
        // console.log(weatherDate)
        if(todayDate==weatherDate){
          this.today.push(this.forecast.list[i])
          // console.log(this.today)
        }
        if(tomorrowDate==weatherDate){
          this.tomorrow.push(this.forecast.list[i])
          this.tomorrow2 = this.forecast.list[i]
          
        }
        if(thirdDayDate==weatherDate){
          this.thirdDay.push(this.forecast.list[i])
          // console.log(this.tomorrow)
        }
        if(forthDayDate==weatherDate){
          this.forthDay.push(this.forecast.list[i])
          // console.log(this.tomorrow)
        }
        if(fifthDayDate==weatherDate){
          this.fifthDay.push(this.forecast.list[i])
          // console.log(this.tomorrow)
        }
        
      }
      this.allDays.push(this.today,this.tomorrow, this.thirdDay, this.forthDay, this.fifthDay)
      console.log(this.allDays)
      console.log(this.tomorrow2)
      console.log(this.tomorrow)
      this.setShortResults()
    },
    setShortResults(){
      let tempDay = [], tempNight = []
      for(let i=0;i<this.tomorrow.length;i++){
        // console.log(this.tomorrow[i]['sys']['pod'])
        if (this.tomorrow[i]['sys']['pod'] == 'n'){
          //для краткого прогноза на 5 дней. дата, ср.температура день-ночь(sys.pod(n/d)), иконка
          tempNight.push(Math.round(this.tomorrow[i].main.temp))
        }else {tempDay.push(Math.round(this.tomorrow[i].main.temp))}
        
      }
      // let test = tempNight.reduce((sum, current) => (sum+current))/tempNight.length
      let maxTempDay = Math.max.apply(null,tempDay)
      let minTempNight = Math.min.apply(null,tempNight)
      console.log(maxTempDay)
      console.log(minTempNight)
      console.log('day'+tempDay)
      console.log('nigth'+tempNight)
      this.days.push({date: this.tomorrow[0]['dt_txt'], tempDate: maxTempDay, tempNight: minTempNight, img: this.tomorrow[4].weather[0].icon})
      console.log(this.days)
      // console.log(this.tomorrow[1])
      console.log('this is shorty')
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  background: rgba(24,24,27,0.8);
}
.weather{
  /* background: rgba(24,24,27,0.8); */
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
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
  flex-direction: column;
  border: 1px solid #fff;
  border-radius: 15px;
  padding: 10px;
  margin: 10px;
  background: rgba(0,0,0,0.2);
}
</style>

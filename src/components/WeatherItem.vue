<template>
    <div class="container">
        <div class="info">
            <div class="back">
                <router-link :to="{name: 'Home'}">
                    <button>
                        <i class="fas fa-arrow-left fa-lg"></i>
                    </button>
                </router-link>
            </div>
            <div class="city-name"><i class="fas fa-map-marker-alt"></i><h1>{{cityName}}</h1></div>
            <span>{{day}}</span>
        </div>
        <div class="forecast">
            <div class="features">
                <div :class="{selected: selected=='temp'}" @click="selected='temp'">Temperature</div>
                <div :class="{selected: selected=='wind'}" @click="selected='wind'">Wind</div>
                <div :class="{selected: selected=='hum'}" @click="selected='hum'">Humidity</div>
            </div>
            <div class="forecast-temp" v-show="selected=='wind'">
                <div class="forecast-item" v-for="(wind,index) in windDetails" :key="index">
                    <div class="time">{{(wind.dt_txt).substr(11,2)}} <span class="small">00</span></div>
                    <div class="feature">{{Math.ceil(wind.speed)}} m/s</div>
                    <div class="feature">
                        <i class="fas fa-arrow-down" :style="{ transform: 'rotate('+ wind.degree+'deg)'}"></i>
                    </div>
                    <div class="feature">{{wind.direction}}</div>
                </div>
            </div>
            
            <div class="forecast-temp" v-show="selected=='hum'">
                <div class="forecast-item" v-for="(weather,index) in fullForecast" :key="index">
                    <div class="time">{{(weather.dt_txt).substr(11,2)}} <span class="small">00</span></div>
                    <div class="feature">{{weather.main.humidity}} %</div>
                </div>
            </div>

            <div class="forecast-temp" v-show="selected=='temp'">
                <div class="forecast-item" v-for="(weather,index) in fullForecast" :key="index">
                    <div class="time">{{(weather.dt_txt).substr(11,2)}} <span class="small">00</span></div>
                    <div class="temp"><img :src="`https://openweathermap.org/img/wn/${weather.weather[0]['icon']}@2x.png`" alt=""></div>
                    <div class="temp">{{Math.round(weather.main['temp'])}}&deg;</div>
                </div>
            </div>
            <div class="forecast-days">
                <div class="title">Days:</div>
                <div class="forecast-days-item">
                    <div class="days-item" v-for="(day, index) in daysList" :key="index">
                        <router-link :to="{name: 'item', params: {id: index+1+'-day'}}"><span :class="{bold: day == chosenDay}">{{day}}</span></router-link>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                months: ["Jan", "Feb", "March", "April", "May", "June", "July", 
                    "August", "September", "October", "November", "December"],
                weeks: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                directions: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
                degrees: [0, 45, 90, 135, 180, 225, 270, 315],
                selected: 'temp'
            }
        },
        computed:{
            fullForecast(){
                let dayIndex = ((this.$route.params.id).replace(/[^0-9]/g, '')-1)
                this.$store.getters.fullForecast[dayIndex]
                return this.$store.getters.fullForecast[dayIndex]
            },
            cityName(){
                return this.$store.getters.cityName
            },
            day(){
                let newDate = new Date(this.fullForecast[0]['dt_txt'])
                let date = [
                    newDate.getDate(),
                    this.months[(newDate.getMonth())]
                ].join(' ')
                let week = this.weeks[newDate.getDay()]
                let result = `${date}, ${week}`
                return (result)
            },
            daysList(){
                let days = []
                for(let i=0;i<this.$store.getters.fullForecast.length;i++){
                    let newDate = new Date(this.$store.getters.fullForecast[i][0]['dt_txt'])
                    let day = [
                        newDate.getDate(),
                        (this.months[(newDate.getMonth())])
                    ].join(' ')
                    days.push(day)                  
                } 
                return days
            },
            chosenDay(){
                let dayIndex = ((this.$route.params.id).replace(/[^0-9]/g, '')-1)
                return (this.daysList[dayIndex])
            },
            windDetails(){
                let windList = []
                 for (let i=0;i<this.fullForecast.length;i++){
                    let degree = this.fullForecast[i].wind.deg
                    degree = Math.round(degree/360*8)
                    degree = (degree + 8) % 8
                    windList.push({dt_txt: this.fullForecast[i].dt_txt, speed: this.fullForecast[i].wind.speed, degree: this.degrees[degree], direction: this.directions[degree]})
                }
                return windList
            }        
        }       
    }
</script>

<style scoped>
.container{
    background: rgba(24,24,27,0.6);
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    justify-content: space-between;
}
.info{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding: 40px 80px 0 80px;
    font-size: 1.5em;
}
.back button{
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #fff;
}
.city-name{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 40px;
}
.city-name h1{
    padding-left: 7px;
}
.forecast{
    color: rgb(241, 240, 240);
    background: rgba(231, 231, 233, 0.4);
    display: flex;
    min-width: 40%;
    border-radius: 20px;
    flex-direction: column;
    align-self: center;
    padding: 20px;
    margin-right: 80px;
    flex-wrap: wrap;
}
.features{
    display: flex;
    align-self: center;
    margin-bottom: 15px;
}
.features > div{
    border-radius: 7px;
    padding: 5px 7px;
    margin-right: 15px;
    color: rgb(221, 220, 220);
}
.features > div:hover{
    cursor: pointer;
}
.features .selected{
    font-weight: bold;
    color: #fff;
    background: rgba(0,0,0,0.3);
}
.forecast-temp{
    display: flex;
    justify-content: center;
}
.forecast-item{
    padding-top: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 15px;
    padding: 10px;
    min-width: 50px;
}
.feature{
    padding-top: 5px;
}
.temp{
    width: 50px;
}
.temp img{
    width: 100%;
}
.time{
    display: flex;
}
.small{
    font-size: 0.6em;
}
.forecast-days{
    display: flex;
    flex-direction: column;
}
.forecast-days-item{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.days-item{
    display: flex;
    font-size: 0.85em;
}
.bold{
    font-weight: bold;
    text-decoration: underline;
    color: #fff;
}
.days-item a{
    color: #fff;
    text-decoration: none;
    color: rgb(221, 220, 220);
}
.title{
    align-self: flex-start;
    font-weight: bold;
}
@media screen and (max-width: 1250px){
    .container{
        flex-direction: column;
        justify-content: start;
    }
    .forecast{
        margin: 110px 0 0 0;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        
    }
    .forecast::-webkit-scrollbar {
        display: none;
    }
}
@media screen and (max-width: 700px) {
    .forecast{
        width: 80vw;
    }
    .features{
        align-self: flex-start;
    }
    .info{
        padding: 40px 40px 0 40px;
        justify-content: center;
    }
    .city-name{
        padding: 0;
    }
}
@media screen and (max-width: 490px) {
    .info{
        font-size: 4vw;
        padding: 40px 20px 0 20px;
    }
    .forecast{
        font-size: 0.8em;
        width: 70vw;
    }
}
</style>
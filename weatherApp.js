import { LightningElement } from 'lwc';
//const API_KEY = '1c246856f543a5c7c75c4d8a98eb5a67'

import WEATHER_ICONS from '@salesforce/resourceUrl/weatherAppIcons' //it is a zip folder
import getWeatherDetails from '@salesforce/apex/weatherAppController.getWeatherDetails';
import City from '@salesforce/schema/Lead.City';
export default class WeatherApp extends LightningElement {

    //within a zip folder there is another folder
    clearIcon = WEATHER_ICONS+'/weatherAppIcons/clear.svg' 
    cloudIcon = WEATHER_ICONS+'/weatherAppIcons/cloud.svg'
    dropletIcon = WEATHER_ICONS+'/weatherAppIcons/droplet.svg'
    hazeIcon = WEATHER_ICONS+'/weatherAppIcons/haze.svg'
    mapIcon = WEATHER_ICONS+'/weatherAppIcons/map.svg'
    rainIcon = WEATHER_ICONS+'/weatherAppIcons/rain.svg'
    snowIcon=WEATHER_ICONS+'/weatherAppIcons/snow.svg'
    stormIcon=WEATHER_ICONS+'/weatherAppIcons/storm.svg'
    thermometerIcon =WEATHER_ICONS+'/weatherAppIcons/thermometer.svg'
    arrowBackIcon = WEATHER_ICONS+'/weatherAppIcons/arrow-back.svg'
    //arrowBackIcon = 'C:/Users/mahat/AppData/Local/Temp/Temp1_weatherAppIcons.zip/weatherAppIcons/arrow-back.svg'


    cityName= ''
    loadingText= ''
    isError = false
    response
    weatherIcon

    get loadingClasses(){
        return this.isError ? 'error-msg' : 'success-msg' 
    }

    searchHandler(event){
        this.cityName = event.target.value //to store the city name
    }

    submitHandler(event){
        //this is coming from a form hence it will refresh

        event.preventDefault()
        //preventDefault: Cancels the event if it is cancelable, without stopping further propagation of the event.

        this.fetchData()

    }

    fetchData(){
        this.isError = false
        this.loadingText = 'Fetching weather details...'
        console.log("City Name:",this.cityName)
        getWeatherDetails({input:this.cityName}).then(result=>
            {this.weatherDetails(JSON.parse(result))
            }).catch((error)=>{
                console.error(error)
                this.response = null
                this.loadingText= 'something went wrong'
                this.isError= true
            })
        //inside this will call our api

      /* const URL = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&units=metric&appid=${API_KEY}`

        fetch(URL).then(res=>res.json()).then(result=>{
            console.log(JSON.stringify(result))
            //this.loadingText=''
            this.weatherDetails(result)
        }).catch((error)=>{
            console.error(error)
            this.loadingText= 'something went wrong'
            this.isError= true
        })*/
    }

    weatherDetails(info){
        if(info.cod === '404'){
            this.isError = true
            this.loadingText = `${this.cityName} isn't a valid city`
            

        }
        else{
            this.loadingText=''
            this.isError=false
            const city = info.name
            const country = info.sys.country
            const {description,id} = info.weather[0]
            const {temp,feels_like,humidity} = info.main

            if(id === 800){
                this.weatherIcon = this.clearIcon
              } else if((id>=200 && id <=232) || (id>=600 && id <=622)){
                this.weatherIcon = this.stormIcon
              } else if(id>=701 && id <=781){
                this.weatherIcon = this.hazeIcon
              } else if(id>=801 && id <=804){
                this.weatherIcon = this.cloudIcon
              } else if((id>=500 && id <=531) || (id>=300 && id<= 321)){
                this.weatherIcon = this.rainIcon
              } else {}
        
            this.response =  {
                city: city,
                temperature:Math.floor(temp),
                description: description,
                location:`${city}, ${country}`,
                feels_like: Math.floor(feels_like),
                humidity:`${humidity}%`

            }
        }

    } 

    backHandler(){
        this.response=null
        this.cityName=''
        this.loadingText=''
        this.isError=false
        this.weatherIcon=''
    }

    
}
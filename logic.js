const mainContainer = document.querySelector(".container");
const userTab = document.querySelector("[user-tab]");
const searchTab = document.querySelector("[search-tab]");

const grantLocationContainer=document.querySelector(".grant-location-container");

const searchForm = document.querySelector(".form-container");

const currentWeatherContainer=document.querySelector(".current-user-weather");

const loadingScreen = document.querySelector(".loading-screen-container");

const btnGrantAccess = document.querySelector("[btn-grant-access]");

const errorPage = document.querySelector("[data-error]");
console.log(errorPage);



const APIkey = "50b4846b75084749a3a8d7b1f428f6a3";
let initialTab = userTab;
initialTab.classList.add("current-tab");
console.log("def red added");
getFromSessionStorage();  /*Dry run done */

// function for switching tabs
function switchTab(clickedTab){    /*Checked */
    if(clickedTab != initialTab){
        initialTab.classList.remove("current-tab");
        // console.log("red removed");
        initialTab = clickedTab;
        // console.log(" initialTab = clickedTab done");
        initialTab.classList.add("current-tab");
        // console.log(" initialTab red added");

        if(!searchForm.classList.contains("active")){
            searchForm.classList.add("active");
            grantLocationContainer.classList.remove("active");
            currentWeatherContainer.classList.remove("active");
        }
        else  {

            currentWeatherContainer.classList.remove("active");
            searchForm.classList.remove("active");

            getFromSessionStorage();
        }

    }
}



// event listners for click on tab

userTab.addEventListener("click", () =>{  /*Checked */
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{  /*Checked */
    switchTab(searchTab); 
});


// function for getting lattitude and longitute from session storage

function getFromSessionStorage(){ /*Checked */
    const localCoordinates = sessionStorage.getItem("userCoordinates");
    console.log("under getFromSessionStorage");
    if (!localCoordinates) {
        grantLocationContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

const dataSearchInput = document.querySelector("[data-search-input]");  /*Checked */

//submit form event listner
searchForm.addEventListener("submit",(e)=>{ /*Checked */
     console.log(dataSearchInput.value) ;
     e.preventDefault(); //new learning
     let cityName = dataSearchInput.value;
    if( cityName === ""){
        
        return;
    }
    else{
        console.log(cityName) ;
        fetchSearchWeatherInfo(cityName);
        
    }
});

//async function for getting the searched city
async function fetchSearchWeatherInfo(city){ /*Checked */
    loadingScreen.classList.add("active");
    grantLocationContainer.classList.remove("active");
    currentWeatherContainer.classList.remove("active");

    // API call
   
    try {
        console.log(" try start api call") ;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
        
        console.log("api call done") ;
        const data = await response.json();
        if (data.cod === '404') {
            window.location.href = 'error.html'; //new learning (chat gpt doubt++)
            return;
          }
        console.log("json done done") ;
        loadingScreen.classList.remove("active");
        currentWeatherContainer.classList.add("active");
        console.log("active kahini done") ;
        console.log(data);
        renderOnUI(data);
    }
      catch (error) {

        errorSwitchTab(error);
        
      }
      
}


//get location access on click the grant acces btn

function grantAccessUserLocation(){  /*Checked */
    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition); //new learning (w3schools)
    }
    else{
        // errorSwitchTab(error);
        console.log("loaction not found");
    }
}

//function for getting current position of user (lattitute and longitute)
function showPosition(position){ /*Checked */

    const coordinates  ={
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    
    if (typeof(Storage) !== "undefined") { /*Checked */
        // Code for localStorage/sessionStorage.
        sessionStorage.setItem("userCoordinates", JSON.stringify(coordinates) );
        fetchWeatherInfo(coordinates);

      } else {
        // Sorry! No Web Storage support..
        // errorSwitchTab(error);
        console.log("Sorry! No Web Storage support..");
      }

}

btnGrantAccess.addEventListener("click",grantAccessUserLocation); /*Checked */


// function for getting weather info of user

async function fetchWeatherInfo(coordinate){  /*Checked */
    grantLocationContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    // console.log("api call clg coor")
    // console.log(coordinate);
    const {lat,lon}=coordinate;
    // console.log(`${lat} ${lon} ${APIkey}`);
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);
        const data = await response.json();
        if (data.cod === '404') {
            window.location.href = 'error.html';
            return;
        }
        loadingScreen.classList.remove("active");
        currentWeatherContainer.classList.add("active");
        renderOnUI(data); 

    } catch (error) {
        // errorSwitchTab(error);
        console.log("dkdms");
    }
    
}

//function for showing the error page

function errorSwitchTab(error){
    console.error(error);
    window.location.href ="error.html";
}


// render data on ui

function renderOnUI(userWeatherdata){ /*Checked */
    console.log("in RUI")
    console.log(userWeatherdata);
    const cityName=document.querySelector("[data-placeName");
    const weatherDes = document.querySelector("[data-weather-des]");
    const weatherIcon = document.querySelector("[data-weather-icon]");
    const cityTemp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");
    const flagImg = document.querySelector("[data-img-flag]");
    cityName.innerText = userWeatherdata?.name;
    flagImg.src = `https://flagcdn.com/${userWeatherdata?.sys?.country.toLowerCase()}.svg`
    weatherDes.innerText = userWeatherdata?.weather?.[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${userWeatherdata.weather?.[0]?.icon}@2x.png`;
    cityTemp.innerText = `${userWeatherdata?.main?.temp} °C`;
    windSpeed.innerText = `${userWeatherdata?.wind?.speed} m/s`;
    humidity.innerText = `${userWeatherdata?.main?.humidity} %`;
    clouds.innerText = `${userWeatherdata?.clouds?.all} %`;
}









// userlocation
// Current User weather details
// Search city and get the weather details
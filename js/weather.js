
const container = document.querySelector('.container');
const search = document.querySelector('.search button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const searchInput= document.querySelector('.input-search');
const suggestionsList = document.querySelector('.search-ul');
let APIKEYGeoraphic='CFQQlM1ClUIuFtM/hc6cbA==HB9sNrtmRHyCQ3AA';


    searchInput.addEventListener('input', handleInput);

    //test gpt 
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", APIKEYGeoraphic);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
   async  function handleInput() {
        const query = searchInput.value.trim();

        container.style.height='100px';

        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
        error404.classList.remove('active');

        if (query.length === 0) {
            suggestionsList.innerHTML = '';
            return;
        }
    
        try {
            const response = await  fetch(`https://api.api-ninjas.com/v1/city?name=${query}&limit=5`, requestOptions);
           
            const data = await response.json();
           
            displaySuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }
    
    function displaySuggestions(data) {
        suggestionsList.innerHTML = ''; // Clear previous suggestions
       
        data.forEach(item => {
            const suggestionItem = document.createElement('li');
            suggestionItem.className = 'suggestion';
            suggestionItem.textContent = item.name;
    
            suggestionItem.addEventListener('click', () => {
                searchInput.value = item.name;
                suggestionsList.innerHTML = ''; // Clear suggestions after selection
                searchInput.focus();
                getWeatherByLocation();
            });
    
            suggestionsList.appendChild(suggestionItem);
        });
    }
    
    // Simple debounce function to limit the frequency of API requests
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
    
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
    //end
    


search.addEventListener('click',()=>{
    getWeatherByLocation();
})
searchInput.addEventListener('keydown', async function(event) {
    if(event.keyCode === 13)
    {
       await handleInput();
       getWeatherByLocation() ;
        
    }
    else
    {
        
        return;
    }

})
 function getWeatherByLocation(){
    const APIKey='91e6d1368738e91ba6d806a9b367e74e';
    const city = document.querySelector('.input-search').value.trim();
    
    if(city==''){
        return;
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response=> response.json()).then( json =>{
 
        if(json.cod=='404'){
            container.style.height='400px';
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
            error404.classList.add('active');
            suggestionsList.innerHTML='';
            return;
        }

      

        const img = document.querySelector('.weather-box img');
        const temperature = document.querySelector('.weather-box .temperature');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');

        switch (json.weather[0].main) {
            case 'Clear':

                img.src = '../img/clear.png'
                break;

            case 'Rain':

                img.src = '../img/rain.png'
                break;

            case 'Clouds':

                img.src = '../img/cloud.png'
                break;

            case 'Snow':

                img.src = '../img/snow.png'
                break;

            case 'Mist':

                img.src = '../img/mist.png'
                break;
            case 'Haze':
                img.src = '../img/mist.png'
                break;
            default:
                img.src = '../img/clear.png'
                break;
        }

        temperature.innerHTML=`${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML=`${json.weather[0].description}`;
        humidity.innerHTML=`${json.main.humidity}%`;
        wind.innerHTML=`${parseInt(json.wind.speed)}Km/h`;

        error404.classList.remove('active');
        container.style.height='555px';
        weatherBox.classList.add('active');
        weatherDetails.classList.add('active');
        suggestionsList.innerHTML='';
       
    })
}
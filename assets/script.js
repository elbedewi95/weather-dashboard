var key = "fbd2af66198a82a227ecee84f163f688";

var cityList =$("#cities");
var cities = [];
//Function to fetch API Weather 
  
function getWeather(cityName){
    var URL1 = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid=" + key; 

    //Clear content of today-weather
    $("#today-weather").empty();
    $.ajax({
      url: URL1,
      method: "GET"
    }).then(function(response) {
        
      // Create a new table row element
      cityTitle = $("<h3>").text(response.name + " "+ dayFormat());
      $("#today-weather").append(cityTitle);
    //   convert temp to Fº
      var temp = parseInt((response.main.temp)* 9/5 - 459);
      var cityTemperature = $("<p>").text("Temperature: "+ temp + " °F");
      $("#today-weather").append(cityTemperature);
      var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
      $("#today-weather").append(cityHumidity);
      var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
      $("#today-weather").append(cityWindSpeed);
      var lon = response.coord.lon;
      var lat = response.coord.lat;
    
        //Api to get UV index
        var URL2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ key+ "&lat=" + lat +"&lon=" + lon;
        $.ajax({
            url: URL2,
            method: "GET"
        }).then(function(response2) {
            var cityUV = $("<span>").text(response2.value);
            var cityUVp = $("<p>").text("UV Index: ");
            cityUVp.append(cityUV);
            $("#today-weather").append(cityUVp);
            // console.log( response2.value);
            if(response2.value > 0 && response2.value <=2){
                cityUV.attr("id","green")
                console.log( response2.value);
            }
            else if (response2.value > 2 && response2.value <= 5){
                cityUV.attr("id","yellow")
                console.log( response2.value);
            }
            else if (response2.value >5 && response2.value <= 7){
                cityUV.attr("id","orange")
                console.log( response2.value);
            }
            else if (response2.value >7 && response2.value <= 10){
                cityUV.attr("id","red")
                console.log( response2.value);
            }
            else{
                cityUV.attr("id","purple")
                console.log( response2.value);
            }
        });
    
        //Api to get 5-day forecast  
        var URL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
            $.ajax({
            url: URL3,
            method: "GET"
        }).then(function(response3) { 
            $("#boxes").empty();
            console.log(response3);
            for(var i=0, j=0; j<=5; i=i+6){
                var read_date = response3.list[i].dt;
                if(response3.list[i].dt != response3.list[i+1].dt){
                    var fiveDays = $("<div>");
                    fiveDays.attr("class","col-3 m-2 bg-primary")
                    var d = new Date(0);
                    d.setUTCSeconds(read_date);
                    var date = d;
                    console.log(date);
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dateLayout = (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day + '/' +
                        date.getFullYear() ;
                    var cardDate = $("<h6>").text(dateLayout);
                    //get icons
                    var imgEl = $("<img>");
                    var skyconditions = response3.list[i].weather[0].main;
                    if(skyconditions==="Clouds"){
                        imgEl.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if(skyconditions==="Clear"){
                        imgEl.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    }else if(skyconditions==="Rain"){
                        imgEl.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }

                    var tempK = response3.list[i].main.temp;
                    console.log(skyconditions);
                    var tempToNum = parseInt((tempK)* 9/5 - 459);
                    var pTemperature = $("<p>").text("Temperature: "+ tempToNum + " °F");
                    var pHumidity = $("<p>").text("Humidity: "+ response3.list[i].main.humidity + " %");
                    fiveDays.append(cardDate);
                    fiveDays.append(imgEl);
                    fiveDays.append(pTemperature);
                    fiveDays.append(pHumidity);
                    $("#boxes").append(fiveDays);
                    j++;
                }
            
        }
      
    });
      

    });
    
  }



//Function displayCities()
function displayCities() {
    cityList.empty();
    
    // add a new list item for each city
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      
      var listItem = $("<li>").text(city);
      listItem.attr("id","listC");
      listItem.attr("data-city", city);
      listItem.attr("class", "list-group-item");
    //   console.log(listItem);
      cityList.append(listItem);
    }
    //Get Response weather for the first city only
    if (!city){
        return
    } 
    else{
        getWeather(city)
    };
}   

  //event listener for search button
  $("#add-city").on("click", function(event){
      event.preventDefault();

    var city = $("#city-input").val().trim();
    
    if (city === "") {
        return;
    }
    cities.push(city);
        storeCities();
        displayCities();
  });
  //getting cities from local storage
getCities();

function getCities(){
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        cities = storedCities;
      }
    displayCities();
    // console.log(cities);
}

//store searched cities in local storage
function storeCities(){
  localStorage.setItem("cities", JSON.stringify(cities));
//   console.log(localStorage);
}

//Formatting dates
function dayFormat(date){
    var date = new Date();
    console.log(date);
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    var dateLayout = (month<10 ? '0' : '') + month + '/' +
                        (day<10 ? '0' : '') + day + '/' +
                            date.getFullYear() ;
    return dateLayout;
}


AFRAME.registerComponent('weather-component',{
    schema : { 
      lon : {default:'13.404954'},
      lat : {default:'52.520008'}
      },
    init: function(){

      this.currentTimestamp = new Date().getMinutes();

      this.createComponent();
      this.getWeatherREST();
      
    },

    // *** render Component
    createComponent: function () {
            
      this.lastupdate = document.createElement('a-text');
      this.lastupdate.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: "Status: " + new Date().toLocaleTimeString(), opacity:'0.8'});
      this.lastupdate.object3D.position.set(0, -0.68, -0.1);
      this.el.appendChild(this.lastupdate);

      this.textEl_Status = document.createElement('a-text');
      this.textEl_Status.setAttribute('text',{ color: '#fff', align: 'left', width: "4", value: "loading...", opacity:'0.5'});
      this.textEl_Status.object3D.position.set(0, -0.88, -0.1);
      this.el.appendChild(this.textEl_Status);

      this.textEl_Position = document.createElement('a-text');
      this.textEl_Position.setAttribute('text',{ color: '#fff', align: 'left', width: "4", value: "", opacity:'1'});
      this.textEl_Position.object3D.position.set(0, -0.48, -0.1);
      this.el.appendChild(this.textEl_Position);

      this.weathercontainer = document.createElement('a-entity');
      this.weathercontainer.object3D.position.set(0, 0, 0);
      this.el.appendChild(this.weathercontainer);

    },

    // *** update Details
    showWeather: function(dataseries) {

        var weathercontainer=this.weathercontainer;

        while (weathercontainer.hasChildNodes()) {
            weathercontainer.removeChild(weathercontainer.firstChild);
        }

        var x=0;
        Object.keys(dataseries).forEach(function(key) {
            x=x+1.1;
            //console.log(key, dataseries[key].weather);

            var idate = formatDate8digit(dataseries[key].date);
            var iday = getDayStringFromDate(idate);
            var temp = dataseries[key].temp2m;
            var weather= dataseries[key].weather;

            var entity = document.createElement('a-entity');
            entity.object3D.position.set(x-1.2, 1.3, 0);

                var item = document.createElement('a-text');
                item.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: idate.toLocaleDateString(), opacity:'0.6'});
                item.object3D.position.set(0, 0, 0);
                entity.appendChild(item);

                var item = document.createElement('a-text');
                item.setAttribute('text',{ color: '#fff', align: 'left', width: "4", value: iday, opacity:'1'});
                item.object3D.position.set(0, 0.2, 0);
                entity.appendChild(item);

                var item = document.createElement('a-text');
                item.setAttribute('text',{ color: '#fff', align: 'left', width: "8", value: temp.max, opacity:'1'});
                item.object3D.position.set(0, -0.4, 0);
                entity.appendChild(item);

                var item = document.createElement('a-text');
                item.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: temp.min, opacity:'0.6'});
                item.object3D.position.set(0.2, -0.7, 0);
                entity.appendChild(item);

                /* var item = document.createElement('a-text');
                item.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: weather, opacity:'0.5'});
                item.object3D.position.set(0, -0.9, 0);
                entity.appendChild(item); */

                var item = document.createElement('a-entity');
                item.setAttribute('gltf-model','#' + weather);
                item.object3D.position.set(0, -1.6, -0.4);
                entity.appendChild(item);

            weathercontainer.appendChild(entity);
        });

        this.textEl_Position.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: "latitude: "+this.data.lat+" | longitude: "+this.data.lon, opacity:'0.9'});

        this.textEl_Status.setAttribute('text',{ color: '#fff', align: 'left', width: "4", value: "", opacity:'0.5'});
        this.lastupdate.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: "Status update: " + new Date().toLocaleTimeString(), opacity:'0.8'});
    },

    // *** load Details
    getWeatherREST: function() {
      // get weather data via REST
      // //https://www.7timer.info/bin/api.pl?lon=7.318&lat=51.819&product=civillight&output=json
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch("https://www.7timer.info/bin/api.pl?lon="+this.data.lon+"&lat="+this.data.lat+"&product=civillight&output=json", requestOptions)
        .then(response => response.text())
        .then(result => {
            //console.log(JSON.parse( result ).dataseries);
            this.showWeather(JSON.parse( result ).dataseries);
          })
        .catch(error => console.log('error', error));
    },

    // *** TICKS
    tick: function() {
      var newTimestamp = new Date().getMinutes();
      difference = Math.abs(this.currentTimestamp - newTimestamp);

      if (difference > 30) {
        this.currentTimestamp= new Date().getMinutes();
        this.getWeatherREST();
      }
    }
  });

// *** common Helpers
function formatDate8digit(x) {
    var day = x % 100;
    var month = Math.floor(x % 10000 / 100);
    var year = Math.floor(x / 10000);
    let date = new Date(year, month - 1, day);
    return date;
}

function getDayStringFromDate(d) {
    return d.toLocaleString(window.navigator.language, {weekday: 'long'});;
}
AFRAME.registerComponent('ips-component',{
    schema : { 
      object : {default:'42135'},
      label: {default:'Value'},
      postfix: {default:''}
      },
      
    init: function(){

      this.currentTimestamp = new Date().getMinutes();

      this.createComponent();
      this.getIPSobjectREST();
      
    },

    createComponent: function() {
            
      this.lastupdate = document.createElement('a-text');
      this.lastupdate.setAttribute('id','lastupdate');
      this.lastupdate.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: "Status: " + new Date().toLocaleTimeString(), opacity:'0.8'});
      this.lastupdate.object3D.position.set(0.2, 0.0, -0.1);
      this.el.appendChild(this.lastupdate);

      this.textEl_value = document.createElement('a-text');
      this.textEl_value.setAttribute('id','ethtxt');
      this.textEl_value.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: this.data.label, opacity:'1'});
      this.textEl_value.object3D.position.set(0, 0.2, 0);
      this.el.appendChild(this.textEl_value);
    },

    // *** render Content
    showIPSvalue: function(value) {

      // show value
      if(this.data.postfix=="sg") {
        var statustxt="";
        if(value==0) statustxt="N/A";
        if(value==1) statustxt="Sperrbetreib";
        if(value==2) statustxt="Normalbetrieb";
        if(value==3) statustxt="PV-Überschussbetrieb";
        if(value==4) statustxt="Betrieb für Abregelung";
        if(value==5) statustxt="undefined";
        this.textEl_value.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: this.data.label + ": " + statustxt, opacity:'1'});
      } else {
        this.textEl_value.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: this.data.label + ": " + value + this.data.postfix, opacity:'1'});
      }
      this.lastupdate.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: "Status update: " + new Date().toLocaleTimeString(), opacity:'0.8'});
    },

    // *** load IPS Details
    getIPSobjectREST: function() {
      // get latest IPS object via REST
      var requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                 // 'Authorization': `Basic ${btoa('email:pass')}` // *** configured in nginx, you can use this to configure the token once!
                 },
        body: '{"jsonrpc":"2.0","id":"0","method":"GetValue","params":['+this.data.object+']}'
      };

      fetch("/api/", requestOptions)
        .then(response => response.text())
        .then(result => {
            //console.log(JSON.parse( result ).data.rates);
            this.showIPSvalue(JSON.parse( result ).result);
          })
        .catch(error => console.log('error', error));
    },

    // *** TICKS
    tick: function() {
      var newTimestamp = new Date().getMinutes();
      difference = Math.abs(this.currentTimestamp - newTimestamp);

      if (difference > 5) {
        //console.log("ipstick")
        this.currentTimestamp= new Date().getMinutes();
        this.getIPSobjectREST();
      }
      
    }
  });
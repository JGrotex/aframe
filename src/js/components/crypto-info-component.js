AFRAME.registerComponent('crypto-info-component',{
    schema : { 
      currency : {default:'USD'}
      },
      
    init: function(){

      this.currentTimestamp = new Date().getMinutes();

      this.createComponent();
      this.getCryptoRatesREST();
      
    },

    createComponent: function() {
            
      this.lastupdate = document.createElement('a-text');
      this.lastupdate.setAttribute('id','lastupdate');
      this.lastupdate.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: "Status: " + new Date().toLocaleTimeString(), opacity:'0.8'});
      this.lastupdate.object3D.position.set(0.2, -1.2, -0.1);
      this.el.appendChild(this.lastupdate);

      this.textEl_ETH = document.createElement('a-text');
      this.textEl_ETH.setAttribute('id','ethtxt');
      this.textEl_ETH.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Ethereum:", opacity:'1'});
      this.textEl_ETH.object3D.position.set(0, 0.6, 0);
      this.el.appendChild(this.textEl_ETH);

      this.textEl_BTC = document.createElement('a-text');
      this.textEl_BTC.setAttribute('id','btctxt');
      this.textEl_BTC.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Bitcoin:", opacity:'1'});
      this.textEl_BTC.object3D.position.set(0, 0.3, 0);
      this.el.appendChild(this.textEl_BTC);

      this.textEl_SOL = document.createElement('a-text');
      this.textEl_SOL.setAttribute('id','soltxt');
      this.textEl_SOL.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Solana:", opacity:'1'});
      this.textEl_SOL.object3D.position.set(0, 0, 0);
      this.el.appendChild(this.textEl_SOL);

      this.textEl_MATIC = document.createElement('a-text');
      this.textEl_MATIC.setAttribute('id','adatxt');
      this.textEl_MATIC.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Polygon:", opacity:'1'});
      this.textEl_MATIC.object3D.position.set(0, -0.3, 0);
      this.el.appendChild(this.textEl_MATIC);

      this.textEl_ADA = document.createElement('a-text');
      this.textEl_ADA.setAttribute('id','adatxt');
      this.textEl_ADA.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Cardano:", opacity:'1'});
      this.textEl_ADA.object3D.position.set(0, -0.6, 0);
      this.el.appendChild(this.textEl_ADA);

      this.textEl_SKL = document.createElement('a-text');
      this.textEl_SKL.setAttribute('id','adatxt');
      this.textEl_SKL.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Skale:", opacity:'1'});
      this.textEl_SKL.object3D.position.set(0, -0.9, 0);
      this.el.appendChild(this.textEl_SKL);
    },

    // *** render Content
    showCrypto: function(rates) {

      // convert rates
      var eth = Math.round(1/rates.ETH *100)/100;
      var btc = Math.round(1/rates.BTC *100)/100;
      var sol = Math.round(1/rates.SOL *100)/100;
      var matic = Math.round(1/rates.MATIC *100)/100;
      var ada = Math.round(1/rates.ADA *100)/100;
      var skl = Math.round(1/rates.SKL *100)/100;

      // show rates
      this.textEl_ETH.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Ethereum: " + eth + " " + this.data.currency, opacity:'1'});
      this.textEl_BTC.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Bitcoin: " + btc + " " + this.data.currency, opacity:'1'});
      this.textEl_SOL.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Solana: " + sol + " " + this.data.currency, opacity:'1'});
      this.textEl_MATIC.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Polygon: " + matic + " " + this.data.currency, opacity:'1'});
      this.textEl_ADA.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Cardano: " + ada + " " + this.data.currency, opacity:'1'});
      this.textEl_SKL.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "Skale: " + skl + " " + this.data.currency, opacity:'1'});

      this.lastupdate.setAttribute('text',{ color: '#fff', align: 'left', width: "3", value: "Status update: " + new Date().toLocaleTimeString(), opacity:'0.8'});
    },

    // *** load Crypto Details
    getCryptoRatesREST: function() {
      // get latest crypto rates via REST
      // https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-exchange-rates#http-request
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch("https://api.coinbase.com/v2/exchange-rates?currency=" + this.data.currency, requestOptions)
        .then(response => response.text())
        .then(result => {
            //console.log(JSON.parse( result ).data.rates);
            this.showCrypto(JSON.parse( result ).data.rates);
          })
        .catch(error => console.log('error', error));
    },

    // *** TICKS
    tick: function() {
      var newTimestamp = new Date().getMinutes();
      difference = Math.abs(this.currentTimestamp - newTimestamp);

      if (difference > 15) {
        console.log("tick")
        this.currentTimestamp= new Date().getMinutes();
        this.getCryptoRatesREST();
      }
      
    }
  });
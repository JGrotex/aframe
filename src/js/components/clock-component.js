AFRAME.registerComponent('clock-component',{
    schema : { 
      local : {default:'en-US'}
      },

    init: function(){

      this.createComponent();
      
    },

    // *** render Component
    createComponent: function(){

        this.timeEl = document.createElement('a-text');
        this.timeEl.setAttribute('id','timetxt');
        this.timeEl.setAttribute('text',{ color: '#fff', align: 'left', width: "10", value: "1", opacity:'1'});
        this.timeEl.object3D.position.set(0, 0, 0);
  
        this.el.appendChild(this.timeEl);
  
        this.dateEl = document.createElement('a-text');
        this.dateEl.setAttribute('id','datetxt');
        this.dateEl.setAttribute('text',{ color: '#fff', align: 'left', width: "6", value: "2", opacity:'1'});
        this.dateEl.object3D.position.set(0, -0.3, -0.1);
  
        this.el.appendChild(this.dateEl);

    },

    // *** TICKS
    tick: function(){

      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      const d = new Date();
      let time = d.toLocaleTimeString(this.data.local);
      this.timeEl.setAttribute('text',{ color: '#fff', align: 'left', width: "10", value: "" + time + "", opacity:'1'});

      let date = d.toLocaleDateString(this.data.local, options);
      this.dateEl.setAttribute('text',{ color: '#fff', align: 'left', width: "4", value: "" + date + "", opacity:'0.6'});

    }
  });
<template>
  <Channel 
      v-if="loaded" 
      :index="_uid" 
      :trackIndex="trackIndex" 
      :title="title" 
      :defaultPan="pan" 
      :defaultMuted="muted" 
      :defaultGain="gain" 
      @gainChange="changeGain" 
      @muteChange="muteChange" 
      @panChange="changePan" 
      :leftAnalyser="leftAnalyser" 
      :rightAnalyser="rightAnalyser" 
      :scriptProcessorNode="scriptProcessorNode" 
  />
</template>

<script>
import Channel from './Channel.vue'
import EventBus from './../event-bus';

export default {
  name: 'MixerChannel',
  props: [
      'title',
      'context', 
      'url',
      'output',
      'defaultPan',
      'defaultGain',
      'defaultMuted',
      'trackIndex'
  ],
  components:{Channel},
  data : function(){       
      return {
        sourceNode         : false,
        scriptProcessorNode: false,
        gainNode           : false,
        pannerNode         : false,
        
        muted              : false,
        leftAnalyser       : false,
        
        leftBouncer        : {average:0,opacity:1},
        rightAnalyser      : false,
        rightBouncer       : {average:0,opacity:1},
        splitter           : false,
        ctx                : false,
        gradient           : false,
        buffer             : false,
        meterHeight        : 400,
        meterWidth         : 10,
        playFrom           : false,
        playing            : false,
        gainValue          : 0,
        pan                : 0,
        gain               : 0.8,
        loaded             : false,
      };
  },

  watch:{


  },

  created(){
    this.muted = this.defaultMuted;
    this.pan   = this.defaultPan;
    this.gain  = this.defaultGain;

    this.scriptProcessorNode = this.context.createScriptProcessor(2048, 1, 1);
    EventBus.$on('play', this.playSound);
    EventBus.$on('stop', this.stopSound);
    this.loadSound();
  },

  beforeDestroy() {
    EventBus.$off('play',this.playSound);
    EventBus.$off('stop',this.stopSound);
  },



  mounted(){

  },
  methods: {

    /*
    * MUTE CHANGE
    * Event when mute changes
    */

    muteChange(value){


        if(value){
            this.gainValue = this.gainNode.gain.value; // store gain value
            this.gainNode.gain.value = 0; // mute the gain node
            this.muted = true;
        }
        else{
            this.muted = false;
            this.gainNode.gain.value = this.gainValue; // restore previous gain value
        }

        this.$emit('muteChange', {index:this.trackIndex,muted:this.muted});

    },

    changeGain(gain)
    {
        this.gainValue = gain;
        this.gain = gain;

      if(!this.muted){
        this.gainNode.gain.value = gain;
      }

        this.$emit('gainChange', {index:this.trackIndex,gain:gain});
    },

    

    changePan(pan) {
        this.pan = pan;
        var xDeg = parseInt(pan);
        var zDeg = xDeg + 90;
        if (zDeg > 90) {
            zDeg = 180 - zDeg;
        }
        var x = Math.sin(xDeg * (Math.PI / 180));
        var z = Math.sin(zDeg * (Math.PI / 180));
        this.pannerNode.setPosition(x, 0, z);

        this.$emit('panChange', {index:this.trackIndex,pan:pan});
    },
   
    // load the specified sound
    loadSound() {
        var request = new XMLHttpRequest();
        request.open('GET', this.url, true);
        request.responseType = 'arraybuffer';

        // When loaded decode the data
        request.onload = () => { 
            // decode the data
            this.context.decodeAudioData(request.response, (buffer) => { // sound loaded
                // when the audio is decoded play the sound
                this.buffer=buffer;
                EventBus.$emit('track_loaded', this.buffer.duration);
                this.setupAudioNodes();

            }, this.onError);
        }
        request.send();
    },
   
    playSound(playfrom) {

        if(playfrom === undefined)
            playfrom = 0;

        this.setupAudioNodes();


        this.sourceNode.start(0,playfrom/1000);

    },

    stopSound() {
        this.sourceNode.stop(0);
    },
 
    // log if an error occurs
    onError(e) {
        console.log(e);
    },

    getAverageVolume(array) {
        var values = 0;
        var average;
 
        var length = array.length;
 
        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }
 
        average = values / length;
        return average;
    },


    setupAudioNodes() {
        // create a buffer source node
        this.sourceNode = this.context.createBufferSource();
        this.sourceNode.buffer = this.buffer;

       // this.sourceNode.loop = false; // false to stop looping
      //  this.sourceNode.muted = false; 

        // setup a analyzers
        this.leftAnalyser = this.context.createAnalyser();
        this.leftAnalyser.smoothingTimeConstant = 0.0;
        this.leftAnalyser.fftSize = 1024;
 
        this.rightAnalyser = this.context.createAnalyser();
        this.rightAnalyser.smoothingTimeConstant = 0.0;
        this.rightAnalyser.fftSize = 1024;

        // Create a gain node.
        this.gainNode = this.context.createGain();

        // Create a panner node.
        this.pannerNode = this.context.createPanner();
        this.pannerNode.panningModel = "equalpower";
        
        // setup a javascript node

        // create splitter
        this.splitter = this.context.createChannelSplitter(2);

        // connect everything together
        this.pannerNode.connect(this.splitter);
        this.gainNode.connect(this.pannerNode);
        this.scriptProcessorNode.connect(this.gainNode);
        this.sourceNode.connect(this.gainNode);
        this.splitter.connect(this.leftAnalyser,0,0);
        this.splitter.connect(this.rightAnalyser,1,0);
        this.pannerNode.connect(this.output);

        // initial values
        this.muteChange(this.muted);
        this.changeGain(this.gain);
        this.changePan(this.pan);

        this.sourceNode.onended = () => {
          this.onended();
        }

        this.loaded = true;
      
    },


    onended()
    {
        // disconnect everything
        this.scriptProcessorNode.disconnect();
        this.sourceNode.disconnect();
        this.gainNode.disconnect();
        this.pannerNode.disconnect();
        this.leftAnalyser.disconnect();
        this.rightAnalyser.disconnect();
        this.splitter.disconnect();

        if(this.playFrom)
            EventBus.$emit('play', this.playFrom);

        EventBus.$emit('ended',this._uid);

    },

    

  }
}
</script>
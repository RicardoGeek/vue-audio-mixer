# Audio Mixer

- [Demo](#demo)
- [Install](#install)
- [Support us](#support-us)

## Demo

To view a demo online:
https://audiomixer.io

To view demo examples locally clone the repo and run `npm install && npm run serve`

## Install

``` bash
npm install vue-audio-mixer --save
```


``` html
<template>
  <div id="app">
    <vue-audio-mixer :config="config" @input="outputConfig"></vue-audio-mixer>
  </div>
</template>

<script>

import VueAudioMixer from 'vue-audio-mixer';
import 'vue-audio-mixer/dist/vue-audio-mixer.min.css'; 

export default {
  name: 'App',
  components: {
    VueAudioMixer
  },
  data : function(){     
    return {
      newconfig:{},
      config: {
        "tracks":[
            {
                "title":"Strings1",
                "url":"https://api.soundcloud.com/tracks/515722791/stream?client_id=ae1dadcc70f054f451de8c6358bcf396",
                "pan":-60,
                "gain":0.5,
                "muted":false
            },
            {
                "title":"Strings2",
                "url":"https://api.soundcloud.com/tracks/515722791/stream?client_id=ae1dadcc70f054f451de8c6358bcf396",
                "pan":81,
                "gain":"1.08",
                "muted":true
            },
            {
                "title":"Strings3",
                "url":"https://api.soundcloud.com/tracks/515722791/stream?client_id=ae1dadcc70f054f451de8c6358bcf396",
                "pan":-49,
                "gain":"0.85",
                "muted":true
            }
        ],
        "master":{
            "pan":0,
            "gain":"0.85",
            "muted":false
        }
      }
    }  
  },
  methods:{
    // output the current mixer settings to the console
    outputConfig(input)
    {
      console.log(input);
    }
  }
}
</script>
```

Or use directly from a CDN
``` html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/vue-audio-mixer/dist/vue-audio-mixer.min.css">
</head>
<body>

<div id="app">
  <vue-audio-mixer :config="config" ></vue-audio-mixer>
</div>
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-audio-mixer/dist/vue-audio-mixer.min.js"></script>

<script>
const app = new Vue({
  el: '#app',
  data : function(){     
    return {
      config: {
        "tracks":[
            {
                "title":"Strings1",
                "url":"https://api.soundcloud.com/tracks/515722791/stream?client_id=ae1dadcc70f054f451de8c6358bcf396",
                "pan":-60,
                "gain":0.5,
                "muted":false
            },
            {
                "title":"Strings2",
                "url":"https://api.soundcloud.com/tracks/515722791/stream?client_id=ae1dadcc70f054f451de8c6358bcf396",
                "pan":81,
                "gain":"1.08",
                "muted":true
            },
            {
                "title":"Strings3",
                "url":"https://api.soundcloud.com/tracks/515722791/stream?client_id=ae1dadcc70f054f451de8c6358bcf396",
                "pan":-49,
                "gain":"0.85",
                "muted":true
            }
        ],
        "master":{
            "pan":0,
            "gain":"0.85",
            "muted":false
        }
      }
    }  
    
  }
})
</script> 

</body>
</html>


```

## Support us

Vue Audio Mixer is developed and maintained by Realstrings in support of Samaritans. If Vue-Audio-Mixer makes it to your production environment, we would appreciate you making a donation at the following link. https://www.justgiving.com/fundraising/onlineaudiomixer
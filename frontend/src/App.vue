<template>
  <div id="app">
    <h1>Audio Recorder</h1>
    <button id="startBtn" :disabled="recording" @click="start">Start Recording</button>
    <button id="stopBtn" :disabled="!recording" @click="stop">Stop Recording</button>
    <h2>Transcription:</h2>
    <p id="transcription">{{ transcription }}</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      recording: false,
      mediaRecorder: null,
      audioChunks: [],
      transcription: ''
    }
  },
  methods: {
    async start() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.mediaRecorder.start();
      this.recording = true;
      this.audioChunks = []; // Reset audio chunks

      this.mediaRecorder.ondataavailable = event => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioChunks = [];
        
        // Send the audio blob to the backend
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        const response = await fetch('http://localhost:3000/api/upload-audio', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        this.transcription = result.transcription; // Update transcription
      };
    },
    stop() {
      this.mediaRecorder.stop();
      this.recording = false;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

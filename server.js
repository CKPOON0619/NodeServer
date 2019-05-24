const speech = require('@google-cloud/speech');
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

const readF32ArrBufferAsInt16Arr=(bufferReceived)=>{
  const buffer=new Buffer.from(bufferReceived)
  const result = new Int16Array(buffer.length / 4);
  for (var i = 0, p = 0; i < buffer.length; i += 4, ++p){
    result[p] = 32767 * Math.min(1, buffer.readFloatLE(i))
  }
  return result
}

// Creates a client
 const client = new speech.SpeechClient();

// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
const encoding = 'LINEAR16';
const sampleRateHertz = 48000;
const languageCode = 'en-US';
const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  single_utterance: true
};
const speechCallback=data =>{
  console.log({data})
  if (data.results && data.results[0]) {
    websocket.send('Serve:',JSON.stringify(data.results[0]));
  }

  return process.stdout.write(
    data.results[0] && data.results[0].alternatives[0]
      ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
      : `\n\nReached transcription time limit, press Ctrl+C\n`
  )
}


wss.on('connection', ws => {
  
// Create a recognize stream
  var recognizeStream=client.streamingRecognize(request)

  ws.on('message', message => {
    //if(message.key==='audioBuffer'){
      //console.log(message)
      const audioInput=readF32ArrBufferAsInt16Arr(message)
      recognizeStream.write(audioInput)
      console.log(recognizeStream)
      //console.log(recognizeStream)
      //console.log('audioIput:',audioInput)
      //console.log(client.streamingRecognize({audio_content:audioInput.buffer}))
    //}
    // if(message.key==='streamingStop'){
    //   recognizeStream.removeListener('data', speechCallback)
    //   recognizeStream=null
    // }
  })

  ws.on('close',(code,reason)=>{
    console.log('ws:code:',code,'reason:',reason)
    recognizeStream.removeListener('data', speechCallback)
    recognizeStream=null
  })
  
  recognizeStream.on('error', console.error).on('data', speechCallback)
  ws.send('Server:WebSocket connection confirmed...')
})


// const express = require('express');
// const app = express();
// const port = process.env.PORT || 5000;

// // console.log that your server is up and running
// app.listen(port, () => console.log(`Listening on port ${port}`));

// // create a GET route
// app.get('/express_backend', (req, res) => {
//   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
// });

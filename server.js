const speech = require('@google-cloud/speech');
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

const readF32ArrBufferAsInt16Arr=(bufferReceived)=>{
  const buffer=new Buffer(bufferReceived)
  const result = new Int16Array(buffer.length / 4);
  for (var i = 0, p = 0; i < buffer.length; i += 4, ++p){
    result[p] = 32767 * Math.min(1, buffer.readFloatLE(i))
  }
  return result
}

// Creates a client
// const client = new speech.SpeechClient();

// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// const encoding = 'Encoding of the audio file, e.g. LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'BCP-47 language code, e.g. en-US';
// const request = {
//   config: {
//     encoding: encoding,
//     sampleRateHertz: sampleRateHertz,
//     languageCode: languageCode,
//   },
//   interimResults: false, // If you want interim results, set this to true
// };

// // Create a recognize stream
// const recognizeStream = client
//   .streamingRecognize(request)
//   .on('error', console.error)
//   .on('data', data =>
//     process.stdout.write(
//       data.results[0] && data.results[0].alternatives[0]
//         ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
//         : `\n\nReached transcription time limit, press Ctrl+C\n`
//     )
//   );

wss.on('connection', ws => {
  ws.on('message', message => {
    const audioInput=readF32ArrBufferAsInt16Arr(message)
    console.log({message})
    console.log(recognizeStream(audioInput))
  })
  ws.send('WebSocket connection confirmed...')
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

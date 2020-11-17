const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

// Crear un identificador para la sesión
const sessionId = uuid.v4();

app.use(bodyParser.urlencoded({ extended:false }));

app.use(bodyParser.json());

// Enviar texto a Dialogflow
app.post('/', (req, res) => {
  console.log(req.body.query.text);
  SendInput(req.body.query.text).then(data =>{
     res.send({Reply:data});
   });
});

// Función para enviar texto a dialogflow
async function SendInput(msg, projectId = 'ropa-9fdm') {

  // Crear una nueva sesión
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "ropa-9fdm-cf2ed6b63bff.json"
  });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // Respuesta de la consulta a dialogflow
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // El texto que se envía al agente
        text: msg,
        languageCode: 'en-US',
      },
    },
  };

  // Respuesta
  const responses = await sessionClient.detectIntent(request);
  console.log('Intent detectado');
  const result = responses[0].queryResult;
  console.log(`Texto: ${result.queryText}`);
  console.log(`Respuesta de Dialogflow: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`Intent: ${result.intent.displayName}`);
  } else {
    console.log(`Hay un error`);
  }

  return result.fulfillmentText;
}

// Escuchar en el puerto 3000
app.listen(port, () => {
  console.log("Listen on port", port);
});
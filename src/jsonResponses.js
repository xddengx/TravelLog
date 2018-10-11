const logs = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // sending response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// repsonse without a message/json body
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// 200 - successful
const getLog = (request, response) => {
    
  const jsonResponse = {
    logs,
  };

  return respondJSON(request, response, 200, jsonResponse);
};

const searchQuery = (request, response, params) =>{
  // 
  let keys = Object.keys(logs);
  // destination through ajax. Get the value of key. parmas returns { destination: 'Maine' }
  let destination = Object.values(params); // destination = ['Maine'];
  let parseDestination = destination[0];

  if(!params.destination){
    let jsonResponse = {
      id: "No param",
      message: "Parameter not found",
    }
    return respondJSON(request, response, 400, jsonResponse);
  }

  // direct query search
  // for(let a = 0; a < keys.length; a++){
  //   // console.dir(logs[keys[a]]);
  //   // console.dir(keys[a]);
  //   // console.dir(logs[keys[a]].destination);
  //   // if the destination search is found within the logs return the destination's object
  //   if(params.destination === logs[keys[a]].destination){
  //     let jsonResponse = {
  //       message: logs[keys[a]],
  //     }

  //     return respondJSON(request, response, 200, jsonResponse);
  //   }
  // }

      
  for(let b = 0; b < keys.length; b++){
    let destNum = Object.values(logs[keys[b]])[b]; //return 1 or the found destNum
  
    // store logs[keys[a]] in a new object
    if(parseDestination === logs[keys[b]].destination){
      const destinations = {};
      destinations[destNum] = {};

      let destKeys = Object.keys(logs[keys[b]]);  // returns the object of all keys
      let destValues = Object.values(logs[keys[b]]); // returns the object of all values
      
      // KEEP THIS 
      for(let c = 0; c < destKeys.length; c++){
        // parsedDestKeys = destKeys[c];
        // parsedDestValues = destValues[c];
        // console.dir(parsedDestKeys); // length, logNum, etc.
        // console.dir(parsedDestValues);

        console.dir(destKeys[c]);
        console.dir(destValues[c]);

        
        destinations[destNum].destKeys[c] = destValues[c];  //Cannot set property '0' of undefined

      }

      let jsonResponse = {
        destinations,
      }
      return respondJSON(request, response, 200, jsonResponse);
    }
  }

  // if the destination wasnt found, 400 error
  let jsonResponse = {
    id: "Failed to find log destination",
    message: "This destination was not found in the logs.",
  }
  return respondJSON(request, response, 400, jsonResponse);
};

const getLogMeta = (request, response) => {
  respondJSON(request, response, 200);
};

// POST
const addLog = (request, response, body) => {
  const jsonResponse = {
    message: 'Log Number, travel start date and end date, and destination are required.',
  };

  // validation, 400 - bad request
  if (!body.startDate || !body.endDate || !body.destination || !body.logNum) {
    jsonResponse.id = 'missingParams';
    return respondJSON(request, response, 400, jsonResponse);
  }

  let responseCode = 201;

  // && logs[body.endDate] && logs[body.destination]
  if (logs[body.logNum]) {
    responseCode = 204;
  } else {
    // create new log
    logs[body.logNum] = {};
  }

  // adding/updating logs
  logs[body.logNum].logNum = body.logNum;
  logs[body.logNum].startDate = body.startDate;
  logs[body.logNum].endDate = body.endDate;
  logs[body.logNum].destination = body.destination;
  logs[body.logNum].carrier = body.carrier;
  logs[body.logNum].currency = body.currency;
  logs[body.logNum].expenses = body.expenses;
  logs[body.logNum].sites = body.sites;
  logs[body.logNum].image = body.image;

  //   console.dir(logs[body.startDate]);

  if (responseCode === 201) {
    jsonResponse.message = 'Log Created Successfully';
    return respondJSON(request, response, responseCode, jsonResponse);
  }

  // 204 success without message
  return respondJSONMeta(request, response, responseCode);
};

// 404 error message
const notFound = (request, response) => {
  const jsonResponse = {
    id: 'notFound',
    message: 'The page you are looking for is not found',
  };

  respondJSON(request, response, 404, jsonResponse);
};

// 404 no error message
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getLog,
  getLogMeta,
  addLog,
  searchQuery,
  notFound,
  notFoundMeta,
};

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

const getLogMeta = (request, response) => {
  respondJSON(request, response, 200);
};

// POST
const addLog = (request, response, body) => {
  const jsonResponse = {
    message: 'Travel Start, End, and Destination are required.',
  };

  // validation, 400 - bad request
  if (!body.startDate || !body.endDate || !body.destination) {
    jsonResponse.id = 'missingParams';
    return respondJSON(request, response, 400, jsonResponse);
  }

  let responseCode = 201;

  // && logs[body.endDate] && logs[body.destination]
  if (logs[body.destination]) {
    responseCode = 204;
  } else {
    // create new log
    logs[body.destination] = {};
  }

  // adding/updating logs
  logs[body.destination].startDate = body.startDate;
  logs[body.destination].endDate = body.endDate;
  logs[body.destination].destination = body.destination;
  logs[body.destination].carrier = body.carrier;
  logs[body.destination].currency = body.currency;
  logs[body.destination].expenses = body.expenses;
  logs[body.destination].sites = body.sites;

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
  notFound,
  notFoundMeta,
};

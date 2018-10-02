"use strict";

var parseJSON = function parseJSON(xhr, content) {
  //parse response (obj will be empty in a 204 updated)
  var obj = JSON.parse(xhr.response);
  // console.dir(obj);   

  //if message in response, add to screen
  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = 'Message: ' + obj.message;
    content.appendChild(p);
  }

  var keys = Object.keys(obj); //returns logs (obj.logs)
  for (var i = 0; i < keys.length; i++) {
    console.log(obj[keys[0]]);
  }

  // if logs in response, add to screen
  if (obj.logs) {
    var _keys = Object.keys(obj);

    for (var _i = 0; _i < _keys.length; _i++) {
      console.log(obj[_keys[_i]]);

      var logsList = document.createElement('p');
      var logs = JSON.stringify(obj[_keys[_i]]);
      logsList.textContent = logs;
      content.appendChild(logsList);
    }
  }
};

var handleResponse = function handleResponse(xhr, parseResponse) {
  var content = document.querySelector('#content');
  switch (xhr.status) {
    case 200:
      content.innerHTML = '<b>Success</b>';
      break;
    case 201:
      content.innerHTML = '<b> Create</b>';
      break;
    case 204:
      content.innerHTML = '<b> Updated(No Content)</b>';
      return;
    case 400:
      content.innerHTML = '<b> Bad Request </b>';
      break;
    case 404:
      //if not found
      content.innerHTML = '<b>Resource Not Found</b>';
      break;
    default:
      //any other status
      content.innerHTML = 'Error code not implemented by client.';
      break;
  }

  if (parseResponse) {
    parseJSON(xhr, content);
  }
};

var sendPost = function sendPost(e, logForm) {
  // get logForm action 
  var nameAction = logForm.getAttribute('action');
  var nameMethod = logForm.getAttribute('method');

  // grab the fields 
  var logInputs = document.forms['logForm'].getElementsByTagName('input');

  // create a new AJAX request 
  var xhr = new XMLHttpRequest();
  // set the method (POST) and url (action attribute from log form)
  xhr.open(nameMethod, nameAction);

  // set request to x-www-form-urlencoded
  // same format as query string key=value&key2=value2
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //set our requested response type as JSON response
  xhr.setRequestHeader('Accept', 'application/json');

  // set function to handle the response
  xhr.onload = function () {
    return handleResponse(xhr, true);
  };

  var formData = void 0;
  for (var i = 0; i < logInputs.length - 1; i++) {
    formData = 'startDate=' + logInputs[0].value + '&endDate=' + logInputs[1].value + '&destination=' + logInputs[2].value + '&carrier=' + logInputs[3].value + '&currency=' + logInputs[4].value + '&expenses=' + logInputs[5].value + '&sites=' + logInputs[6].value;
  }
  // send our request with the data
  xhr.send(formData);

  //prevent the browser's default action (to send the form on its own)
  e.preventDefault();
  //return false to prevent the browser from trying to change page
  return false;
};

var requestLog = function requestLog(e, storedForm) {
  var searchSelect = storedForm.querySelector('#searchSelect').value;
  console.log(searchSelect);
  // crate a new AJAX request
  var xhr = new XMLHttpRequest();
  if (searchSelect == '/allLogs') {
    xhr.open('GET', searchSelect);

    xhr.setRequestHeader('Accept', 'application/json');

    //set onload to parse request and get json message
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };

    //send ajax request
    xhr.send();

    //cancel browser's default action
    e.preventDefault();
    //return false to prevent page redirection from a form
    return false;
  }
};

var init = function init() {
  var logForm = document.querySelector('#logForm'); // get add log form
  var storedForm = document.querySelector('#storedForm'); // get stored log form

  // create log
  var addLog = function addLog(e) {
    return sendPost(e, logForm);
  };

  // get Log
  var getLog = function getLog(e) {
    return requestLog(e, storedForm);
  };

  logForm.addEventListener('submit', addLog);
  storedForm.addEventListener('submit', getLog);
};

window.onload = init;

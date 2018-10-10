"use strict";

var parseJSON = function parseJSON(xhr, notification) {
  //parse response (obj will be empty in a 204 updated)
  var obj = JSON.parse(xhr.response);
  var destination = obj.logs;
  // console.dir(obj);
  console.dir(destination);

  //if message in response, add to screen
  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = "Message: " + obj.message;
    notification.appendChild(p);
  }

  // if logs in response, add to screen
  var divCards = document.querySelectorAll("#content div");
  for (var _p = 0; _p < divCards.length; _p++) {
    divCards[_p].parentNode.removeChild(divCards[_p]);
  }

  var logOptions = document.querySelectorAll('#totalLogs option');
  for (var a = 0; a < logOptions.length; a++) {
    logOptions[a].parentNode.removeChild(logOptions[a]);
  }

  if (destination) {
    var keys = Object.keys(destination);

    for (var i = 0; i < keys.length; i++) {
      var attributes = obj.logs[keys[i]]; // returns the structure

      // create cards for log entries
      var card = document.createElement('div');
      var cssString = "background: aliceblue; padding: 30px; width: 25%; float: left; margin: 10px;";
      card.style.cssText = cssString;

      for (var key in attributes) {
        console.log(key, attributes[key]);
        var cardInfo = document.createElement('p');
        cardInfo.style.fontSize = "19px";
        cardInfo.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + attributes[key];
        if (key == 'carrier') {
          console.log("working");
        }

        card.appendChild(cardInfo);
        // content.appendChild(card);
      }
      content.appendChild(card);

      var loggedNum = obj.logs[keys[i]].logNum; // returns the logged numbers
      var totalLogsEl = document.querySelector('#totalLogs');
      var _logOptions = document.createElement("option");
      console.log("log options after", _logOptions);
      _logOptions.text = loggedNum;
      _logOptions.value = loggedNum;
      totalLogsEl.appendChild(_logOptions);
    }

    // get total number of saved logs
    // let totalLogs = keys.length;
    // let totalLogsEl = document.querySelector('#totalLogs');
    // for(let j = 0; j < totalLogs;j++){
    //   // console.log("hello?");
    //   let logOptions = document.createElement("option");
    //   logOptions.text = j;
    //   logOptions.value = j;
    //   // console.log(logOptions);
    //   totalLogsEl.appendChild(logOptions);  
    // }
  }
};

var handleResponse = function handleResponse(xhr, parseResponse) {
  var notification = document.querySelector('#notification');

  switch (xhr.status) {
    case 200:
      notification.innerHTML = '<b>Success</b>';
      break;
    case 201:
      notification.innerHTML = '<b> Create</b>';
      break;
    case 204:
      notification.innerHTML = '<b> Updated(No Content)</b>';
      return;
    case 400:
      notification.innerHTML = '<b> Bad Request </b>';
      break;
    case 404:
      //if not found
      notification.innerHTML = "<b>Resource Not Found</b>";
      break;
    default:
      //any other status
      notification.innerHTML = "Error code not implemented by client.";
      break;
  }

  if (parseResponse) {
    parseJSON(xhr, notification);
  }
};

var sendPost = function sendPost(e, logForm) {
  // get logForm action 
  var nameAction = logForm.getAttribute('action');
  var nameMethod = logForm.getAttribute('method');
  // grab the fields 
  var logInputs = document.forms['logForm'].getElementsByTagName('input');
  var logNumField = document.querySelector('#logNumField');
  var logNumValue = document.querySelector('#logNumField').value;

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

  // increment log number everytime addLog is clicked. Does not increment if log # already exists
  logNumValue++;
  logNumField.value = logNumValue;

  // if(logNumField.value == 0){
  //   logNumField.value = 0; 
  //   console.log("log num value",logNumValue);
  // }
  // logNumValue++;
  // if(logNumField.value > 1){
  //   logNumValue++;
  //   logNumField.value = logNumValue;  
  // }

  var formData = void 0;
  for (var i = 0; i < logInputs.length - 1; i++) {
    formData = "logNum=" + logInputs[0].value + "&startDate=" + logInputs[1].value + "&endDate=" + logInputs[2].value + "&destination=" + logInputs[3].value + "&carrier=" + logInputs[4].value + "&currency=" + logInputs[5].value + "&expenses=" + logInputs[6].value + "&sites=" + logInputs[7].value;
  }

  // send our request with the data
  xhr.send(formData);
  //prevent the browser's default action (to send the form on its own)
  e.preventDefault();
  //return false to prevent the browser from trying to change page
  return false;
};

var updatePost = function updatePost(e, updateLogForm) {
  console.log("update post here");
  // get logForm action 
  var nameAction = updateLogForm.getAttribute('action');
  var nameMethod = updateLogForm.getAttribute('method');
  // grab the fields 
  var logInputs = document.forms['updateLogForm'].getElementsByTagName('input');
  var logOption = updateLogForm.querySelector('#totalLogs');
  var selectedLog = logOption.options[logOption.selectedIndex].value;

  if (!selectedLog) {
    alert("no");
  } else {
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
    // increment log number everytime addLog is clicked. Does not increment if log # already exists

    var formData = void 0;
    for (var i = 0; i < logInputs.length - 1; i++) {
      formData = "logNum=" + selectedLog + "&startDate=" + logInputs[0].value + "&endDate=" + logInputs[1].value + "&destination=" + logInputs[2].value + "&carrier=" + logInputs[3].value + "&currency=" + logInputs[4].value + "&expenses=" + logInputs[5].value + "&sites=" + logInputs[6].value;
    }

    // send our request with the data
    xhr.send(formData);
    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();
    //return false to prevent the browser from trying to change page
    return false;
  }
};

var requestLog = function requestLog(e, storedForm) {
  var searchSelect = storedForm.querySelector('#searchSelect').value;
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
  var updateLogForm = document.querySelector('#updateLogForm'); // get stored log form

  // create log
  var addLog = function addLog(e) {
    return sendPost(e, logForm);
  };
  // get Log
  var getLog = function getLog(e) {
    return requestLog(e, storedForm);
  };
  // update log
  var updateLog = function updateLog(e) {
    return updatePost(e, updateLogForm);
  };

  logForm.addEventListener('submit', addLog);
  storedForm.addEventListener('submit', getLog);
  updateLogForm.addEventListener('submit', updateLog);
};
window.onload = init;

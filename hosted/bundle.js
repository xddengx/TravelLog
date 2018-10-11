"use strict";

// parse json returned

var parseJSON = function parseJSON(xhr, notification) {
  //parse response (obj will be empty in a 204 updated)
  var obj = JSON.parse(xhr.response);
  var destination = obj.logs;
  console.dir(obj);

  // if message in response, add to screen
  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = "Message: " + obj.message;
    notification.appendChild(p);
  }

  // clear created cards (prevents duplicates from being created)
  var divCards = document.querySelectorAll("#content div");
  for (var _p = 0; _p < divCards.length; _p++) {
    divCards[_p].parentNode.removeChild(divCards[_p]);
  }

  // clear options before append new options to dropdown select for updating logs
  var logOptions = document.querySelectorAll('#totalLogs option');
  for (var a = 0; a < logOptions.length; a++) {
    logOptions[a].parentNode.removeChild(logOptions[a]);
  }

  // if log exists
  if (destination) {
    var keys = Object.keys(destination); // return object keys

    for (var i = 0; i < keys.length; i++) {
      var attributes = obj.logs[keys[i]]; // returns the structure
      // console.log(attributes.image);

      // create cards for log entries
      var card = document.createElement('div');
      var cssString = "background: aliceblue; padding: 30px; width: 25%; float: left; margin: 10px;";
      card.style.cssText = cssString;

      // print the attributes for every key
      for (var key in attributes) {
        // console.log(key, attributes[key]);

        // if the key is an image, instead of printing the url text string, show the image
        if (key == 'image') {
          var img = document.createElement('img');
          img.style = "width: 250px; height:200px";
          if (img.src = attributes.image) {
            card.appendChild(img);
          }
        }
        // show the text strings for everything else
        else {
            var cardInfo = document.createElement('p');
            cardInfo.style.fontSize = "19px";
            cardInfo.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + attributes[key];
            card.appendChild(cardInfo);
          }
      }
      content.appendChild(card);

      // get the total number of logs added. 
      // create an option for each log number
      // append the option to the select element
      var loggedNum = obj.logs[keys[i]].logNum; // returns the logged numbers
      var totalLogsEl = document.querySelector('#totalLogs');
      var _logOptions = document.createElement("option");

      _logOptions.text = loggedNum;
      _logOptions.value = loggedNum;
      totalLogsEl.appendChild(_logOptions);
    }
  }

  // if a specific destination was searched. it returns that specific object
  // if(obj.message){
  //   console.log("hello");

  // }
};

// handle response requests
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

  // if true, call parsJSON function 
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

  var formData = void 0;
  for (var i = 0; i < logInputs.length - 1; i++) {
    formData = "logNum=" + logInputs[0].value + "&startDate=" + logInputs[1].value + "&endDate=" + logInputs[2].value + "&destination=" + logInputs[3].value + "&carrier=" + logInputs[4].value + "&currency=" + logInputs[5].value + "&expenses=" + logInputs[6].value + "&sites=" + logInputs[7].value + "&image=" + logInputs[8].value;
  }

  console.log("formdata", formData);
  // send our request with the data
  xhr.send(formData);

  // clear form after data is sent
  document.querySelector("#logForm").reset();

  // place increment after form clearing to prevent log number from going back to 0
  // increment log number everytime addLog is clicked. Does not increment if log # already exists
  logNumValue++;
  logNumField.value = logNumValue;

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
  var logOption = updateLogForm.querySelector('#totalLogs'); // html select element
  //   let selectedLog;

  // if logOption does not contain any option elements and the selected index is null
  // alert user to Get Logs and pick a log #
  if (!logOption.options[logOption.selectedIndex]) {
    console.log("here ekf");

    // if selected log num is undefined
    if (!logOption.options[logOption.selectedIndex].value) {
      console.log("false");
    }
  }
  if (logOption.options[logOption.selectedIndex] && logOption.options[logOption.selectedIndex].value) {
    var selectedLog = logOption.options[logOption.selectedIndex].value;
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
      formData = "logNum=" + selectedLog + "&startDate=" + logInputs[0].value + "&endDate=" + logInputs[1].value + "&destination=" + logInputs[2].value + "&carrier=" + logInputs[3].value + "&currency=" + logInputs[4].value + "&expenses=" + logInputs[5].value + "&sites=" + logInputs[6].value + "&image=" + logInputs[7].value;
    }

    // send our request with the data
    xhr.send(formData);

    // clear form after data is sent
    document.querySelector("#updateLogForm").reset();

    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();
    //return false to prevent the browser from trying to change page
    return false;
  }
};

var requestLog = function requestLog(e, storedForm) {
  var searchSelect = storedForm.querySelector('#searchSelect').value;
  var specificDestination = storedForm.querySelector('#specificDestination').value;

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

    document.querySelector("#storedForm").reset();

    //cancel browser's default action
    e.preventDefault();
    //return false to prevent page redirection from a form
    return false;
  }

  // create a query string send to ajax and good to go 
  if (searchSelect == '/search') {
    var queryString = searchSelect + '?' + 'destination=' + specificDestination;

    xhr.open('GET', queryString);
    xhr.setRequestHeader('Accept', 'application/json');
    //set onload to parse request and get json message
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
    //send ajax request
    xhr.send();

    document.querySelector("#storedForm").reset();

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
"use strict";

function dateValidation(value) {
    var reg = "/^(((0?[1-9]|1[012])\/(0?[1-9]|1\d|2[0-8])|(0?[13456789]|1[012])\/(29|30)|(0?[13578]|1[02])\/31)\/(19|[2-9]\d)\d{2}|0?2\/29\/((19|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00)))$/";
    return value.match(reg);
}

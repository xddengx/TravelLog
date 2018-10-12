"use strict";

// separate function to create cards

var createCards = function createCards(attributes) {
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
};

// parse json returned
var parseJSON = function parseJSON(xhr, notification) {
  var obj = JSON.parse(xhr.response);
  var destination = obj.logs; // return log objects (logs created )
  var theDestinations = obj.searchDest; // return searched destination objects (get logs - search query)


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

  var keys = void 0;
  var attributes = void 0;
  // if searched destination object exists (displaying specific logs)
  if (theDestinations) {
    keys = Object.keys(theDestinations); // return object keys

    for (var i = 0; i < keys.length; i++) {
      attributes = obj.searchDest[keys[i]]; // returns the structure
      createCards(attributes);
    }
  }

  // if destinations exists (displaying all logs)
  if (destination) {
    keys = Object.keys(destination); // return object keys

    for (var _i = 0; _i < keys.length; _i++) {
      attributes = obj.logs[keys[_i]]; // returns the structure

      // get the total number of logs added. 
      // create an option for each log number
      // append the option to the select element
      var loggedNum = obj.logs[keys[_i]].logNum; // returns the logged numbers
      var totalLogsEl = document.querySelector('#totalLogs');
      var _logOptions = document.createElement("option");
      _logOptions.text = loggedNum;
      _logOptions.value = loggedNum;
      totalLogsEl.appendChild(_logOptions);

      createCards(attributes);
    }
  }
};

// handle response requests
var handleResponse = function handleResponse(xhr, parseResponse) {
  var notification = document.querySelector('#notification');

  switch (xhr.status) {
    case 200:
      // success
      notification.innerHTML = '<b>Success</b>';
      break;
    case 201:
      // create
      notification.innerHTML = '<b> Create</b>';
      break;
    case 204:
      // update
      notification.innerHTML = '<b> Updated(No Content)</b>';
      return;
    case 400:
      // bad request
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

// POST - creates a log if successful
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

  console.log(!date1(logInputs[1].value));

  // VALIDATION - validating date (on hold, regrex not found for dd/mm/yy)
  // if(date1(logInputs[1].value) && date2(logInputs[1].value) &&  date3(logInputs[1].value) && date4(logInputs[1].value) == false){
  //   alert("Enter a valid date");
  // }else{

  var formData = void 0;
  for (var i = 0; i < logInputs.length - 1; i++) {
    formData = "logNum=" + logInputs[0].value + "&startDate=" + logInputs[1].value + "&endDate=" + logInputs[2].value + "&destination=" + logInputs[3].value + "&carrier=" + logInputs[4].value + "&currency=" + logInputs[5].value + "&expenses=" + logInputs[6].value + "&sites=" + logInputs[7].value + "&image=" + logInputs[8].value;
  }

  // send our request with the data
  xhr.send(formData);

  // } // end bracket for validation (if i decide to include it)

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

// UPDATE - updating logs if exists
var updatePost = function updatePost(e, updateLogForm) {
  // get logForm action 
  var nameAction = updateLogForm.getAttribute('action');
  var nameMethod = updateLogForm.getAttribute('method');
  // grab the fields 
  var logInputs = document.forms['updateLogForm'].getElementsByTagName('input');
  var logOption = updateLogForm.querySelector('#totalLogs'); // html select element

  // if logOption does not contain any option elements and the selected index is null
  // alert user to Get Logs and pick a log #
  if (!logOption.options[logOption.selectedIndex] || !logOption.options[logOption.selectedIndex].value) {
    alert("Log Number was not selected. Click on 'Get Logs' with 'All logs' option to  populate selection box with log numbers.");
  }

  if (logOption.options[logOption.selectedIndex] && logOption.options[logOption.selectedIndex].value) {
    var selectedLog = logOption.options[logOption.selectedIndex].value;
    var xhr = new XMLHttpRequest();
    xhr.open(nameMethod, nameAction);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
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
  }
  e.preventDefault();
  return false;
  //   }
};

// GET - retrieve log if exists
var requestLog = function requestLog(e, storedForm) {
  var searchSelect = storedForm.querySelector('#searchSelect').value;
  var specificDestination = storedForm.querySelector('#specificDestination').value;

  // crate a new AJAX request
  var xhr = new XMLHttpRequest();
  if (searchSelect == '/allLogs') {
    xhr.open('GET', searchSelect);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
    xhr.send();

    document.querySelector("#storedForm").reset();

    e.preventDefault();
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

//date including leap years since 1900 mm and dd could have 1 or 2 digits with 4 digit year and / separator
function date1(value) {
    var reg = new RegExp("/^(((0?[1-9]|1[012])\/(0?[1-9]|1\d|2[0-8])|(0?[13456789]|1[012])\/(29|30)|(0?[13578]|1[02])\/31)\/(19|[2-9]\d)\d{2}|0?2\/29\/((19|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00)))$/");

    return reg.test(value);
}

// Date with leap years. Accepts '.' '-' and '/' as separators d.m.yy to dd.mm.yyyy (or d.mm.yy, etc) 
//Ex: dd-mm-yyyy d.mm/yy dd/m.yyyy etc etc Accept 00 years also.
function date2(value) {
    var reg = new RegExp("/^((((0?[1-9]|[12]\d|3[01])[\.\-\/](0?[13578]|1[02])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|[12]\d|30)[\.\-\/](0?[13456789]|1[012])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|1\d|2[0-8])[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|(29[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|1\d|2[0-8])02((1[6-9]|[2-9]\d)?\d{2}))|(2902((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$/");

    return reg.test(value);
}

// mm/dd/yyyy format
function date3(value) {
    var reg = new RegExp(/(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/);

    return reg.test(value);
}

// mm-dd-yyyy
function date4(value) {
    var reg = new RegExp("/(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)\d\d/");

    return reg.test(value);
}

// check image url
function imageValid(value) {
    var reg = new RegExp('/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png/g');

    return reg.test(value);
}

function testing(value) {
    var reg = new RegExp("/^[A-Za-z0-9]+$/");

    return reg.test(value);
}

"use strict";

// parse json returned
const parseJSON = (xhr, notification) => {
  //parse response (obj will be empty in a 204 updated)
  const obj = JSON.parse(xhr.response);
  const destination = obj.logs; // return log objects (logs created )
  const theDestinations = obj.searchDest;  // return searched destination objects (get logs - search query)
  // console.dir(obj);
  console.dir(theDestinations);

  // if message in response, add to screen
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    notification.appendChild(p);
  }

  // clear created cards (prevents duplicates from being created)
  let divCards = document.querySelectorAll("#content div");
  for(let p = 0; p < divCards.length; p++){
    divCards[p].parentNode.removeChild(divCards[p]);
  }

  // clear options before append new options to dropdown select for updating logs
  let logOptions = document.querySelectorAll('#totalLogs option')
  for(let a = 0; a < logOptions.length; a++){
    logOptions[a].parentNode.removeChild(logOptions[a]);
  }

  // if log exists
  if(theDestinations) {
    let keys = Object.keys(theDestinations);  // return object keys
    console.log(keys);

    for(let i = 0; i < keys.length;i++){
      let attributes = obj.searchDest[keys[i]]; // returns the structure
      console.log(attributes);

      // create cards for log entries
      let card = document.createElement('div');
      let cssString = "background: aliceblue; padding: 30px; width: 25%; float: left; margin: 10px;";
      card.style.cssText = cssString;

      // print the attributes for every key
      for(let key in attributes){
        // console.log(key, attributes[key]);

        // if the key is an image, instead of printing the url text string, show the image
        if(key == 'image'){
          var img = document.createElement('img');
          img.style = "width: 250px; height:200px";
          if(img.src = attributes.image){
            card.appendChild(img);
          }    
        }
        // show the text strings for everything else
        else{
          let cardInfo = document.createElement('p');
          cardInfo.style.fontSize = "19px";
          cardInfo.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + attributes[key];
          card.appendChild(cardInfo);
        }
      }
      content.appendChild(card);   
    }
  }

  // if log exists
  if(destination) {
    let keys = Object.keys(destination);  // return object keys
    console.log(keys);

    for(let i = 0; i < keys.length;i++){
      let attributes = obj.logs[keys[i]]; // returns the structure
      // console.log(attributes.image);

      // create cards for log entries
      let card = document.createElement('div');
      let cssString = "background: aliceblue; padding: 30px; width: 25%; float: left; margin: 10px;";
      card.style.cssText = cssString;

      // print the attributes for every key
      for(let key in attributes){
        // console.log(key, attributes[key]);

        // if the key is an image, instead of printing the url text string, show the image
        if(key == 'image'){
          var img = document.createElement('img');
          img.style = "width: 250px; height:200px";
          if(img.src = attributes.image){
            card.appendChild(img);
          }    
        }
        // show the text strings for everything else
        else{
          let cardInfo = document.createElement('p');
          cardInfo.style.fontSize = "19px";
          cardInfo.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + attributes[key];
          card.appendChild(cardInfo);
        }
      }
      content.appendChild(card);   
    
      // get the total number of logs added. 
      // create an option for each log number
      // append the option to the select element
      let loggedNum = obj.logs[keys[i]].logNum; // returns the logged numbers
      let totalLogsEl = document.querySelector('#totalLogs');
      let logOptions = document.createElement("option");
      
      logOptions.text = loggedNum;
      logOptions.value = loggedNum;
      totalLogsEl.appendChild(logOptions);  
    }
  }
  
  // if a specific destination was searched. it returns that specific object
  // if(obj.message){
  //   console.log("hello");

  // }
};

// handle response requests
const handleResponse = (xhr, parseResponse) =>{
  const notification = document.querySelector('#notification');

  switch(xhr.status){
    case 200: // success
    notification.innerHTML = '<b>Success</b>';
      break;
    case 201: //create
    notification.innerHTML = '<b> Create</b>';
      break;
    case 204: //update
    notification.innerHTML = '<b> Updated(No Content)</b>';
      return;
    case 400:
    notification.innerHTML = '<b> Bad Request </b>';
      break;
    case 404: //if not found
    notification.innerHTML = `<b>Resource Not Found</b>`;
      break;
    default: //any other status
    notification.innerHTML = `Error code not implemented by client.`;
      break;
  }
  
  // if true, call parsJSON function 
  if(parseResponse){    
    parseJSON(xhr, notification);
  }
};

// POST - creates a log if successful
const sendPost = (e,logForm) =>{
  // get logForm action 
  const nameAction = logForm.getAttribute('action');
  const nameMethod = logForm.getAttribute('method');  
  // grab the fields 
  let logInputs = document.forms['logForm'].getElementsByTagName('input');
  let logNumField = document.querySelector('#logNumField');
  let logNumValue = document.querySelector('#logNumField').value;

  // create a new AJAX request 
  const xhr = new XMLHttpRequest();
  // set the method (POST) and url (action attribute from log form)
  xhr.open(nameMethod, nameAction); 
  // set request to x-www-form-urlencoded
  // same format as query string key=value&key2=value2
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //set our requested response type as JSON response
  xhr.setRequestHeader ('Accept', 'application/json');  
  // set function to handle the response
  xhr.onload = () => handleResponse(xhr, true); 

  console.log(!date1(logInputs[1].value));

  // VALIDATION - validating date
  // if(date1(logInputs[1].value) && date2(logInputs[1].value) &&  date3(logInputs[1].value) && date4(logInputs[1].value) == false){
  //   alert("Enter a valid date");
  // }else{

  let formData; 
  for(let i = 0; i < logInputs.length-1; i++){
    formData = `logNum=${logInputs[0].value}&startDate=${logInputs[1].value}&endDate=${logInputs[2].value}&destination=${logInputs[3].value}&carrier=${logInputs[4].value}&currency=${logInputs[5].value}&expenses=${logInputs[6].value}&sites=${logInputs[7].value}&image=${logInputs[8].value}`;
  }

  // send our request with the data
  xhr.send(formData);

// } // end bracket for validation (if using)
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
}

// UPDATE - updating logs if exists
const updatePost = (e,updateLogForm) =>{
  console.log("update post here");
  // get logForm action 
  const nameAction = updateLogForm.getAttribute('action');
  const nameMethod = updateLogForm.getAttribute('method');  
  // grab the fields 
  let logInputs = document.forms['updateLogForm'].getElementsByTagName('input');
  let logOption = updateLogForm.querySelector('#totalLogs');    // html select element


// NEED TO FIX ORDER OF IF STATEMENTS
// if logOption does not contain any option elements and the selected index is null
  // alert user to Get Logs and pick a log #
  if(!logOption.options[logOption.selectedIndex]){
    alert("Log Number was not selected. Click on 'Get Logs' with 'All logs' option to  populate selection box with log numbers");
  }
  
  // if selected log num is undefined
  if(!logOption.options[logOption.selectedIndex] || !logOption.options[logOption.selectedIndex].value){
      alert("test");
  }
  
  if(logOption.options[logOption.selectedIndex] && logOption.options[logOption.selectedIndex].value){
      let selectedLog = logOption.options[logOption.selectedIndex].value;
      const xhr = new XMLHttpRequest();
      xhr.open(nameMethod, nameAction); 
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader ('Accept', 'application/json');  
      xhr.onload = () => handleResponse(xhr, true); 

      let formData; 
      for(let i = 0; i < logInputs.length-1; i++){
        formData = `logNum=${selectedLog}&startDate=${logInputs[0].value}&endDate=${logInputs[1].value}&destination=${logInputs[2].value}&carrier=${logInputs[3].value}&currency=${logInputs[4].value}&expenses=${logInputs[5].value}&sites=${logInputs[6].value}&image=${logInputs[7].value}`;
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
const requestLog = (e, storedForm) =>{
  const searchSelect = storedForm.querySelector('#searchSelect').value;
  const specificDestination = storedForm.querySelector('#specificDestination').value;

  // crate a new AJAX request
  const xhr = new XMLHttpRequest();
  if(searchSelect == '/allLogs'){
    xhr.open('GET', searchSelect);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => handleResponse(xhr,true);
    xhr.send();

    document.querySelector("#storedForm").reset();

    e.preventDefault();
    return false;
  }

  // create a query string send to ajax and good to go 
  if(searchSelect == '/search'){
    let queryString = searchSelect + '?' + 'destination=' + specificDestination;
    
    xhr.open('GET', queryString);
    xhr.setRequestHeader('Accept', 'application/json');
    //set onload to parse request and get json message
    xhr.onload = () => handleResponse(xhr,true);
    //send ajax request
    xhr.send();

    document.querySelector("#storedForm").reset();

    //cancel browser's default action
    e.preventDefault();
    //return false to prevent page redirection from a form
    return false;
  }
};

const init = () =>{
  const logForm = document.querySelector('#logForm'); // get add log form
  const storedForm = document.querySelector('#storedForm'); // get stored log form
  const updateLogForm = document.querySelector('#updateLogForm'); // get stored log form

  // create log
  const addLog = (e) => sendPost(e, logForm);
  // get Log
  const getLog = (e) => requestLog(e, storedForm);
  // update log
  const updateLog = (e) => updatePost(e, updateLogForm);
  
  logForm.addEventListener('submit', addLog);
  storedForm.addEventListener('submit', getLog);
  updateLogForm.addEventListener('submit', updateLog);
};
window.onload = init;
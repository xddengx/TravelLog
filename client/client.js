"use strict";

const parseJSON = (xhr, notification) => {
    //parse response (obj will be empty in a 204 updated)
    const obj = JSON.parse(xhr.response);
    const destination = obj.logs;

    //if message in response, add to screen
    if(obj.message) {
      const p = document.createElement('p');
      p.textContent = `Message: ${obj.message}`;
      notification.appendChild(p);
    }

    // if logs in response, add to screen
    let divCards = document.querySelectorAll("#content div");
    for(let p = 0; p < divCards.length; p++){
      divCards[p].parentNode.removeChild(divCards[p]);
    }

    let logOptions = document.querySelectorAll('#totalLogs option')
    for(let a = 0; a < logOptions.length; a++){
      logOptions[a].parentNode.removeChild(logOptions[a]);
    }

  if(destination) {
    let keys = Object.keys(destination);

    for(let i = 0; i < keys.length;i++){
      let attributes = obj.logs[keys[i]]; // returns the structure

      // create cards for log entries
      let card = document.createElement('div');
      let cssString = "background: aliceblue; padding: 30px; width: 25%; float: left; margin: 10px;";
      card.style.cssText = cssString;

      for(let key in attributes){
        // console.log(key, attributes[key]);
        let cardInfo = document.createElement('p');
        cardInfo.style.fontSize = "19px";
        cardInfo.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + attributes[key];
        card.appendChild(cardInfo);
        // content.appendChild(card);
      }
      content.appendChild(card);   
      
      let loggedNum = obj.logs[keys[i]].logNum; // returns the logged numbers
      let totalLogsEl = document.querySelector('#totalLogs');
      let logOptions = document.createElement("option");
      console.log("log options after", logOptions);
      logOptions.text = loggedNum;
      logOptions.value = loggedNum;
      totalLogsEl.appendChild(logOptions);  
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

const handleResponse = (xhr, parseResponse) =>{
  const notification = document.querySelector('#notification');

  switch(xhr.status){
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
    case 404: //if not found
    notification.innerHTML = `<b>Resource Not Found</b>`;
      break;
    default: //any other status
    notification.innerHTML = `Error code not implemented by client.`;
      break;
  }
  
  if(parseResponse){    
    parseJSON(xhr, notification);
  }
};

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

  let formData; 
  for(let i = 0; i < logInputs.length-1; i++){
    formData = `logNum=${logInputs[0].value}&startDate=${logInputs[1].value}&endDate=${logInputs[2].value}&destination=${logInputs[3].value}&carrier=${logInputs[4].value}&currency=${logInputs[5].value}&expenses=${logInputs[6].value}&sites=${logInputs[7].value}`;
  }

  // send our request with the data
  xhr.send(formData);
  //prevent the browser's default action (to send the form on its own)
  e.preventDefault();
  //return false to prevent the browser from trying to change page
  return false;
}

  const updatePost = (e,updateLogForm) =>{
    console.log("update post here");
    // get logForm action 
    const nameAction = updateLogForm.getAttribute('action');
    const nameMethod = updateLogForm.getAttribute('method');  
    // grab the fields 
    let logInputs = document.forms['updateLogForm'].getElementsByTagName('input');
    let logOption = updateLogForm.querySelector('#totalLogs');
    let selectedLog = logOption.options[logOption.selectedIndex].value;
  
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
    // increment log number everytime addLog is clicked. Does not increment if log # already exists

    let formData; 
    for(let i = 0; i < logInputs.length-1; i++){
      formData = `logNum=${selectedLog}&startDate=${logInputs[0].value}&endDate=${logInputs[1].value}&destination=${logInputs[2].value}&carrier=${logInputs[3].value}&currency=${logInputs[4].value}&expenses=${logInputs[5].value}&sites=${logInputs[6].value}`;
    }

    // send our request with the data
    xhr.send(formData);
    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();
    //return false to prevent the browser from trying to change page
    return false;
  };

const requestLog = (e, storedForm) =>{
  const searchSelect = storedForm.querySelector('#searchSelect').value;
  // crate a new AJAX request
  const xhr = new XMLHttpRequest();
  if(searchSelect == '/allLogs'){
    xhr.open('GET', searchSelect);
    xhr.setRequestHeader('Accept', 'application/json');
    //set onload to parse request and get json message
    xhr.onload = () => handleResponse(xhr,true);
    //send ajax request
    xhr.send();
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
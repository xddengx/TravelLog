"use strict";

const parseJSON = (xhr, content) => {
        //parse response (obj will be empty in a 204 updated)
        const obj = JSON.parse(xhr.response);
        // console.dir(obj);   
        
        //if message in response, add to screen
        if(obj.message) {
          const p = document.createElement('p');
          p.textContent = `Message: ${obj.message}`;
          content.appendChild(p);
        }
        
        let keys = Object.keys(obj); //returns logs (obj.logs)
        for(let i = 0; i < keys.length;i++){
          console.log(obj[keys[0]]);

        }

        // if logs in response, add to screen
        if(obj.logs) {
          let keys = Object.keys(obj);
          
          for(let i = 0; i < keys.length;i++){
            console.log(obj[keys[i]]);

              const logsList = document.createElement('p');
              const logs = JSON.stringify(obj[keys[i]]);
              logsList.textContent = logs;
              content.appendChild(logsList);
              
          }
        }
      };

      const handleResponse = (xhr, parseResponse) =>{
      const content = document.querySelector('#content');
      switch(xhr.status){
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
        case 404: //if not found
          content.innerHTML = `<b>Resource Not Found</b>`;
          break;
        default: //any other status
          content.innerHTML = `Error code not implemented by client.`;
          break;
      }
      
      if(parseResponse){
        parseJSON(xhr, content);
      }
    };

      const sendPost = (e,logForm) =>{
        // get logForm action 
        const nameAction = logForm.getAttribute('action');
        const nameMethod = logForm.getAttribute('method');

        // grab the fields 
        let logInputs = document.forms['logForm'].getElementsByTagName('input');
        
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

        let formData;
        for(let i = 0; i < logInputs.length-1; i++){
          formData = `startDate=${logInputs[0].value}&endDate=${logInputs[1].value}&destination=${logInputs[2].value}&carrier=${logInputs[3].value}&currency=${logInputs[4].value}&expenses=${logInputs[5].value}&sites=${logInputs[6].value}`;
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
        console.log(searchSelect);
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

        // create log
        const addLog = (e) => sendPost(e, logForm);

        // get Log
        const getLog = (e) => requestLog(e, storedForm);
        
        logForm.addEventListener('submit', addLog);
        storedForm.addEventListener('submit', getLog);
      };

      window.onload = init;
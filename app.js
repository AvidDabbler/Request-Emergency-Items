import { agol } from './private.js';
import { facility_render, get_survey_data, filter_data, clear_div } from './survey.js';


// HTML VARIALBES
const iframe_div = document.getElementById('ifrm');


// JAVASCRIPT VARIABLES
let inventory


//STATIC URLS
const confirmations = agol().management_geojson;
const request_survey = agol().management_survey;


//HTML SECTION SELECTORS
const list_div = document.getElementById('list');
const item = document.querySelector('button_popup');
const main = document.querySelector('#main');
const metric_divs = document.querySelector('#metric-divs');


//POLYFILLS
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
}};



const clickEvent = (event) => {
    event.preventDefault();
    
    // TARGET VARIABLES
    const iframe_target = event.target.closest('#ifrm');
    const search_target = event.target.closest('#search');
    const list_target = event.target.closest('.openpop');
    const metric_divs_target = event.target.closest('#metric-divs')
    const request_target = event.target.closest('#request')
    const list = event.target.closest('#list')
    const refresh = event.target.closest('#refresh')


    if(!iframe_target && iframe_div){
        iframe_div.parentNode.removeChild(iframe_div);
        return;
    
    }else if(!iframe_div){
        if(request_target){

        }


    // CLICK LIST ITEM
    }else if (list_target){        
        console.log('list element click')
    
        let item = event.target.closest('.openpop');
        let url = item.getAttribute('data-url');
    
        var ifrm = document.createElement('iframe');
        ifrm.setAttribute('id', 'ifrm'); // assign an id
        ifrm.setAttribute(`src`, url);
    
        // to place before another page element
        var el = document.getElementById('marker');
        main.parentNode.insertBefore(ifrm, el);
        

    // CLICK LIST ELEMENT AND OPEN IFRAME!!!
    }else if(!list_target){
        console.log('Not list_div');
        return;


    }
    else{
        console.error('Unregistered Click')


    }
}

console.log(confirmations)
get_survey_data(confirmations).then(data =>{
    inventory = data; 
    console.log(data)
    facility_render(data, list_div, id);
});
window.addEventListener("click", clickEvent, false)
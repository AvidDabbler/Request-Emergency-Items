import { agol } from './private.js';
import { inventory_render, get_survey_data, clear_div } from './survey.js';


// HTML VARIALBES
const iframe_div = document.getElementById('ifrm');


// JAVASCRIPT VARIABLES
let inventory


//JSON URLS
const requestGeo = agol().request_geojson;
const updateGeo = agol().update_geojson;
const shipmentGeo = agol().shipment_geojson;
const confirmGeo = agol().confirm_geojson;


//SURVEY URLS
const requestSurvey = agol().request_survey;
const updateSurvey = agol().update_survey;
const shipmentSurvey = agol().shipment_survey;
const confirmSurvey = agol().confirm_survey;



//HTML SECTION SELECTORS
const mask = document.getElementById('mask');
const lysol = document.getElementById('lysol');
const sanitzer = document.getElementById('sanitzer');
const main = document.querySelector('#main');
const metric_divs = document.querySelector('#metric-divs');
const num_masks = document.querySelector('#num-masks');
const num_lysol = document.querySelector('#num-lysol');
const num_sanitizers = document.querySelector('#num-sanitizer');
const update_time = document.querySelector('#update-time');


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
    }else if (list || refresh){        
        console.log('list element click')
    
        let item = event.target.closest('.openpop');
        let url = item.getAttribute('data-url');
    
        let ifrm = document.createElement('iframe');
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

get_survey_data(requestGeo, updateGeo, shipmentGeo, confirmGeo)
.then(data => {
    inventory_render(data, num_masks, num_lysol, num_sanitizers, update_time);
    return data;
});
window.addEventListener("click", clickEvent, false);
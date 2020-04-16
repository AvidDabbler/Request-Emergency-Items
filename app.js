import { agol } from './private.js';
import { inventory_render, get_survey_data, clear_div } from './survey.js';

(function (){    
    
    // JAVASCRIPT VARIABLES
    let inventory
    
    
    //JSON URLS
    const requestGeo = agol().request_geojson;
    const updateGeo = agol().update_geojson;
    const shipmentGeo = agol().shipment_geojson;
    const confirmGeo = agol().confirm_geojson;
    
    
    //HTML SECTION SELECTORS
    const iframe_div = document.getElementById('ifrm');
    const main = document.querySelector('#main');
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
        
        // TARGET VARIABLES
        const iframe_target = event.target.closest('#ifrm');
        const request_target = event.target.closest('#request');
        const refresh = event.target.closest('#refresh');
        const request_list_target = event.target.closest('#request-list');
        const back = event.target.closest('#back');
        const link = event.target.closest('.link');
        
        if(!link){
            event.preventDefault();
        }
    
        if(!iframe_target && iframe_div){
            iframe_div.parentNode.removeChild(iframe_div);
            return;
        
        }else if(!iframe_div){
    
            if(request_target){
    
            }
            


        // CLICK LIST ITEM
        }else if (refresh){                
            let item = event.target.closest('.openpop');
            let url = item.getAttribute('data-url');
            let ifrm = document.createElement('iframe');

            ifrm.setAttribute('id', 'ifrm'); // assign an id
            ifrm.setAttribute(`src`, url);
        
            // to place before another page element
            var el = document.getElementById('marker');
            main.parentNode.insertBefore(ifrm, el);
            
    
        // CLICK LIST ELEMENT AND OPEN IFRAME!!!
        }else if(requests){
            console.log('Not list_div');
            return; 
        }
        else{
            console.error('Unregistered Click');
            return;
        }
    }
    
    get_survey_data(requestGeo, updateGeo, shipmentGeo, confirmGeo)
    .then(data => {
        inventory_render(data, num_masks, num_lysol, num_sanitizers, update_time);
        return data;
    });
    window.addEventListener("click", clickEvent, false);

})();

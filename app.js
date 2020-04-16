import { agol } from './private.js';
import { inventory_render, get_survey_data, clear_div, check_for_data } from './survey.js';

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
    
    
    const refresh = () => {
        check_for_data(requestGeo, updateGeo, shipmentGeo, confirmGeo)
        .then(data => {
            inventory_render(data.total, num_masks, num_lysol, num_sanitizers, update_time);
            console.log('refresh')

            return data;
        });
    };
    
    const clickEvent = (event) => {
        
        // TARGET VARIABLES
        const iframe_target = event.target.closest('#ifrm');
        const link = event.target.closest('.link');
        
        if(!link){
            event.preventDefault();
        }
    
        if(!iframe_target && iframe_div){
            iframe_div.parentNode.removeChild(iframe_div);
            return;
        
        }else if(refresh){
            refresh();
        }else{
            console.error('Unregistered Click');
            return;
        }
    }
    
    refresh();

    // refresh every 2 minutes
    setInterval(
        () => {
           refresh()
        }, 120000);
    
    window.addEventListener("click", clickEvent, false);

})();

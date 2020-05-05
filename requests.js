// import { agol } from './private.js';
import { agol } from './personal_agol.js';
import { requestList } from './survey.js';

(async () => {    
    
    
    //JSON URLS
    const requestGeo = agol().request_geojson;
    const confirmGeo = agol().confirm_geojson;
    
    
    //HTML SECTION SELECTORS
    const list = document.querySelector('#list');
    
    
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
        requestList(requestGeo, confirmGeo)
        .then(rdata => list.innerHTML = rdata)
    };
    
    const clickEvent = (event) => {
                
        const link = event.target.closest('.link');
        const refresh_target = event.target.closest('#refresh');
                
        if(!link){
            event.preventDefault();
        }
            
        if (refresh_target){  
            refresh();

        }else{
            console.error('Unregistered Click');
            return;
        }
    };
    
    refresh();

    // refresh every 2 minutes
    setInterval(
        () => {
           refresh()
            console.log('refresh')
        }, 120000);
    
    window.addEventListener("click", clickEvent, false);

})();

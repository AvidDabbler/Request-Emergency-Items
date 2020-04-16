import { agol as agol } from './private.js';
import { searching, facility_render, get_survey_data, filter_data, clear_div } from './survey.js';


// HTML VARIALBES
const iframe_div = document.getElementById('ifrm');


// JAVASCRIPT VARIABLES
let facilities, filtered_facilities;
let filtered = false;


//STATIC URLS
const survey123Url = jsonURL();
const id = surveyID();


//HTML SECTION SELECTORS
const list_div = document.getElementById('list');
const item = document.querySelector('button_popup');
const main = document.querySelector('#main');


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


    if(!iframe_target && iframe_div){
        iframe_div.parentNode.removeChild(iframe_div);
        return;
    
    // SEARCH CLICK!!!
    }else if(search_target){
        console.log('search')
        if(search_bar_value != ''){
            console.log('search 1: ', search_bar_value)
            console.log('facilities data: ', facilities)
            filtered_facilities = searching(search_bar_value, filtered, list_div, facilities);
            facility_render(filtered_facilities, list_div, )
            filtered= true;

        }else if(search_bar_value == '' && filtered){
            console.log('search 2')
            facility_render(facilities)
            return;
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


get_survey_data(survey123Url, facilities).then(data =>{
    facilities = data; 
    facility_render(data, list_div, id);
});
window.addEventListener("click", clickEvent, false)
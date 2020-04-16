
// INTERACTIVE HELPER FUNCTIONS
const clear_div = async (div) => {
    div.innerHTML = '';
    return;
};



// DATA HELPER FUNCTIONS
const newest_date = (data) => {
    let newest;
    for(let i = 0; i < data.features.length; i++){
        if (i == 0 || data.features[i].attributes.CreationDate > newest.attributes.CreationDate){
            newest = data.features[i];
        }
    };
    return newest;
};

const fetch_json = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return await json;
};

const newest = (array, date) => {
    let newest = []
    for(let i = 0; i < array.features.length; i++){
        if(array.features[i].attributes.CreationDate > date){
            newest.push(array.features[i])
        }
    };
    return newest;
};

const fetch_newest = async (url, date, name) => {
        let data = await fetch_json(url);
        localStorage.setItem(name, '{"date": ' + date + ', "data":' + JSON.stringify(data) + '}');

        return newest(data, date)
};

const inventory_calc = (data) => {
    let array;
    let masks = 0
    let sanitizer = 0
    let lysol = 0
    for(let i = 0; i < data.length; i++){

        masks += data[i].attributes.shipped_masks;
        sanitizer += data[i].attributes.shipped_sanitizers;
        lysol += data[i].attributes.shipped_lysols;
        
    }
    return {
        'masks': masks,
        'sanitizers': sanitizer,
        'lysols': lysol,
    };
};

const total = (update, shipment, confirmation) => {
    const list = ['masks', 'sanitizers', 'lysols']
    
    let obj = {};
    let time = update.attributes.CreationDate;
    for(let i = 0; i < list.length; i++){
        let item = list[i];
        obj[item] = (update.attributes[`total_${item}`] + shipment[item]) - confirmation[item];
    }
    let time_list = [shipment, confirmation];

    let i= 0;
    for (let item of time_list){
        if( i == 0 ||  item.time > time){
            time = item.time;
        }
        i += 1;

    }

    obj['time'] = time;

    return obj; 

}





// DATA APPLICATION FUNCTIONS
const get_survey_data = async (requestGeo, updateGeo, shipmentGeo, confirmGeo) => {

    // GET THE TIME OF THE LAST INVENTORY UPDATE
    const update = async () => {
        let data = await fetch_json(updateGeo);
        data = await newest_date(data);
        localStorage.setItem('update','{"date": ' + data.attributes.CreationDate + ', "data":' + JSON.stringify(data) + '}');

        return data;
    };

    let updateObj = await update();

    // GET YOU SOME DATA!!!
    const request_data = await fetch_newest(requestGeo, updateObj.attributes.CreationDate, 'request');
    const confirm_data = await fetch_newest(confirmGeo, updateObj.attributes.CreationDate, 'confirm');
    const shipment_data = await fetch_newest(shipmentGeo, updateObj.attributes.CreationDate, 'shipment');

    // THE LATEST NUMBERS ARE CALCULATED AS FOLLOWS (UPDATE.item + SHIPMENT_DATA.item) - CONFIRMATION_DATA.item 
    const shipmentCalc = () => {
        let masks = 0;
        let sanitizers = 0;
        let lysols = 0;
        let time;

        for(let i = 0; i < shipment_data.length; i++){
            if(i == 0 || time < shipment_data[i].attributes.CreationDate ){
                time = shipment_data[i].attributes.CreationDate;
            }

            masks += shipment_data[i].attributes.shipped_masks;
            sanitizers += shipment_data[i].attributes.shipped_sanitizers;
            lysols += shipment_data[i].attributes.shipped_lysols;
            
        }
        return {
            'time': time,
            'masks': masks,
            'sanitizers': sanitizers,
            'lysols': lysols,
        };
    };
    const confirmationCalc = () => {
        let masks = 0;
        let sanitizers = 0;
        let lysols = 0;
        let time;

        for(let i = 0; i < confirm_data.length; i++){
            if(i == 0 || time < shipment_data[i].attributes.CreationDate ){
                time = shipment_data[i].properties.CreationDate;
            }

            masks += confirm_data[i].attributes.confirmed_masks;
            sanitizers += confirm_data[i].attributes.confirmed_sanitizers;
            lysols += confirm_data[i].attributes.confirmed_lysols;
            
        }
        return {
            'time': time,
            'masks': masks,
            'sanitizers': sanitizers,
            'lysols': lysols,
        };
    };

    const shipmentTotal = shipmentCalc();
    const confirmationTotal = confirmationCalc();

    const t = total(updateObj, shipmentTotal, confirmationTotal)
    localStorage.setItem('total',  JSON.stringify(t))
    return t;

};


const inventory_render = async (d, mask, lysol, sanitizer, time) => {
    let formatted_time = (d) => {
        let date = new Date(d.time);
        let hours = () => {
            if (date.getHours() > 12){
                return {
                    hours: date.getHours() - 12,
                    ampm: ' PM',
                }
            }else{
                return{
                    hours: date.getHours(),
                    ampm: ' AM',
                }
            }
        };    
        return date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() + ' ' + hours().hours + ':' + date.getMinutes() + ':' + date.getSeconds() + hours().ampm ;
    }

    mask.innerText = d.masks;
    lysol.innerText = d.lysols;
    sanitizer.innerText = d.sanitizers;
    time.innerText = formatted_time(d);

};


const check_for_data = async (requestGeo, updateGeo, shipmentGeo, confirmGeo) => {
    if(localStorage.getItem('request')){
        console.log(true)
        let request = JSON.parse(localStorage.getItem('request'));
        let requestDate = new Date(request.date);
        if((new Date() - requestDate) > (30 * 1000) ){
            get_survey_data(requestGeo, updateGeo, shipmentGeo, confirmGeo)
        }
    }else{
        get_survey_data(requestGeo, updateGeo, shipmentGeo, confirmGeo)
    }
    return {
        request: JSON.parse(localStorage.getItem('request')),
        shipment: JSON.parse(localStorage.getItem('shipment')),
        update: JSON.parse(localStorage.getItem('update')),
        confirm: JSON.parse(localStorage.getItem('confirm')),
        total: JSON.parse(localStorage.getItem('total')),
    };
};

const requestList = (localData) => {
    let request = localData.request;
    console.log(request); 

}




export { inventory_render, get_survey_data, clear_div, check_for_data, requestList }
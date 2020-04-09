const clear_div = async (div) => {
    div.innerHTML = '';
    return;
};

const searching = async (value, bool, div, data) => {
    bool = true
    div.innerHTML = 'Data is loading...';
    clear_div(div);
    let fv = filter_data(data, `${value}*`);
    return fv;
};

const facility_render = async (d, div, surveyI) => {
    // DATA
    div.innerHTML = "<p class='i'>Data is loading...</p>";

    const sorted_data = d.sort(function (a, b) {
        if (a.properties.new_requesting_facility <b.properties.new_requesting_facility) {
            return -1;
        }
        if (b.properties.new_requesting_facility <a.properties.new_requesting_facility) {
            return 1;
        }
        return 0;
    });

    div.innerHTML = '';
    sorted_data.forEach(element => {
        // FIELDS
        const new_requesting_facility = element.properties.new_requesting_facility;
        const requesting_facility = element.properties.requesting_facility;

        // IMPORT SURVEY123 URL PARAMETERS FUNCTION
        const confirmationURL  = `https://survey123.arcgis.com/share/${surveyI}?field:requesting_facility=${new_requesting_facility}`

        div.innerHTML += 
            `<div id='${new_requesting_facility}' class='button_popup fl w-100 '> 
                <a class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-blue' data-url="${confirmationURL}">
                    <h2 class='f3 helvetica fl w-100'>${new_requesting_facility}</h2>
                </a>
            </div>`
    
    });
};


const get_survey_data = async (url) => {
    const response = await fetch(url);
    const json = await response.json();

    let data = json.features;
    return data;
};

const filter_data = (data, input) => {
    const d = data.filter(d => {
        return new RegExp('^' + input.toLowerCase().replace(/\*/g, '.*') + '$').test(d.properties.requesting_facility.toLowerCase())
    });
    return d
};



export { searching, facility_render, get_survey_data, filter_data, clear_div }
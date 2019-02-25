var ufos = data;

data.filter(x => x.durationMinutes.toString().includes('second') || x.durationMinutes.toString().includes('sec')).map(x => x['timeBin'] = "1: Seconds");
data.filter(x => x.durationMinutes.toString().includes('minute') || x.durationMinutes.toString().includes('min')).map(x => x['timeBin'] = "2: Minutes");
data.filter(x => x.durationMinutes.toString().includes('hour')).map(x => x['timeBin'] = "3: Hours");
data.filter(x => !x.durationMinutes.toString().includes('hour') && !x.durationMinutes.toString().includes('minute') && !x.durationMinutes.toString().includes('min') && !x.durationMinutes.toString().includes('second') && !x.durationMinutes.toString().includes('sec')).map(x => x['timeBin'] = "4: Rest");

var tabl = d3.select('table');
var tbody = d3.select('tbody');
var thead = d3.select('thead');
var submit = d3.select('#filter-btn')

var shapes = data.map(x => x.shape);
var shapeSet = new Set(shapes);
var shapeArr = [...shapeSet]
shapeArr.forEach(x => {
    d3.select('#shapeSelect').append('option').text(x);
})

var states = data.map(x => x.state);
var stateSet = new Set(states);
var stateArr = [...stateSet]
var stateSorted = stateArr.sort((a,b) => a > b ? 1 : a === b ? 0 : -1);
stateSorted.forEach(x => {
    d3.select('#stateSelect').append('option').text(x);
})

var cities = data.map(x => x.city);
var citySet = new Set(cities);
var cityArr = [...citySet]
var citySorted = cityArr.sort((a,b) => a > b ? 1 : a === b ? 0 : -1);
//var sorted = cityArr.sort((a,b) => a.localeCompare(b));
citySorted.forEach(x => {
    d3.select('#citySelect').append('option').text(x);
})

var bins = data.map(x => x.timeBin);
var binSet = new Set(bins);
var binArr = [...binSet]
var binSorted = binArr.sort((a,b) => a > b ? 1 : a === b ? 0 : -1);
binSorted.forEach(x => {
    d3.select('#binSelect').append('option').text(x);
})

function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }
autocomplete(document.getElementById('citySearch'), citySorted);
autocomplete(document.getElementById('stateSearch'), stateSorted);

submit.on("click", function() {
    d3.event.preventDefault();
    var dateElement = d3.select("#datetime");
    var dateValue = dateElement.property("value").replace(/\s+/g, "").replace(/\/0/, "/");
    console.log(`dateValue: ${dateValue}`);
    var dateFilterF = function(dateValue) {
        if (dateValue === "") {
            return ufos;
        } else {
            return ufos.filter(x => x.datetime === dateValue);
        }
    }
    var dateFilter = dateFilterF(dateValue);
    console.log(`dateFilter: `);
    console.log(dateFilter);
    // var countryElement = [...document.forms[0].elements.countrySelect]
    // var countryElement = countryElement.filter(x => x.checked);
    // var countryValue = countryElement[0].labels[0].innerText;
    var countryValue = document.querySelector('input[name = "countrySelect"]:checked').labels[0].innerText;
    var countryFilterF = function(countryValue) {
        if (countryValue === "All Countries") {
            return ufos;
        } else if (countryValue === "United States") {
            return ufos.filter(x => x.country === 'us');
        } else {
            return ufos.filter(x => x.country === 'ca');;
        }
    }
    var countryFilter = countryFilterF(countryValue);
    console.log(`countryFilter: `);
    console.log(countryFilter);
    var shapeValue = d3.select("#shapeSelect").selectAll("option").filter(function(){return this.selected});
    console.log(`shapeValue: `)
    console.log(shapeValue)
    var shapeValArr = shapeValue._groups[0].map(x => x.value)
    //var shapeValArr = d3.select('#shapeSelect').selectAll('options:checked')
    console.log(`shapeValArr: `);
    console.log(shapeValArr);
    var shapeFilterF = function(shapeValArr) {
        if (shapeValArr.length === 0) {
            return ufos;
        } else {
            return data.filter(ufo => shapeValArr.reduce((a,b) => a || b === ufo.shape, false));
        }
    }
    var shapeFilter = shapeFilterF(shapeValArr)
    console.log(`shapeFilter: `);
    console.log(shapeFilter);
    
    var citySearchElement = d3.select("#citySearch");
    var citySearchValue = citySearchElement.property("value")
    var cityValue = d3.select('#citySelect').selectAll("option").filter(function(){return this.selected});
    var cityValArr = cityValue._groups[0].map(x => x.value)
    console.log(`cityValArr: `);
    console.log(cityValArr);
    var cityFilterF = function(cityValArr) {
        if (cityValArr.length === 0 && citySearchValue === "") {
            return ufos;
        } else {
            cityValArr.push(citySearchValue);
            return data.filter(ufo => cityValArr.reduce((a,b) => a || b === ufo.city, false));
        }
    }
    var cityFilter = cityFilterF(cityValArr)
    console.log(`cityFilter: `);
    console.log(cityFilter);

    var stateSearchElement = d3.select("#stateSearch");
    var stateSearchValue = stateSearchElement.property("value")
    var stateValue = d3.select('#stateSelect').selectAll("option").filter(function(){return this.selected});
    var stateValArr = stateValue._groups[0].map(x => x.value);
    console.log(`stateValArr: `);
    console.log(stateValArr);
    var stateFilterF = function(stateValArr) {
        if (stateValArr.length === 0 && stateSearchValue === "") {
            return ufos;
        } else {
            stateValArr.push(stateSearchValue)
            return data.filter(ufo => stateValArr.reduce((a,b) => a || b === ufo.state, false));
        }
    }
    var stateFilter = stateFilterF(stateValArr)
    console.log(`stateFilter: `);
    console.log(stateFilter);
    var binValue = d3.select('#binSelect').selectAll("option").filter(function(){return this.selected});
    var binValArr = binValue._groups[0].map(x => x.value)
    console.log(`binValArr: `);
    console.log(binValArr);
    var binFilterF = function(binValArr) {
        if (binValArr.length === 0) {
            return ufos;
        } else {
            return data.filter(ufo => binValArr.reduce((a,b) => a || b === ufo.timeBin, false));
        }
    }
    var binFilter = binFilterF(binValArr)
    console.log(`binFilter: `);
    console.log(binFilter);
    var commentElement = d3.select("#commentSearch");
    var commentValue = commentElement.property("value")
    var commentFilterF = function(commentValue) {
        var regex = new RegExp(commentValue, "gi")
        return data.filter(x => regex.test(x.comments) === true);
    }
    var commentFilter = commentFilterF(commentValue);
    console.log(`commentFilter: `);
    console.log(commentFilter);
    var subFilter = dateFilter.filter(ufo => shapeFilter.reduce((a,b) => a || b === ufo, false));
    console.log(`subFilter: `);
    console.log(subFilter);
    var subFilter2 = subFilter.filter(ufo => stateFilter.reduce((a,b) => a || b === ufo, false));
    console.log(`subFilter2: `);
    console.log(subFilter2);
    var subFilter3 = subFilter2.filter(ufo => countryFilter.reduce((a,b) => a || b === ufo, false));
    console.log(`subFilter3: `);
    console.log(subFilter3);
    var subFilter4 = subFilter3.filter(ufo => commentFilter.reduce((a,b) => a || b === ufo, false));
    console.log(`subFilter4: `);
    console.log(subFilter4);
    var subFilter5 = subFilter4.filter(ufo => cityFilter.reduce((a,b) => a || b === ufo, false));
    console.log(`subFilter5: `);
    console.log(subFilter5);
    var subFilter6 = subFilter5.filter(ufo => binFilter.reduce((a,b) => a || b === ufo, false));
    console.log(`subFilter6: `);
    console.log(subFilter6);
    var finalFilter = subFilter6;
    var sortValue = document.querySelector('input[name = "sortSelect"]:checked').labels[0].innerText;

    switch (sortValue) {
        case 'Sort by Date':
            finalFilter.map(x => stringToDate(x.datetime, "dd/MM/yyyy", "/"))
            finalFilter.sort((a,b) => b.datetime - a.datetime ? -1 : b.datetime === a.datetime ? 0 : 1);
            break;
        case 'Sort by Country':
            finalFilter.sort((a,b) => a.country > b.country ? 1 : a.country === b.country ? 0 : -1);
            break;
        case 'Sort by Shape':
            finalFilter.sort((a,b) => a.shape > b.shape ? 1 : a.shape === b.shape ? 0 : -1);
            break;
        case 'Sort by City':
            finalFilter.sort((a,b) => a.city > b.city ? 1 : a.city === b.city ? 0 : -1);
            break;
        case 'Sort by State':
            finalFilter.sort((a,b) => a.state > b.state ? 1 : a.state === b.state ? 0 : -1);
            break;
        case 'Sort by Duration':
            finalFilter.sort(function(a, b) {
                if (parseInt(a.timeBin) > parseInt(b.timeBin)) return 1;
                if (parseInt(a.timeBin) < parseInt(b.timeBin)) return -1;
                if (parseInt(a.durationMinutes.toString().replace(/[A-Za-z]+/g, "")) > parseInt(b.durationMinutes.toString().replace(/[A-Za-z]+/g, ""))) return 1;
                if (parseInt(a.durationMinutes.toString().replace(/[A-Za-z]+/g, "")) < parseInt(b.durationMinutes.toString().replace(/[A-Za-z]+/g, ""))) return -1;
                return 0;
            })
            break;
        case 'Sort by Comments':
            finalFilter.sort((a,b) => a.comments > b.comments ? 1 : a.comments === b.comments ? 0 : -1);
            break;
        case 'Sort by Duration Group':
            finalFilter.sort((a,b) => a.timeBin > b.timeBin ? 1 : a.timeBin === b.timeBin ? 0 : -1);
            break;

    }
    console.log(finalFilter);
    
    var modeValue = document.querySelector('input[name = "modeSelect"]:checked').labels[0].innerText;

    switch (modeValue) {
        case 'Append Results':
            tbody.append('tr')
            tbody.append('td').style('white-space', 'nowrap').text(`${dateValue}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${cityValArr}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${stateValArr}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${countryValue}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${shapeValArr}`);
            tbody.append('td').style('white-space', 'nowrap').text(``);
            tbody.append('td').style('white-space', 'nowrap').text(`${commentValue}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${binValArr}`);
            finalFilter.forEach(x => {
                var row = tbody.append('tr');
                Object.entries(x).forEach(([k,v]) => {
                    var cell = tbody.append('td');
                    cell.text(v);
                })
            })
            tbody.append('tr');
            tbody.append('td').style('white-space', 'nowrap').text(`-------- End Results --------`);
            break;
        case 'Rewrite Results':
            tbody.selectAll('tr').remove()
            tbody.selectAll('td').remove()

            tbody.append('tr')
            tbody.append('td').style('white-space', 'nowrap').text(`${dateValue}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${cityValArr}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${stateValArr}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${countryValue}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${shapeValArr}`);
            tbody.append('td').style('white-space', 'nowrap').text(``);
            tbody.append('td').style('white-space', 'nowrap').text(`${commentValue}`);
            tbody.append('td').style('white-space', 'nowrap').text(`${binValArr}`);
            finalFilter.forEach(x => {
                var row = tbody.append('tr');
                Object.entries(x).forEach(([k,v]) => {
                    var cell = tbody.append('td');
                    cell.text(v);
                })
            })
            tbody.append('tr');
            tbody.append('td').style('white-space', 'nowrap').text(`-------- End Results --------`);
            break;
        }
})
//TODO
// - add more criteria
// - add more details to the house
// - add extra details to details like status
var criteriaList = [];
document.addEventListener('DOMContentLoaded', function () {
    var addButton = document.getElementById('add-button');
    addButton.addEventListener('click', addCriteria);

    var submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', function () {
        var xmlStringRequest = createXmlRequestString(criteriaList);
        console.log(xmlStringRequest);
        submitRequest(xmlStringRequest);
    });

    function addCriteria() {
        var field = document.getElementById('field').value;
        var operator = document.getElementById('operator').value;
        var value = document.getElementById('value').value;

        if (field && operator && value) {
            var criteria = {
                field: field,
                operator: operator,
                value: value
            };

            criteriaList.push(criteria);
            renderCriteriaList();

            // Empty input fields
            document.getElementById('field').value = '';
            document.getElementById('operator').value = '';
            document.getElementById('value').value = '';
        }
    }

    function removeCriteria(id) {
        criteriaList.splice(id, 1);
        var criteriaContainer = document.getElementById('criteria-container');
        var criteriaItem = document.getElementById(id);
        const newHeight = criteriaContainer.scrollHeight - criteriaItem.offsetHeight;
        criteriaContainer.style.height = newHeight + 'px';

        fadeOutAndRemove(criteriaItem);
    }

    function renderCriteriaList() {
        var criteriaContainer = document.getElementById('criteria-container');
        //generate an id
        var id = Math.random().toString(36).substr(2, 9);

        // Check if the container already has elements
        var hasElements = criteriaContainer.childElementCount > 0;

        var criteria = criteriaList[criteriaList.length - 1]; // Assuming criteriaList is an array of criteria objects

        var criteriaItem = document.createElement('div');
        criteriaItem.classList.add('criteria-item');
        criteriaItem.id = id;

        var fieldText = document.createElement('span');
        fieldText.textContent = criteria.field;
        criteriaItem.appendChild(fieldText);

        var operatorText = document.createElement('span');
        operatorText.textContent = criteria.operator;
        criteriaItem.appendChild(operatorText);

        var valueText = document.createElement('span');
        valueText.textContent = criteria.value;
        criteriaItem.appendChild(valueText);

        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-button');
        removeButton.id = 'remove-button-' + id;
        removeButton.addEventListener('click', function () {
            removeCriteria(id);
            // renderCriteriaList(); // After removing, re-render the list to update the UI
        });
        criteriaItem.appendChild(removeButton);

        // Add the new element as the last child if the container has existing elements
        if (hasElements) {
            criteriaContainer.appendChild(criteriaItem);
        } else {
            // Otherwise, add the new element as the first child
            criteriaContainer.prepend(criteriaItem);
        }
        const newHeight = criteriaContainer.scrollHeight;
        criteriaContainer.style.height = newHeight + 'px';
    }


    function createXmlRequestString(criteriaList) {
        var xmlStringRequest = `<?xml version="1.0" encoding="UTF-8"?>
        <eCH-0206:maddRequest xmlns:eCH-0058="http://www.ech.ch/xmlns/eCH-0058/5" xmlns:eCH-0206="http://www.ech.ch/xmlns/eCH-0206/2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.ech.ch/xmlns/eCH-0206/2 eCH-0206-2-0.xsd">
             <eCH-0206:requestHeader>
                      <eCH-0206:messageId>1687214476138</eCH-0206:messageId>
                      <eCH-0206:businessReferenceId>1687214476138</eCH-0206:businessReferenceId>
                      <eCH-0206:requestingApplication>
                             <eCH-0058:manufacturer>FSO</eCH-0058:manufacturer>
                             <eCH-0058:product>MADDAssist</eCH-0058:product>
                             <eCH-0058:productVersion>1.0.0</eCH-0058:productVersion>
                      </eCH-0206:requestingApplication>
                      <eCH-0206:requestDate>2023-06-20T00:41:16</eCH-0206:requestDate>
               </eCH-0206:requestHeader>
               <eCH-0206:requestContext>building</eCH-0206:requestContext>
               <eCH-0206:requestQuery>`;
        for (var i = 0; i < criteriaList.length; i++) {
            xmlStringRequest += generateCriteriaString(criteriaList[i]);
        }

        xmlStringRequest += `</eCH-0206:requestQuery>
        </eCH-0206:maddRequest>`;

        return xmlStringRequest;
    }

    function generateCriteriaString(criteria) {
        var xmlCriteriaString = '<eCH-0206:condition>';
        xmlCriteriaString += generateXmlFieldString(criteria.field);
        xmlCriteriaString += generateXmlOperatorString(criteria.operator);
        xmlCriteriaString += generateXmlValueString(criteria.value);
        xmlCriteriaString += '</eCH-0206:condition>';
        return xmlCriteriaString;
    }
    function generateXmlFieldString(field) {
        var xmlFieldString = '<eCH-0206:attributePath>';
        switch (field) {
            case 'Strassenbezeichnung':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:buildingEntranceList/eCH-0206:buildingEntranceItem/eCH-0206:buildingEntrance/eCH-0206:street/eCH-0206:streetNameList/eCH-0206:streetNameItem/eCH-0206:descriptionLong';
                break;
            case 'Gebäudestatus':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:building/eCH-0206:buildingStatus';
                break;
            case 'Ort':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:buildingEntranceList/eCH-0206:buildingEntranceItem/eCH-0206:buildingEntrance/eCH-0206:locality/eCH-0206:placeName';
                break;
            case 'Plz':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:buildingEntranceList/eCH-0206:buildingEntranceItem/eCH-0206:buildingEntrance/eCH-0206:locality/eCH-0206:swissZipCode';
                break;
            case 'HausNummer':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:buildingEntranceList/eCH-0206:buildingEntranceItem/eCH-0206:buildingEntrance/eCH-0206:buildingEntranceNo';
                break;
            case 'AnzahlGeschosse':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:building/eCH-0206:numberOfFloors';
                break;
            case 'Baujahr':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:building/eCH-0206:dateOfConstruction/eCH-0206:dateOfConstruction';
                break;
            case 'Gebaeudestatus':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:building/eCH-0206:buildingStatus';
                break;
            case 'Gebaeudeklasse':
                xmlFieldString += '/eCH-0206:maddResponse/eCH-0206:buildingList/eCH-0206:buildingItem/eCH-0206:building/eCH-0206:buildingClass';
                break;
        }
        xmlFieldString += '</eCH-0206:attributePath>';
        return xmlFieldString;
    }

    function generateXmlOperatorString(operator) {
        var xmlOperatorString = '<eCH-0206:operator>';
        switch (operator) {
            case 'ist gleich':
                xmlOperatorString += 'equalTo';
                break;
            case 'ist ungleich':
                xmlOperatorString += 'notEqualTo';
                break;
            case 'ist kleiner als':
                xmlOperatorString += 'lessThan';
                break;
            case 'ist kleiner oder gleich':
                xmlOperatorString += 'lessThanOrEqualTo';
                break;
            case 'ist grösser als':
                xmlOperatorString += 'greaterThan';
                break;
            case 'ist grösser oder gleich':
                xmlOperatorString += 'greaterThanOrEqualTo';
                break;
        }
        xmlOperatorString += '</eCH-0206:operator>';
        return xmlOperatorString;
    }

    function generateXmlValueString(value) {
        var xmlValueString = '<eCH-0206:attributeValue>';
        xmlValueString += value.toString();
        console.log("value " + value);
        console.log("value string " + value.toString());
        xmlValueString += '</eCH-0206:attributeValue>';
        return xmlValueString;
    }



    // function submitRequest(xmlStringRequest) {
    //     console.log(xmlStringRequest);
    //     // document.getElementById('response').innerHTML = xmlStringRequest;
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('POST', 'https://gobetween.oklabs.org/https://madd.bfs.admin.ch/eCH-0206');
    //     xhr.setRequestHeader('Content-Type', 'application/xml');
    //     xhr.withCredentials = false;
    //     console.log(xhr);
    //     xhr.send(xmlStringRequest);
    //     console.log('sent');
    //     xhr.onreadystatechange = function () {
    //         console.log('readyState: ' + xhr.readyState);
    //         if (xhr.readyState === 4) {
    //             if (xhr.status === 200) {
    //                 console.log('status 200');
    //                 var xmlResponse = xhr.responseXML;
    //                 var xmlStringResponse = new XMLSerializer().serializeToString(xmlResponse);
    //                 var json = xmlToJson(xmlResponse);
    //                 var jsonResponse = JSON.stringify(json, null, 4);
    //                 // document.getElementById('response').innerHTML = syntaxHighlight(jsonResponse);
    //                 // document.getElementById('response').innerHTML = 'hello';
    //             } else {
    //                 console.log('Error: ' + xhr.status);
    //                 console.log(xhr.responseText);
    //             }
    //         }
    //     };
    // }

    function submitRequest(xmlStringRequest) {
        if (!isOnline()) {
            console.log('offline');
            alert("You are offline. Please check your internet connection.");
            return;
        }
        document.getElementById("loaderContainer").style.display = "flex";
        removeAllItems();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://x8ki-letl-twmt.n7.xano.io/api:QZOPZVYq/housingstat');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = false;
        console.log(xhr);
        var data = {
            "xmlstring": xmlStringRequest
        }
        // set the body
        console.log(data);
        xhr.send(JSON.stringify(data));
        console.log('sent');
        xhr.onreadystatechange = function () {
            console.log('readyState: ' + xhr.readyState);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('status 200');
                    var jsonResponse = xhr.responseText;
                    var json = JSON.parse(jsonResponse);
                    var xmlResponse = json.responseXML.response.result;
                    var convertedJson = xmlToJson.parse(xmlResponse);
                    console.log("convertedJson: " + JSON.stringify(convertedJson));
                    renderHousesDetails(convertedJson);
                    document.getElementById("loaderContainer").style.display = "none";
                } else {
                    console.log('Error: ' + xhr.status);
                    console.log(xhr.responseText);
                    document.getElementById("loaderContainer").style.display = "none";
                }
            }
        };
    }

    // open and close panels with animation
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                console.log("scrollheight: " + panel.scrollHeight);
                panel.style.maxHeight = null;
            } else {
                console.log("scrollheight: " + panel.scrollHeight);
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }

    document.getElementById("defaultOpen").click();
});

function resizeAccordion(element) {
    element.classList.toggle("active");
    var panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
        console.log("scrollheight: " + panel.scrollHeight);
        panel.style.maxHeight = null;
    } else {
        console.log("scrollheight: " + panel.scrollHeight);
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
}

function fadeOutAndRemove(element) {
    element.classList.add('hidden-item');
    setTimeout(function () {
        element.parentNode.removeChild(element);
    }, 5000);
}

function openCity(evt, cityName, egid) {
    console.log("openCity");
    console.log("cityName: " + cityName + " egid: " + egid);
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        // tabcontent[i].style.display = "none";
        //remove class name
        tabcontent[i].className = tabcontent[i].className.replace(" tabcontent-active", "");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" tab-active", "");
    }
    var rows = document.getElementsByClassName("row");
    for (i = 0; i < rows.length; i++) {
        rows[i].className = rows[i].className.replace(" row-expand-in", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    evt.currentTarget.className += " tab-active";
    // document.getElementById(cityName + egid).style.display = "block";
    document.getElementById(cityName + egid).className += " tabcontent-active";
    var rows = document.getElementById(cityName + egid).querySelectorAll(".row");
    for (let i = 0; i < rows.length; i++) {
        fadeIn(rows[i], i * 50, "row-expand-in");
    }

    var hdItems = document.getElementById(cityName + egid).querySelectorAll(".house-detail-item");
    for (let i = 0; i < hdItems.length; i++) {
        hdItems[i].classList.remove("item-expand-in");
    }
    for (let i = 0; i < hdItems.length; i++) {
        fadeIn(hdItems[i], i * 50, "item-expand-in");
    }

    // refresh the height of the panel
    const button = document.getElementById("accordion" + egid);
    button.click();
    button.click();
}

function renderHousesDetails(x) {
    if (!x || !x.maddResponse || !x.maddResponse.buildingList || !x.maddResponse.buildingList.buildingItem) {
        var message = x?.maddResponse?.status?.message ?? '-';
        alert("an error occured\n" + message);
        return;
    }
    var buildings = x.maddResponse.buildingList.buildingItem;

    var container = document.querySelector(".third-container");
    var building;
    if (!Array.isArray(buildings)) {
        building = buildings;
        container.appendChild(createTabs(container, building));
    } else {
        for (var i = 0; i < buildings.length; i++) {
            var panel = createTabs(container, buildings[i]);
            container.appendChild(panel);
        }
    }
    var accordions = document.querySelectorAll(".accordion");
    for (let i = 0; i < accordions.length; i++) {
        setTimeout(() => {
            accordions[i].classList.add("animate");
        }, i * 50);
    }
    var houseDetailItems = document.querySelectorAll(".house-detail-item");
    for (let i = 0; i < houseDetailItems.length; i++) {
        houseDetailItems[i].addEventListener("click", function () {
            var id = houseDetailItems[i].id.substring(0, houseDetailItems[i].id.indexOf("-"));
            var value = houseDetailItems[i].querySelector(".house-detail-value").innerHTML;

            // copy to clipboard
            navigator.clipboard.writeText(value);
            console.log("copied: " + value);
            houseDetailItems[i].classList.add("copied");
            houseDetailItems[i].classList.add("clicked");
            setTimeout(() => {
                houseDetailItems[i].classList.remove("copied");
            }, 1000);
            setTimeout(() => {
                houseDetailItems[i].classList.remove("clicked");
            }, 1000);

        });
    }
}

function isOnline() {
    return navigator.onLine;
}

function fadeIn(element, delay, className) {
    setTimeout(function () {
        element.classList.add(className);
    }, delay);
}

function createRowElement(appartment) {
    var ewid = appartment.EWID;
    var flaeche = appartment.dwelling.surfaceAreaOfDwelling;
    var adminNr = appartment.dwelling.administrativeDwellingNo;
    var physNr = appartment.dwelling.physicalDwellingNo;
    var stockwerk = appartment.dwelling.floor;
    var anzZimmer = appartment.dwelling.noOfHabitableRooms;
    var lage = appartment.dwelling.locationOfDwellingOnFloor;
    var status = appartment.dwelling.dwellingStatus;
    var kueche = appartment.dwelling.kitchen;
    var baujahr = appartment.dwelling.yearOfConstruction;
    var abbruchjahr = appartment.dwelling.yearOfDemolition;

    var row = document.createElement("tr");
    row.classList.add("row");

    var cell = document.createElement("td");
    cell.textContent = ewid;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.innerHTML = flaeche + " m<sup>2</sup>";
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.textContent = adminNr;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.textContent = physNr;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.textContent = stockwerk;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.textContent = anzZimmer;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.textContent = lage;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.textContent = status;
    row.appendChild(cell);

    var cell = document.createElement("td");
    if (kueche == 1 || kueche == "1") {
        cell.textContent = "Ja";
    } else {
        cell.textContent = "Nein";
    }
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.textContent = baujahr;
    row.appendChild(cell);

    var cell = document.createElement("td");
    cell.textContent = abbruchjahr;
    row.appendChild(cell);

    return row;
}

function removeAllItems() {
    var accordions = document.querySelectorAll(".accordion");
    for (let i = 0; i < accordions.length; i++) {
        accordions[i].parentNode.removeChild(accordions[i]);
    }
    var panels = document.querySelectorAll(".panel");
    for (let i = 0; i < panels.length; i++) {
        panels[i].parentNode.removeChild(panels[i]);
    }
}

function createTabs(container, building) {
    let appartmentsObjets;
    if (building.buildingEntranceList.buildingEntranceItem.dwellingList)
        appartmentsObjets = building.buildingEntranceList.buildingEntranceItem.dwellingList.dwellingItem;

    let egid = building.EGID;
    console.log("egid: " + egid);
    var buildingEntranceItem = building?.buildingEntranceList?.buildingEntranceItem;
    var strassenbezeichnung;
    var houseNummer;
    var plz;
    var ort;

    if (Array.isArray(buildingEntranceItem)) {
        strassenbezeichnung = buildingEntranceItem
            .map(item => item.buildingEntrance?.street?.streetNameList?.streetNameItem?.descriptionLong)
            .filter(Boolean)
            .join('\n') || '-';

        houseNummer = buildingEntranceItem
            .map(item => item.buildingEntrance?.buildingEntranceNo)
            .filter(Boolean)
            .join('\n') || '-';
        plz = buildingEntranceItem
            .map(item => item.buildingEntrance?.locality?.swissZipCode)
            .filter(Boolean)
            .join('\n') || '-';
        ort = buildingEntranceItem
            .map(item => item.buildingEntrance?.locality?.placeName)
            .filter(Boolean)
            .join('\n') || '-';
    } else {
        strassenbezeichnung = buildingEntranceItem?.buildingEntrance?.street?.streetNameList?.streetNameItem?.descriptionLong || '-';
        houseNummer = buildingEntranceItem?.buildingEntrance?.buildingEntranceNo ?? '-';
        plz = buildingEntranceItem?.buildingEntrance?.locality?.swissZipCode ?? '-';
        ort = buildingEntranceItem?.buildingEntrance?.locality?.placeName ?? '-';
    }

    // Rest of the code remains unchanged...
    var gebauedeFlaeche = building?.building.surfaceAreaOfBuilding ?? '-';
    var energiebezugsflaeche = building?.building.energyRelevantSurface ?? '-';
    var gebaeudevolumen = building.building?.volume?.volume ?? '-';
    var anzGeshcosse = building?.building.numberOfFloors ?? '-';
    // var anzSeperateWohnraeume;
    var zivilschutzraum = building?.building.civilDefenseShelter ?? '-';
    var gebaeudestatus = building?.building.buildingStatus ?? '-';
    var gebaeudekategorie = building?.building.buildingCategory ?? '-';
    var gebaeudeklasse = building?.building.buildingClass ?? '-';
    var baudatum = building?.building.dateOfConstruction?.dateOfConstruction ?? '-';
    var bauperiode = building?.building.dateOfConstruction?.periodOfConstruction ?? '-';
    // var abbruchjahr;
    var waermeerzeugerHeizSystem = building?.building?.thermotechnicalDeviceForHeating1?.heatGeneratorHeating ?? '-';
    var energietraegerHeizSystem = building?.building?.thermotechnicalDeviceForHeating1?.energySourceHeating ?? '-';
    var informationsquelleHeizSystem = building?.building?.thermotechnicalDeviceForHeating1?.informationSourceHeating ?? '-';
    var aktualisierungsdatumHeizSystem = building?.building?.thermotechnicalDeviceForHeating1?.revisionDate ?? '-';
    var waermeerzeugerWarmwasser = building?.building?.thermotechnicalDeviceForWarmWater1?.heatGeneratorHotWater ?? '-';
    var energietraegerWarmwasser = building?.building?.thermotechnicalDeviceForWarmWater1?.energySourceHeating ?? '-';
    var informationsquelleWarmwasser = building?.building?.thermotechnicalDeviceForWarmWater1?.informationSourceHeating ?? '-';
    var aktualisierungsdatumWarmwasser = building?.building?.thermotechnicalDeviceForWarmWater1?.revisionDate ?? '-';





    // todo


    var button = document.createElement("button");
    button.classList.add("accordion");
    button.id = "accordion" + egid;
    button.innerHTML = strassenbezeichnung + " " + houseNummer + ", " + plz + " " + ort;
    button.addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            console.log("scrollheight: " + panel.scrollHeight);
            panel.style.maxHeight = null;
        } else {
            console.log("scrollheight: " + panel.scrollHeight);
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
    container.appendChild(button);

    var tab = document.createElement("div");
    tab.classList.add("tab");

    var details = document.createElement("button");
    details.classList.add("tablinks");
    details.innerHTML = "Details";
    details.onclick = function (event) { openCity(event, 'Details', egid) };
    tab.appendChild(details);

    var appartments = document.createElement("button");
    appartments.classList.add("tablinks");
    appartments.innerHTML = "Wohnungen";
    appartments.onclick = function (event) { openCity(event, 'Appartments', egid) };
    tab.appendChild(appartments);

    var panel = document.createElement("div");
    panel.classList.add("panel");
    panel.appendChild(tab);

    var tabConentDetails = document.createElement("div");
    tabConentDetails.classList.add("tabcontent");
    tabConentDetails.id = "Details" + egid;

    var houseDetailsContainer = document.createElement("div");
    houseDetailsContainer.classList.add("house-details-container");

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "EGID";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = egid;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Strassenbezeichnung";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = strassenbezeichnung;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Hausnummer";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = houseNummer;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "PLZ";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = plz;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Ort";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = ort;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Gebäudefläche";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = gebauedeFlaeche + " m<sup>2</sup>";
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Energiebezugsfläche";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = energiebezugsflaeche + " m<sup>2</sup>";
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Gebäudevolumen";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = gebaeudevolumen + " m<sup>3</sup>";
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Anzahl Geschosse";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = anzGeshcosse;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    //boolean
    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Zivilschutzraum";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    if (zivilschutzraum == 1 || zivilschutzraum == "1") {
        hdv.innerHTML = "Ja";
    } else {
        hdv.innerHTML = "Nein";
    }
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Gebäudestatus";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = gebaeudestatus;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Gebäudekategorie";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = gebaeudekategorie;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Gebäudeklasse";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = gebaeudeklasse;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Baudatum";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = baudatum;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Bauperiode";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = bauperiode;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Wärmeerzeuger (Heizsystem)";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = waermeerzeugerHeizSystem;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Energieträger (Heizsystem)";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = energietraegerHeizSystem;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Informationsquelle (Heizsystem)";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = informationsquelleHeizSystem;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Aktualisierungsdatum (Heizsystem)";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = aktualisierungsdatumHeizSystem;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Wärmeerzeuger (Warmwasser)";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = waermeerzeugerWarmwasser;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Energieträger (Warmwasser)";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = energietraegerWarmwasser;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Informationsquelle (Warmwasser)";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = informationsquelleWarmwasser;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    var hdi = document.createElement("div");
    hdi.classList.add("house-detail-item");

    var hdn = document.createElement("span");
    hdn.classList.add("house-detail-name");
    hdn.innerHTML = "Aktualisierungsdatum (Warmwasser)";
    hdi.appendChild(hdn);

    var hdv = document.createElement("span");
    hdv.classList.add("house-detail-value");
    hdv.innerHTML = aktualisierungsdatumWarmwasser;
    hdi.appendChild(hdv);
    houseDetailsContainer.appendChild(hdi);

    tabConentDetails.appendChild(houseDetailsContainer);

    // appartment table
    var tabContentAppartments = document.createElement("div");
    tabContentAppartments.classList.add("tabcontent");
    tabContentAppartments.id = "Appartments" + egid;

    var appartmentsContainer = document.createElement("div");
    appartmentsContainer.classList.add("appartments-container");

    var table = document.createElement("table");
    table.classList.add("my-table");

    // Create the header row (<tr>)
    var headerRow = document.createElement("tr");
    headerRow.classList.add("header");

    // Define the headers and their corresponding widths
    var headers = [
        { label: "EWID", width: "auto" },
        { label: "Fläche", width: "auto" },
        { label: "AdminNr", width: "auto" },
        { label: "PhysNr", width: "auto" },
        { label: "Stockwerk", width: "auto" },
        { label: "Anz. Zimmer", width: "auto" },
        { label: "Lage", width: "auto" },
        { label: "Status", width: "auto" },
        { label: "Küche", width: "auto" },
        { label: "Baujahr", width: "auto" },
        { label: "Abbruchjahr", width: "auto" },
    ];

    // Create and append each <th> element to the header row
    headers.forEach(headerData => {
        var th = document.createElement("th");
        th.textContent = headerData.label;
        th.style.width = headerData.width;
        headerRow.appendChild(th);
    });

    // Append the header row to the table
    table.appendChild(headerRow);



    // rows:
    console.log("egid: " + egid + " appartmentsObjets: " + JSON.stringify(appartmentsObjets));
    if (appartmentsObjets) {
        var appartment;
        if (Array.isArray(appartmentsObjets)) {

            for (var j = 0; j < appartmentsObjets.length; j++) {
                var appartment = appartmentsObjets[j];

                table.appendChild(createRowElement(appartment));
            }
        } else {
            appartment = appartmentsObjets;
            table.appendChild(createRowElement(appartment));
        }
    }


    appartmentsContainer.appendChild(table);
    tabContentAppartments.appendChild(appartmentsContainer);

    panel.appendChild(tabConentDetails);
    panel.appendChild(tabContentAppartments);

    return panel;
}
function helperContentClicked(event, value) {
    event.preventDefault();
    console.log(value);
    var valueElement = document.getElementById("value");
    valueElement.value = value;
}

function handleFieldChange() {
    var selectElement = document.getElementById("field");
    var helperContent = document.getElementById("helperContent");
    helperContent.innerHTML = "";

    if (selectElement.value === "Strassenbezeichnung") {
        fillHelperStreetName(helperContent);
    } else if (selectElement.value === "Ort") {
        fillHelperPlace(helperContent);
    } else if (selectElement.value === "Plz") {
        fillHelperPost(helperContent);
    } else if (selectElement.value === "HausNummer") {
        fillHelperHouseNumber(helperContent);
    } else if (selectElement.value === "AnzahlGeschosse") {
        fillHelperNoOfFloors(helperContent);
    } else if (selectElement.value === "Baujahr") {
        fillHelperYearBuilt(helperContent);
    } else if (selectElement.value === "Gebaeudestatus") {
        fillHelperStatus(helperContent);
    } else if (selectElement.value === "Gebaeudestatus") {
        fillHelperStatus(helperContent);
    } else if (selectElement.value === "Gebaeudekategorie") {
        fillHelperCategorie(helperContent);
    }
}

function fillHelperStreetName(helperContent) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = "z.b. Bahnhofstrasse";
    helperContent.appendChild(link);
}

function fillHelperPlace(helperContent) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = "z.b. Zürich";
    helperContent.appendChild(link);
}

function fillHelperPost(helperContent) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = "z.b. 8002";
    helperContent.appendChild(link);
}

function fillHelperHouseNumber(helperContent) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = "z.b. 24";
    helperContent.appendChild(link);
}

function fillHelperNoOfFloors(helperContent) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = "z.b. 7 Inkl. Keller und Dach";
    helperContent.appendChild(link);
}

function fillHelperYearBuilt(helperContent) {
    var items = [
        "1901-01", "1952-06", "2001-12", "2015-09"
    ];

    items.forEach(function (item) {
        var link = document.createElement("a");
        link.href = "#";
        link.textContent = "z.b. " + item;
        helperContent.appendChild(link);
    });
}

function fillHelperStatus(helperContent) {
    var newItems = [];
    var statuses = getAllAvailableStatus();
    statuses.forEach(function (item) {
        newItems.push({ value: item, text: item + " - " + getStatusString(item) });
    });
    newItems.forEach(function (item) {
        var link = document.createElement("a");
        link.href = "#";
        link.textContent = item.text;
        link.onclick = function (event) {
            helperContentClicked(event, item.value);
        };
        helperContent.appendChild(link);
    });
}

function fillHelperCategorie(helperContent) {
    var newItems = [];
    var categories = getAllAvailableCategories();
    categories.forEach(function (item) {
        newItems.push({ value: item, text: item + " - " + getCategoryString(item) });
    });
    newItems.forEach(function (item) {
        var link = document.createElement("a");
        link.href = "#";
        link.textContent = item.text;
        link.onclick = function (event) {
            helperContentClicked(event, item.value);
        };
        helperContent.appendChild(link);
    });
}

function getStatusString(code) {
    switch (code) {
        case 1001:
            return "Projektiert";
        case 1002:
            return "Bewilligt";
        case 1003:
            return "Im Bau";
        case 1004:
            return "Bestehend";
        case 1005:
            return "Nicht nutzbar";
        case 1007:
            return "Abgebrochen";
        case 1008:
            return "Nicht realisiert";
        default:
            return null;
    }
}

function getAllAvailableStatus() {
    var statusList = [];
    statusList.push(1001);
    statusList.push(1002);
    statusList.push(1003);
    statusList.push(1004);
    statusList.push(1005);
    statusList.push(1007);
    statusList.push(1008);
    return statusList;
}

function getCategoryString(code) {
    switch (code) {
        case 1010:
            return "Prov. Unterkunft";
        case 1020:
            return "Mit Wohnnutzung";
        case 1030:
            return "Wohngebäude mit Nebennutzung";
        case 1040:
            return "Mit teilw. Wohnnutzung";
        case 1060:
            return "Ohne Wohnnutzung";
        case 1080:
            return "Sonderbau";
        default:
            return null;
    }
}

function getAllAvailableCategories() {
    var categoryList = [];
    categoryList.push(1010);
    categoryList.push(1020);
    categoryList.push(1030);
    categoryList.push(1040);
    categoryList.push(1060);
    categoryList.push(1080);
    return categoryList;
}
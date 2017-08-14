var group = null;
var condition = "Public";
var timeout;

var map;
var markers = [];

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function generateRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function generateRandomLoc(area) {
    return {
        lat : generateRandomNum(area["lat"]["min"], area["lat"]["max"]),
        lng : generateRandomNum(area["lng"]["min"], area["lng"]["max"]),
    };
}

function getMarkerIcon(name) {
    if (name === "Me") {
        return "http://maps.google.com/mapfiles/arrow.png";
    } else {
        return "https://www.google.com/mapfiles/marker" + name[0] + ".png";
    }
}

function clearOverlays() {
    for (var i = 0; i < markers.length; ++i) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

// -----------------------------------------------------------------------------
// MAP
// -----------------------------------------------------------------------------

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center           : groups["UBC"]["centre"],
        zoom             : 13,
        mapTypeId        : google.maps.MapTypeId.ROADMAP,
        disableDefaultUI : true,
    });
}

function initGroup() {
    var openedInfoWindow;

    function createGroupMember(name, area) {
        var content;
        var phone = "<a onclick='dialFriend();'><img src='img/icon_phone.png' /></a>";
        var profile = "<a onclick='showFriend(" + '"' + name + '"' + ");'><img src='img/icon_profile.png' /></a>";
        if (name === "Me") {
            content = "<p><h4>" + name + "</h4></p>";
        } else {
            content = "<p><h4>" + name + "</h4></p>" + phone + profile;
        }
        var marker = new google.maps.Marker({
            position : generateRandomLoc(area),
            map      : map,
            icon     : getMarkerIcon(name),
            content  : content,
            name     : name,
        });
        var infoWindow = new google.maps.InfoWindow({
            content : marker["content"],
        });
        markers.push(marker);
        marker.addListener("click", function () {
            if (openedInfoWindow) {
                openedInfoWindow.close();
            }
            infoWindow.open(map, marker);
            openedInfoWindow = infoWindow;
            console.log("User clicked on " + marker["name"] + "'s icon.");
        });
        console.log(name + " was placed at " + marker["position"] + ".");
    }

    map.setCenter(group["centre"]);

    for (var i = 0; i < group["members"].length; ++i) {
        createGroupMember(group["members"][i], group["area"]);
    }

    console.log("Map initialized under " + condition + " condition.");
}

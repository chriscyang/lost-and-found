// Set the group here
var group = groups["Downtown"];

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

function initMap(condition) {
    var openedInfoWindow;

    function createGroupMember(name, area) {
        var phone = "<a onclick='dialFriend();'><img src='img/icon_phone.png' /></a>";
        var profile = "<a onclick='showFriend(" + '"' + name + '"' + ");'><img src='img/icon_profile.png' /></a>";
        if (name === "Me") {
            var content = "<h4>You</b></h4>";
        } else {
            var content = "<p><h4>" + name + "</h4></p>" + phone + profile;
        }
        var marker = new google.maps.Marker({
            position : generateRandomLoc(area),
            map      : map,
            icon     : getMarkerIcon(name),
            content  : content,
        });
        var infoWindow = new google.maps.InfoWindow({
            content : marker["content"],
        });
        markers.push(marker);
        marker.addListener("click", function() {
            if (openedInfoWindow) {
                openedInfoWindow.close();
            }
            infoWindow.open(map, marker);
            openedInfoWindow = infoWindow;
        });
        console.log(name + " was placed at " + marker["position"] + ".");
    };

    map = new google.maps.Map(document.getElementById("map"), {
        center           : group["centre"],
        zoom             : 14,
        mapTypeId        : google.maps.MapTypeId.ROADMAP,
        disableDefaultUI : true,
    });

    for (var i = 0; i < group["members"].length; ++i) {
        createGroupMember(group["members"][i], group["area"]);
    }
}

function reInitMap(condition) {
    var openedInfoWindow;

    function createGroupMember(name, area) {
        var phone = "<a onclick='dialFriend();'><img src='img/icon_phone.png' /></a>";
        var profile = "<a onclick='showFriend(" + '"' + name + '"' + ");'><img src='img/icon_profile.png' /></a>";
        if (name === "Me") {
            var content = "<h4>You</b></h4>";
        } else {
            var content = "<p><h4>" + name + "</h4></p>" + phone + profile;
        }
        var marker = new google.maps.Marker({
            position : generateRandomLoc(area),
            map      : map,
            icon     : getMarkerIcon(name),
            content  : content,
        });
        var infoWindow = new google.maps.InfoWindow({
            content : marker["content"],
        });
        markers.push(marker);
        marker.addListener("click", function() {
            if (openedInfoWindow) {
                openedInfoWindow.close();
            }
            infoWindow.open(map, marker);
            openedInfoWindow = infoWindow;
        });
        console.log(name + " was placed at " + marker["position"] + ".");
    };

    map.setCenter(group["centre"]);

    for (var i = 0; i < group["members"].length; ++i) {
        createGroupMember(group["members"][i], group["area"]);
    }
}

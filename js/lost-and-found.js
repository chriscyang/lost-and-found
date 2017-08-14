$(document).ready(function () {

    // -------------------------------------------------------------------------
    // MAP
    // -------------------------------------------------------------------------

    initMap();

    // -------------------------------------------------------------------------
    // NAVBAR
    // -------------------------------------------------------------------------

    $(".tab-map").click(function () {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-map").addClass("active");
        $(".body").hide();
        $("#map").show();

        var center = map.getCenter();
        if (group) {
            center = group["centre"];
        }
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    $(".tab-groups").click(function () {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-groups").addClass("active");
        $(".body").hide();
        $("#groups").show();
    });

    $(".tab-profile").click(function () {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-profile").addClass("active");
        $(".body").hide();
        $("#profile").show();
        if (condition !== "Public") {
            $("#sensitive-locations").show();
        }
    });

    $(".tab-conditions").click(function () {
        $("#modal-conditions").modal("show");
    });

    $(".tab-refresh").click(function () {
        if (confirm("Are you sure you want to refresh the map?")) {
            clearOverlays();
            initGroup();
        } else {
            return false;
        }
    });

    // -------------------------------------------------------------------------
    // GROUPS
    // -------------------------------------------------------------------------

    $("[data-toggle='collapse']").click(function () {
        $(".collapse").collapse("hide");
    });

    $(".friend > a").click(function () {
        showFriend($(this).html());
    });

    $("#show-group1").click(function () {
        if ($("#group1").hasClass("panel-warning")) {
            $("#group2").removeClass("panel-primary");
            $("#group2").addClass("panel-warning");
            $("#status-group2").removeClass("btn-info");
            $("#status-group2").addClass("btn-warning");
            $("#status-group2").html("Inactive");

            $("#group1").removeClass("panel-warning");
            $("#group1").addClass("panel-primary");
            $("#status-group1").removeClass("btn-warning");
            $("#status-group1").addClass("btn-info");
            $("#status-group1").html("Active");

            console.log("Switching to Group 1 ...");
            clearOverlays();
            group = groups["UBC"];
            initGroup();
        }

        $(".tab-map").click();
        $("#listing-group1").collapse("hide");
    });

    $("#show-group2").click(function () {
        if ($("#group2").hasClass("panel-warning")) {
            $("#group1").removeClass("panel-primary");
            $("#group1").addClass("panel-warning");
            $("#status-group1").removeClass("btn-info");
            $("#status-group1").addClass("btn-warning");
            $("#status-group1").html("Inactive");

            $("#group2").removeClass("panel-warning");
            $("#group2").addClass("panel-primary");
            $("#status-group2").removeClass("btn-warning");
            $("#status-group2").addClass("btn-info");
            $("#status-group2").html("Active");

            console.log("Switching to Group 2 ...");
            clearOverlays();
            group = groups["Downtown"];
            initGroup();
        }

        $(".tab-map").click();
        $("#listing-group2").collapse("hide");
    });

    // -------------------------------------------------------------------------
    // USER PROFILE
    // -------------------------------------------------------------------------

    $("#new-location").focus(function () {
        return false;
    });

    $("#add-location").click(function () {
        if ($("#new-location").val()) {
            $("#new-location").parent().removeClass("has-error");
            $("#locations").append("<li class='list-group-item clearfix'>" +
                                   "<label class='location pull-left'>" + $("#new-location").val() + "</label>" +
                                   "<label class='pull-right'>" +
                                   "<span class='edit-location'>Edit</span> | " +
                                   "<span class='delete-location'>Delete</span> " +
                                   "</label></li>");
        } else {
            $("#new-location").parent().addClass("has-error");
        }
        $("#new-location").val("");
    });

    // -------------------------------------------------------------------------
    // CONDITIONS
    // -------------------------------------------------------------------------

    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            $("#modal-conditions").modal("hide");
        }
    });

    if (condition === "Public") {
        $("input:radio[value='Public']").attr("checked", "checked");
    } else if (condition === "Signal") {
        $("input:radio[value='Signal']").attr("checked", "checked");
    } else if (condition === "Private") {
        $("input:radio[value='Private']").attr("checked", "checked");
    }

    $("input[value='Save']").click(function () {
        var selectedCondition = $("input[name='condition']:checked").val();
        switch (selectedCondition) {
            case "Public":
                public();
                break;
            case "Signal":
                signal();
                break;
            case "Private":
                private();
                break;
            default:
                break;
        }
        $("#modal-conditions").modal("hide");
    });

    function public() {
        clearTimeout(timeout);
        timeout = [];
        clearOverlays();
        if (condition !== "Public") {
            condition = "Public";
            $("#locations").html("");
        }
        if ($("#profile").is(":visible")) {
            $(".tab-profile").click();
            $("#sensitive-locations").hide();
        }
        if (group) {
            initGroup();
        }
    }

    function signal() {
        clearTimeout(timeout);
        timeout = [];
        clearOverlays();
        if (condition !== "Signal") {
            condition = "Signal";
            $("#locations").html("");
        }
        if ($("#profile").is(":visible")) {
            $(".tab-profile").click();
        }
        if (group) {
            initGroup();
            timeout.push(setTimeout(function () {
                markers[3].setMap(null);
                alert(markers[3]["name"] + " has gone near a sensitive location.");
            }, 5000));
        }
    }

    function private() {
        clearTimeout(timeout);
        timeout = [];
        clearOverlays();
        if (condition !== "Private") {
            condition = "Private";
            $("#locations").html("");
        }
        if ($("#profile").is(":visible")) {
            $(".tab-profile").click();
        }
        if (group) {
            initGroup();
            timeout.push(setTimeout(function () {
                markers[3].setMap(null);
            }, 5000));
        }
    }

    // -------------------------------------------------------------------------
    // DIAL FRIEND
    // -------------------------------------------------------------------------

    $("#dial").click(function () {
        $(this).hide();
    });
});

// -----------------------------------------------------------------------------
// FRIEND
// -----------------------------------------------------------------------------

function dialFriend() {
    $("#dial").show();
}

function showFriend(name) {
    $(".tabs").removeClass("active");
    $(this).addClass("active");
    $(".body").hide();
    $("#friend").show();
    $("#friend-name").html(name);
    $("#friend-picture").initial({
        name     : name,
        width    : 120,
        height   : 120,
        fontSize : 80,
    });
}

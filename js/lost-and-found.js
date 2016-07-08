$(document).ready(function() {

    // -------------------------------------------------------------------------
    // MAP
    // -------------------------------------------------------------------------

    initMap();

    // -------------------------------------------------------------------------
    // NAVBAR MENU
    // -------------------------------------------------------------------------

     $("#logo").click(function() {
        clearOverlays();
        reInitMap();
    });

    $(".tab-map").click(function() {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-map").addClass("active");
        $(".body").hide();
        $("#map").show();
    });

    $(".tab-groups").click(function() {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-groups").addClass("active");
        $(".body").hide();
        $("#groups").show();
    });

    $(".tab-profile").click(function() {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-profile").addClass("active");
        $(".body").hide();
        $("#profile").show();
    });

    $(".tab-conditions").click(function() {
        if (!$(this).hasClass("active")) {
            $(".tabs").removeClass("active");
            $("li.tabs.tab-conditions").addClass("active");
        } else {
            $(".tabs").removeClass("active");
        }
    });

    $("#public").click(function() {
        clearOverlays();
        condition = "Public";
        reInitMap();
    });

    $("#signal").click(function() {
        clearOverlays();
        condition = "Signal";
        reInitMap();
        setTimeout(function() {
            markers[3].setMap(null);
            alert(markers[3]["name"] + " has gone near a sensitive location.");
        }, 20000);
    });

    $("#no-signal").click(function() {
        clearOverlays();
        condition = "No Signal";
        reInitMap();
        setTimeout(function() {
            markers[3].setMap(null);
        }, 20000);
    });

    // -------------------------------------------------------------------------
    // GROUPS
    // -------------------------------------------------------------------------

    $("[data-toggle='collapse']").click(function() {
        $(".collapse").collapse("hide");
    });

    $(".friend > a").click(function() {
        showFriend($(this).html());
    });

    $("#show-group1").click(function() {
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
            reInitMap();
            $(".tab-map").click();
        } else {
            $(".tab-map").click();
        }
    });

    $("#show-group2").click(function() {
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
            reInitMap();
            $(".tab-map").click();
        } else {
            $(".tab-map").click();
        }
    });

    // -------------------------------------------------------------------------
    // USER PROFILE
    // -------------------------------------------------------------------------

    $("#new-location").focus(function() {
        return false;
    });

    $("#new-location").popover({
        placement : "top",
    });

    $("#add-location").click(function() {
        if ($("#new-location").val()) {
            $("#locations").append("<p>" + $("#new-location").val() + "</p>");
        } else {
            $("#new-location").popover("show");
            setTimeout(function() {
                $("#new-location").popover("hide");
            }, 1000);
        }
        $("#new-location").val("");
    });

    // -------------------------------------------------------------------------
    // DIAL FRIEND
    // -------------------------------------------------------------------------

    $("#dial").click(function() {
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

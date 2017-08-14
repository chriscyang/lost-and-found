var LostAndFound = (function () {
    var instance;

    function create() {
        var pvt = {

                // -------------------------------------------------------------
                // ENUMS
                // -------------------------------------------------------------

                Condition: Object.freeze({
                    PUBLIC: 'public',
                    SIGNAL: 'signal',
                    PRIVATE: 'private',
                }),

                Status: Object.freeze({
                    ACTIVE: 'active',
                    INACTIVE: 'inactive',
                    EXPIRED: 'expired',
                }),

                // -------------------------------------------------------------
                // STATE
                // -------------------------------------------------------------

                map: null,
                markers: [],
                infoWindow: null,

                group: null,
                condition: null,
                timeout: [],
            },
            pub = {};

        // ---------------------------------------------------------------------
        // VARIABLES
        // ---------------------------------------------------------------------

        pvt.user = 'You';

        pvt.areas = {
            ubc: {
                center: new google.maps.LatLng(49.2611, -123.2531),
                min: new google.maps.LatLng(49.279508, -123.260821),
                max: new google.maps.LatLng(49.250336, -123.233212),
            },
            downtown: {
                center: new google.maps.LatLng(49.2842, -123.1211),
                min: new google.maps.LatLng(49.272071, -123.143484),
                max: new google.maps.LatLng(49.290619, -123.094494),
            },
        };

        pvt.groups = [
            {
                name: 'UBC Block Party',
                icon: 'guitar',
                status: pvt.Status.INACTIVE,
                area: pvt.areas.ubc,
                members: [
                    pvt.user,
                    'Brian',
                    'Eric',
                    'Lisa',
                    'Jodie',
                ],
            },
            {
                name: 'Friday Night! Woohoo!',
                icon: 'beers',
                status: pvt.Status.INACTIVE,
                area: pvt.areas.downtown,
                members: [
                    pvt.user,
                    'Adam',
                    'Calvin',
                    'Dexter',
                    'Frank',
                    'Kat',
                    'Michelle',
                    'Norah',
                ],
            },
            {
                name: 'Fright Night',
                icon: 'ghost',
                status: pvt.Status.EXPIRED,
            },
        ];

        // ---------------------------------------------------------------------
        // CONSTANTS
        // ---------------------------------------------------------------------

        pvt.MAP_ZOOM = 14;

        pvt.MAP_OPTIONS = {
            center: pvt.areas.ubc.center,
            zoom: pvt.MAP_ZOOM,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
        };

        pvt.LOST_FRIEND = 3;

        pvt.TIMEOUT_DURATION = 5000;

        // ---------------------------------------------------------------------
        // TEMPLATES
        // ---------------------------------------------------------------------

        // Tabs
        pvt.groupTemplate = $('#group-template').html().trim();
        pvt.memberTemplate = $('#member-template').html().trim();
        pvt.locationTemplate = $('#location-template').html().trim();

        // Map
        pvt.infoWindowNameTemplate = $('#infowindow-name-template').html().trim();
        pvt.infoWindowActionsTemplate = $('#infowindow-actions-template').html().trim();

        // ---------------------------------------------------------------------
        // ELEMENTS
        // ---------------------------------------------------------------------

        // Navbar
        pvt.$mapTab = $('[href="#map"]');

        // Tabs
        pvt.$map = $('#map');
        pvt.$groups = $('#group-list');
        pvt.$sensitive = $('#sensitive-locations');
        pvt.$locations = $('#locations');
        pvt.$newLocation = $('#location-new');
        pvt.$addLocation = $('#location-add');

        // Modals
        pvt.$friendPicture = $('#friend-picture');
        pvt.$friendName = $('#friend-name');
        pvt.$conditions = $('#conditions');
        pvt.$refresh = $('#refresh');

        // ---------------------------------------------------------------------
        // INITIALIZATION
        // ---------------------------------------------------------------------

        pub.init = function () {
            pvt.initMap();
            pvt.initGroups();
            pvt.initCondition();
            pvt.bindEvents();
        };

        pvt.initMap = function () {
            pvt.map = new google.maps.Map(pvt.$map[0], pvt.MAP_OPTIONS);
        };

        pvt.initGroups = function () {
            for (var i in pvt.groups) {
                var group = pvt.groups[i],
                    members = group.members,
                    membersHtml = '';

                for (var j in members) {
                    membersHtml += pvt.memberTemplate
                        .replace(/%name%/g, members[j]);
                }

                var groupHtml = pvt.groupTemplate
                    .replace(/%id%/g, i)
                    .replace(/%name%/g, group.name)
                    .replace(/%status%/g, group.status)
                    .replace(/%icon%/g, group.icon)
                    .replace(/%members%/g, membersHtml);

                pvt.$groups.append(groupHtml);
            }

            pvt.$groups.find('.collapse').collapse('hide');
        };

        pvt.initCondition = function () {
            pvt.condition = pvt.Condition.PUBLIC;
            pvt.$conditions.find('input[name="condition"]').filter('[value="' + pvt.condition + '"]').prop('checked', true);
            pvt.setCondition();
        };

        // ---------------------------------------------------------------------
        // EVENT LISTENERS
        // ---------------------------------------------------------------------

        pvt.bindEvents = function () {
            pvt.bindGroupCollapse();
            pvt.bindGroupActivate();
            pvt.bindExpiredGroup();
            pvt.bindLocationChange();
            pvt.bindAddLocation();
            pvt.bindShowFriend();
            pvt.bindSaveCondition();
            pvt.bindRefreshMap();
        };

        /**
         * Hides other groups when a group is clicked on.
         */
        pvt.bindGroupCollapse = function () {
            pvt.$groups.on('click', '[data-toggle="collapse"]', function () {
                var target = $(this).data('target');

                pvt.$groups.find('.collapse').not(target).collapse('hide');
            });
        };

        /**
         * Activating a group deactivates the currently active group and puts
         * its members on the map.
         */
        pvt.bindGroupActivate = function () {
            pvt.$groups.on('click', '.group.inactive .group-activate', function () {
                var group = parseInt($(this).data('group')),
                    $group = $(this).parents('.group').first(),
                    $groupStatus = $group.find('.group-status'),
                    $active = pvt.$groups.find('.group.active'),
                    $activeStatus = $active.find('.group-status'),
                    $activeActivate = $active.find('.group-activate');

                $group.addClass(pvt.Status.ACTIVE).removeClass(pvt.Status.INACTIVE);
                $groupStatus.html(pvt.Status.ACTIVE);
                $active.addClass(pvt.Status.INACTIVE).removeClass(pvt.Status.ACTIVE);
                $activeStatus.html(pvt.Status.INACTIVE);

                pvt.setGroup(pvt.groups[group]);
                pvt.$mapTab.tab('show');

                $group.find('.collapse').collapse('hide');

                $(this).hide();
                $activeActivate.show();
            });
        };

        /**
         * Clicking on an expired group does nothing.
         */
        pvt.bindExpiredGroup = function () {
            $('.group.expired').on('click', '[data-toggle="collapse"]', function () {
                return false;
            });
        };

        /**
         * Removes error indicator on location input.
         */
        pvt.bindLocationChange = function () {
            pvt.$newLocation.on('input', function () {
                $(this).parent().removeClass('has-error');
            });
        };

        /**
         * Adds error indicator if location input is blank on add, otherwise
         * adds it to the list and resets and input.
         */
        pvt.bindAddLocation = function () {
            pvt.$addLocation.on('click', function () {
                var location = pvt.$newLocation.val().trim();

                if (location.length > 0) {
                    var locationHtml = pvt.locationTemplate
                        .replace(/%location%/g, location);

                    pvt.$locations.append(locationHtml);
                } else {
                    pvt.$newLocation.parent().addClass('has-error');
                }

                pvt.$newLocation.val(null);
            });
        };

        pvt.bindShowFriend = function () {
            $('body').on('click', '.friend-show', function () {
                var name = $(this).data('name');

                pvt.$friendName.html(name);
                pvt.$friendPicture.initial({
                    name: name,
                    width: 100,
                    height: 100,
                    fontSize: 80,
                });
            });
        };

        pvt.bindSaveCondition = function () {
            pvt.$conditions.on('click', 'button[type="submit"]', function () {
                var condition = pvt.$conditions.find('input[name="condition"]').filter(':checked').val();

                pvt.condition = condition;

                pvt.setCondition();
                pvt.setGroup();
            });
        };

        pvt.bindRefreshMap = function () {
            pvt.$refresh.on('click', 'button[type="submit"]', function () {
                pvt.setGroup();
            });
        };

        // ---------------------------------------------------------------------
        // MAP
        // ---------------------------------------------------------------------

        pvt.setGroup = function (group) {
            if (typeof group !== 'undefined' && group !== null) {
                pvt.group = group;
            }

            if (typeof pvt.group !== 'undefined' && pvt.group !== null) {
                pvt.clearTimeout();
                pvt.clearMarkers();

                pvt.map.setCenter(pvt.group.area.center);
                pvt.map.setZoom(pvt.MAP_ZOOM);

                for (var i in pvt.group.members) {
                    pvt.setMember(pvt.group.members[i], pvt.group.area);
                }

                console.log('Map initialized under ' + pvt.condition + ' condition.');

                if (pvt.condition !== pvt.Condition.PUBLIC) {
                    pvt.setTimeout();
                }
            } else {
                console.log('There is no active group!');
            }
        };

        pvt.setMember = function (name, area) {
            var content = pvt.infoWindowNameTemplate.replace(/%name%/g, name),
                marker,
                infoWindow;

            if (name !== pvt.user) {
                content += pvt.infoWindowActionsTemplate.replace(/%name%/g, name);
            }

            marker = new google.maps.Marker({
                name: name,
                map: pvt.map,
                position: pvt.genLoc(area),
                icon: pvt.genIcon(name),
                content: content,
            });

            infoWindow = new google.maps.InfoWindow({
                content: marker.content,
            });

            marker.addListener('click', function () {
                if (pvt.infoWindow !== null) {
                    pvt.infoWindow.close();
                }
                infoWindow.open(map, marker);
                pvt.infoWindow = infoWindow;
            });

            pvt.markers.push(marker);

            console.log(name + ' was placed at ' + marker.position + '.');
        };

        pvt.genLoc = function (area) {
            var lat = pvt.genNum(area.min.lat(), area.max.lat()),
                lng = pvt.genNum(area.min.lng(), area.max.lng());

            return new google.maps.LatLng(lat, lng);
        };

        pvt.genNum = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        pvt.genIcon = function (name) {
            if (name === pvt.user) {
                return 'https://maps.google.com/mapfiles/arrow.png';
            } else {
                return 'https://www.google.com/mapfiles/marker' + name[0] + '.png';
            }
        };

        pvt.clearMarkers = function () {
            for (var i in pvt.markers) {
                pvt.markers[i].setMap(null);
            }
            pvt.markers.length = 0;
        };

        pvt.setTimeout = function () {
            pvt.timeout.push(setTimeout(function () {
                var lostFriend = pvt.markers[pvt.LOST_FRIEND],
                    message = lostFriend.name + ' has gone near a sensitive location.';

                lostFriend.setMap(null);
                console.log(message);
                if (pvt.condition === pvt.Condition.SIGNAL) {
                    alert(message);
                }
            }, pvt.TIMEOUT_DURATION));
        };

        pvt.clearTimeout = function () {
            clearTimeout(pvt.timeout);
            timeout = [];
        };

        // ---------------------------------------------------------------------
        // CONDITIONS
        // ---------------------------------------------------------------------

        pvt.setCondition = function () {
            if (pvt.condition === pvt.Condition.PUBLIC) {
                pvt.$sensitive.hide();
            } else {
                pvt.$sensitive.show();
            }
        };

        return pub;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = create();
            }

            return instance;
        }
    };
})();

$(document).ready(function () {
    LostAndFound.getInstance().init();
});

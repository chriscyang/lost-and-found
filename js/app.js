/* jshint -W117 */

const App = (() => {
    let instance;

    const create = () => {
        const pvt = {
            map: null,
            infoWindow: null,
            markers: _.stubArray(),

            group: null,
            condition: null,
            timeout: _.stubArray(),
        };
        const pub = _.stubObject();

        // ---------------------------------------------------------------------
        // ENUMS
        // ---------------------------------------------------------------------

        pvt.Status = Object.freeze({
            ACTIVE: 'active',
            INACTIVE: 'inactive',
            EXPIRED: 'expired',
        });

        pvt.Condition = Object.freeze({
            PUBLIC: 'public',
            SIGNAL: 'signal',
            PRIVATE: 'private',
        });

        pvt.Tab = Object.freeze({
            MAP: 'map',
            GROUPS: 'groups',
            PROFILE: 'profile',
        });

        pvt.Selector = Object.freeze({
            GROUP: '.group',
            GROUP_STATUS: '.group-status',
            GROUP_SWITCH: '.group-switch',

            ACTIVE: '.' + pvt.Status.ACTIVE,
            INACTIVE: '.' + pvt.Status.INACTIVE,
            EXPIRED: '.' + pvt.Status.EXPIRED,

            COLLAPSE: '.collapse',

            SUBMIT: 'button[type=submit]',
        });

        // ---------------------------------------------------------------------
        // DATA
        // ---------------------------------------------------------------------

        pvt.user = 'You';

        pvt.areas = Object.freeze({
            ubc: Object.freeze({
                center: new google.maps.LatLng(49.2611, -123.2531),
                min: new google.maps.LatLng(49.279508, -123.260821),
                max: new google.maps.LatLng(49.250336, -123.233212),
            }),
            downtown: Object.freeze({
                center: new google.maps.LatLng(49.2842, -123.1211),
                min: new google.maps.LatLng(49.272071, -123.143484),
                max: new google.maps.LatLng(49.290619, -123.094494),
            }),
        });

        pvt.groups = [
            Object.freeze({
                id: _.parseInt(_.uniqueId()),
                name: 'UBC Block Party',
                icon: 'music',
                status: pvt.Status.INACTIVE,
                area: pvt.areas.ubc,
                members: [
                    pvt.user,
                    'Brian',
                    'Eric',
                    'Lisa',
                    'Jodie',
                ],
            }),
            Object.freeze({
                id: _.parseInt(_.uniqueId()),
                name: 'Friday Night! Woohoo!',
                icon: 'beer',
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
            }),
            Object.freeze({
                id: _.parseInt(_.uniqueId()),
                name: 'Fright Night',
                icon: 'snapchat-ghost',
                status: pvt.Status.EXPIRED,
            }),
        ];

        // ---------------------------------------------------------------------
        // CONSTANTS
        // ---------------------------------------------------------------------

        pvt.MAP_ZOOM = 14;

        pvt.MAP_OPTIONS = Object.freeze({
            zoom: pvt.MAP_ZOOM,
            center: pvt.areas.ubc.center,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        pvt.TIMEOUT_DURATION = 5000;

        // ---------------------------------------------------------------------
        // INITIALIZATION
        // ---------------------------------------------------------------------

        pub.init = () => {
            pvt.initTemplate();
            pvt.initElements();

            pvt.initMap();
            pvt.initGroups();
            pvt.initCondition();

            pvt.setTab(pvt.Tab.MAP);
        };

        pvt.initTemplate = () => {
            pvt.Template = Object.freeze({
                GROUPS: _.template($('#groups-template').html().trim()),
                LOCATION: _.template($('#location-template').html().trim()),
                INFO_WINDOW_NAME: _.template($('#info-window-name-template').html().trim()),
                INFO_WINDOW_ACTIONS: _.template($('#info-window-actions-template').html().trim()),
            });
        };

        pvt.initElements = () => {
            // Tabs
            pvt.$map = $('#map');
            pvt.$groups = $('#group-list');
            pvt.$sensitive = $('#sensitive-locations');
            pvt.$locations = $('#locations');
            pvt.$location = $('#location');

            // Modals
            pvt.$friend = $('#friend');
            pvt.$friendName = $('#friend-name');
            pvt.$friendPicture = $('#friend-picture');
            pvt.$conditions = $('#conditions');
            pvt.$refresh = $('#refresh');
        };

        pvt.initMap = () => {
            pvt.map = new google.maps.Map(pvt.$map[0], pvt.MAP_OPTIONS);
        };

        pvt.initGroups = () => {
            pvt.$groups
                .html(pvt.Template.GROUPS({
                    groups: pvt.groups,
                }))
                .find(pvt.Selector.COLLAPSE)
                .collapse('hide');
        };

        pvt.initCondition = () => {
            pvt.setCondition(pvt.Condition.PUBLIC);
        };

        // ---------------------------------------------------------------------
        // EVENT LISTENERS
        // ---------------------------------------------------------------------

        pub.bind = () => {
            // Tabs
            pvt.bindGroups();
            pvt.bindProfile();

            // Modals
            pvt.bindFriend();
            pvt.bindConditions();
            pvt.bindRefresh();
        };

        pvt.bindGroups = () => {
            pvt.$groups.on('click', pvt.Selector.EXPIRED, () => {
                return false;
            });

            pvt.$groups.on('show.bs.collapse', pvt.Selector.COLLAPSE, function () {
                const target = $(this).data('target');

                pvt.$groups
                    .find(pvt.Selector.COLLAPSE)
                    .not(target)
                    .collapse('hide');
            });

            pvt.$groups.on('click', pvt.Selector.GROUP_SWITCH, function () {
                const id = $(this).data('id');

                pvt.setGroup(id);
            });
        };

        pvt.bindProfile = () => {
            pvt.$location.on('input', function () {
                $(this).parent().removeClass('has-error');
            });

            pvt.$sensitive.on('click', pvt.Selector.SUBMIT, function () {
                const location = pvt.$location.val().trim();

                if (!_.isEmpty(location)) {
                    pvt.$locations.append(pvt.Template.LOCATION({
                        location: location,
                    }));
                } else {
                    pvt.$location.parent().addClass('has-error');
                }

                pvt.$location.val(null);
            });
        };

        pvt.bindFriend = () => {
            pvt.$friend.on('show.bs.modal', function () {
                const name = pvt.infoWindow.anchor.name;

                pvt.$friendName.text(name);
                pvt.$friendPicture.initial({
                    name: name,
                    width: 100,
                    height: 100,
                    fontSize: 80,
                });
            });
        };

        pvt.bindConditions = () => {
            pvt.$conditions.on('click', pvt.Selector.SUBMIT, function () {
                const condition = pvt.$conditions.find('input:checked').val();

                pvt.setCondition(condition);
                pvt.setMap();
            });
        };

        pvt.bindRefresh = () => {
            pvt.$refresh.on('click', pvt.Selector.SUBMIT, function () {
                pvt.setMap();
            });
        };

        // ---------------------------------------------------------------------
        // SETTERS
        // ---------------------------------------------------------------------

        pvt.setTab = (tab) => {
            $('[href="#' + tab + '"]').tab('show');
        };

        pvt.setGroup = (id) => {
            const group = _.find(pvt.groups, {
                id: id,
            });

            if (!_.isNil(group) && group.status === pvt.Status.INACTIVE) {
                const $groups = pvt.$groups.find(pvt.Selector.GROUP);

                $groups
                    .filter(pvt.Selector.ACTIVE)
                    .addClass(pvt.Status.INACTIVE)
                    .removeClass(pvt.Status.ACTIVE)
                    .find(pvt.Selector.GROUP_STATUS)
                    .text(pvt.Status.INACTIVE)
                    .end()
                    .find(pvt.Selector.GROUP_SWITCH)
                    .show();
                $groups
                    .filter('[data-id=' + id + ']')
                    .addClass(pvt.Status.ACTIVE)
                    .removeClass(pvt.Status.INACTIVE)
                    .find(pvt.Selector.GROUP_STATUS)
                    .text(pvt.Status.ACTIVE)
                    .end()
                    .find(pvt.Selector.GROUP_SWITCH)
                    .hide();

                pvt.setTab(pvt.Tab.MAP);

                pvt.group = group;
                pvt.setMap(group);
            }
        };

        pvt.setMap = () => {
            if (!_.isNil(pvt.group)) {
                pvt.reset();

                pvt.map.setCenter(pvt.group.area.center);
                pvt.map.setZoom(pvt.MAP_ZOOM);
                pvt.setMarkers();

                console.log('Map initialized under ' + pvt.condition + ' condition.');

                if (pvt.condition !== pvt.Condition.PUBLIC) {
                    pvt.setTimeout();
                }
            } else {
                console.log('There is no active group!');
            }
        };

        pvt.setMarkers = () => {
            _.each(pvt.group.members, (member) => {
                const marker = new google.maps.Marker({
                    name: member,
                    map: pvt.map,
                    icon: pvt.genIcon(member),
                    content: pvt.genContent(member),
                    position: pvt.genPosition(pvt.group.area),
                });
                const infoWindow = new google.maps.InfoWindow({
                    content: marker.content,
                });

                marker.addListener('click', () => {
                    if (!_.isNull(pvt.infoWindow)) {
                        pvt.infoWindow.close();
                    }
                    infoWindow.open(map, marker);
                    pvt.infoWindow = infoWindow;
                });
                pvt.markers.push(marker);

                console.log(member + ' was placed at ' + marker.position + '.');
            });
        };

        pvt.setCondition = (condition) => {
            pvt.condition = condition;
            pvt.$conditions
                .find('input[value=' + pvt.condition + ']')
                .prop('checked', true);

            pvt.$sensitive.toggle(pvt.condition !== pvt.Condition.PUBLIC);
        };

        pvt.setTimeout = () => {
            pvt.timeout.push(setTimeout(() => {
                const member = pvt.getRandomMarker();
                member.setMap(null);

                const message = member.name + ' has gone near a sensitive location.';
                console.log(message);
                if (pvt.condition === pvt.Condition.SIGNAL) {
                    alert(message);
                }
            }, pvt.TIMEOUT_DURATION));
        };

        // ---------------------------------------------------------------------
        // HELPERS
        // ---------------------------------------------------------------------

        pvt.getRandomMarker = () => {
            const index = _.random(1, _.size(pvt.markers) - 1);

            return pvt.markers[index];
        };

        pvt.genIcon = (name) => {
            if (name === pvt.user) {
                return 'https://maps.google.com/mapfiles/arrow.png';
            } else {
                return 'https://www.google.com/mapfiles/marker' + _.head(name) + '.png';
            }
        };

        pvt.genContent = name => {
            let content = pvt.Template.INFO_WINDOW_NAME({
                name: name,
            });

            if (name !== pvt.user) {
                content += pvt.Template.INFO_WINDOW_ACTIONS({
                    name: name,
                });
            }

            return content;
        };

        pvt.genPosition = (area) => {
            const lat = _.random(area.min.lat(), area.max.lat(), true);
            const lng = _.random(area.min.lng(), area.max.lng(), true);

            return new google.maps.LatLng(lat, lng);
        };

        // ---------------------------------------------------------------------
        // RESETS
        // ---------------------------------------------------------------------

        pvt.reset = () => {
            pvt.resetMarkers();
            pvt.resetTimeout();
        };

        pvt.resetMarkers = () => {
            _.each(pvt.markers, (marker) => {
                marker.setMap(null);
            });
            pvt.markers = _.stubArray();
        };

        pvt.resetTimeout = () => {
            clearTimeout(pvt.timeout);
            pvt.timeout = _.stubArray();
        };

        return pub;
    };

    return {
        getInstance: () => {
            if (_.isUndefined(instance)) {
                instance = create();
            }

            return instance;
        }
    };
})();

$(document).ready(() => {
    App.getInstance().init();
    App.getInstance().bind();
});

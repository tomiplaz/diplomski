(function() {
    'use strict';

    var scDateTimeI18n = {
        previousMonth: "Prethodni mjesec",
        nextMonth: "Sljedeći mjesec",
        incrementHours: "Inkrementiraj sate",
        decrementHours: "Dekrementiraj sate",
        incrementMinutes: "Inkrementiraj minute",
        decrementMinutes: "Dekrementiraj minute",
        switchAmPm: "Promjeni AM/PM",
        now: "Sada",
        cancel: "Poništi",
        save: "Spremi",
        weekdays: ['N', 'P', 'U', 'S', 'Č', 'P', 'S'],
        switchTo: 'Promjeni na',
        clock: 'Sat',
        calendar: 'Kalendar'
    };

    var scDateTimeConfig = {
        defaultTheme: 'material',
        autosave: false,
        defaultDate: new Date(Date.now() + 7 * 86400000),
        displayMode: 'full',
        defaultOrientation: false,
        displayTwentyfour: true,
        compact: false
    };

    angular
        .module('app')
        .config(configure)
        .value('scDateTimeI18n', scDateTimeI18n)
        .value('scDateTimeConfig', scDateTimeConfig);

    function configure($urlRouterProvider, RestangularProvider, $mdThemingProvider, $authProvider, $mdIconProvider) {
        $mdThemingProvider
            .theme('default')
            .primaryPalette('green')
            .accentPalette('blue')
            .warnPalette('amber')
            .backgroundPalette('grey');

        $mdIconProvider
            .icon('check', 'app/icons/ic_check_black_24px.svg')
            .icon('close', 'app/icons/ic_close_black_24px.svg')
            .icon('delete', 'app/icons/ic_delete_black_24px.svg')
            .icon('edit', 'app/icons/ic_edit_black_24px.svg')
            .icon('home', 'app/icons/ic_home_black_24px.svg')
            .icon('library_add', 'app/icons/ic_library_add_black_24px.svg')
            .icon('library_books', 'app/icons/ic_library_books_black_24px.svg')
            .icon('menu', 'app/icons/ic_menu_black_24px.svg')
            .icon('picture_as_pdf', 'app/icons/ic_picture_as_pdf_black_24px.svg')
            .icon('save', 'app/icons/ic_save_black_24px.svg')
            .icon('send', 'app/icons/ic_send_black_24px.svg')
            .icon('navigate_before', 'app/icons/ic_navigate_before_black_24px.svg')
            .icon('navigate_next', 'app/icons/ic_navigate_next_black_24px.svg')
            .icon('check_circle', 'app/icons/ic_check_circle_black_24px.svg')
            .icon('cancel', 'app/icons/ic_cancel_black_24px.svg')
            .icon('thumb_down', 'app/icons/ic_thumb_down_black_24px.svg')
            .icon('thumb_up', 'app/icons/ic_thumb_up_black_24px.svg')
            .icon('thumbs_up_down', 'app/icons/ic_thumbs_up_down_black_24px.svg')
            .icon('details', 'app/icons/ic_details_black_24px.svg')
            .icon('add_circle', 'app/icons/ic_add_circle_black_24px.svg')
            .icon('remove_circle', 'app/icons/ic_remove_circle_black_24px.svg')
            .icon('attachment', 'app/icons/ic_attachment_black_24px.svg');


        $authProvider.loginUrl = 'api/v1/auth';

        RestangularProvider.setBaseUrl('api/v1');

        $urlRouterProvider.otherwise('/login');
    }
})();
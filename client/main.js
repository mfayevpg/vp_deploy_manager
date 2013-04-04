/**
 * User: mfaye
 * Date: 28/03/13
 * Time: 17:5
 */
Meteor.pages({
    '/login': { to: 'loggingForm', as: 'pleaseLogin'},
    '/': {to: 'mainDisplay', before: isLoggedIn, layout: 'loggedLayout'},
    '/deploy/new': {to: 'mainDisplay', as: 'newDeploy', before: [isLoggedIn, createEmpty], layout: 'loggedLayout'},
    '/deploy/edit/:_id': {to: 'mainDisplay', as: 'editDeploy', before: [isLoggedIn, setCurrentDeploy], layout: 'loggedLayout'},
    '/admin':{to:'userListDisplay', before:[isLoggedIn, isCurrentUserAdmin], layout: 'loggedLayout'}
}, {
    defaults: {
        layout: 'notLoggedLayout'
    }
});

function isLoggedIn(pageInvocation) {
    if (!Meteor.userId() || Meteor.userId() == null) {
        console.log('Meteor.userId()');
        pageInvocation.redirect(Meteor.pleaseLoginPath());
    }
}

function createEmpty(pageInvocation) {
    Meteor.call('createEmptyDeploy', function (err, result) {
        if (err) {
            throw err;
        }
        if (result) {
            pageInvocation.redirect(Meteor.editDeployPath() + result);
        }
    });
}

function setCurrentDeploy(pageInvocation) {
    DeployHelper.setCurrentDeploy(DeploymentList.findOne({_id: pageInvocation.params._id}));
}

Meteor.autorun(function () {
    if (Meteor.userId() && Meteor.userId() != null) {
        Meteor.router.go(Meteor.mainDisplayPath());
    } else {
        Meteor.router.go(Meteor.pleaseLoginPath());
    }
});

Template.timezoneList.helpers({
    deployingTimezone: function () {
        var timezoneList = [
            {countryCode: 'br', location: '-15.8,-47.9', timeZoneId: "America/Sao_Paulo" },
            {countryCode: 'es', location: '40.433333,-3.683333', timeZoneId: "Europe/Madrid" },
            {countryCode: 'fr', location: '48.856578,2.351828', timeZoneId: "Europe/Paris" },
            {countryCode: 'it', location: '41.888732,12.48657', timeZoneId: "Europe/Rome" },
            {countryCode: 'pl', location: '52.2323,21.008433', timeZoneId: "Europe/Warsaw" },
            {countryCode: 'uk', location: '51.504872,-0.07857', timeZoneId: "Europe/London"}
        ];
        return timezoneList;
    }
});

function updateTime(utcTime, result, $currentLi) {
    var localizedTimestamp = utcTime + parseInt(result.dstOffset) + parseInt(result.rawOffset);
    var localizedDate = new Date(localizedTimestamp * 1000);
    $currentLi.text(localizedDate.getHours() + ':' + localizedDate.getMinutes());
}
Template.timezoneDisplay.rendered = function () {
    var location = this.data.location;
    var countryCode = this.data.countryCode;
    setLocalizedTime(location, countryCode);
    setInterval(function () {
        setLocalizedTime(location, countryCode);
    }, 1000);

    function setLocalizedTime(location, countryCode) {
        var utcTime = (new Date().getTime() / 1000) + (new Date().getTimezoneOffset() * 60);
        var $currentLi = $('#timezone_' + countryCode);
        var sessionTimezone = Session.get('timezoneList_' + countryCode);
        if (!sessionTimezone || sessionTimezone == '') {
            var googleRequestTemplate = 'https://maps.googleapis.com/maps/api/timezone/json?location=#LOCATION#&timestamp=' + utcTime + '&sensor=false';
            console.log(googleRequestTemplate.replace('#LOCATION#', location));
            Meteor.http.get(googleRequestTemplate.replace('#LOCATION#', location), function (err, result) {
                if (err) {
                    throw err;
                } else {
                    if (result.data.status == 'OK') {
                        Session.set('timezoneList_' + countryCode, result.data);
                        updateTime(utcTime, result.data, $currentLi);
                    } else {
                        console.log(result);
                    }
                }
            });
        } else {
            updateTime(utcTime, sessionTimezone, $currentLi);
        }
    }
};

function isCurrentUserAdmin(pageInvocation){
    var out = false;
    if (Meteor.userId()) {
        var count = Meteor.users.find({$and: [
            {isAdmin: true},
            {_id: Meteor.userId()}
        ] }).count();
        out = (count == 1);
    }
    if(pageInvocation && !out){
        pageInvocation.redirect(Meteor.mainDisplayPath());
    }

    return out;
}

Handlebars.registerHelper('isAdmin', function () {
        return isCurrentUserAdmin();
    }
);

function checkStatus(statusToCheck){
    var out = false;
    var currentDeploy = DeployHelper.getCurrentDeploy();
    if(currentDeploy != null){
        out = (currentDeploy.status == statusToCheck);
    }
    return out;
}

function isPlayer(){
    var out = false;
    var currentDeploy = DeployHelper.getCurrentDeploy();
    if(currentDeploy != null){
        if(_.find(currentDeploy.playerList, function(player){
            return (player._id == Meteor.userId());
        })){
            out = true;
        }
    }

    return out;
}

Handlebars.registerHelper('isInProgress', function () {
        return checkStatus('in_progress');
    }
);

Handlebars.registerHelper('isEdit', function () {
        return checkStatus('edit');
    }
);

Handlebars.registerHelper('isDone', function () {
        return checkStatus('done');
    }
);

Handlebars.registerHelper('canUpdate', function () {
        var out = checkStatus('edit');
        if(out){
            out = (out && isPlayer());
            out = (out || isCurrentUserAdmin());
        }

        return out;
    }
);

Template.mainDisplay.events({
    'click a#toggleResize':function(event){
        event.preventDefault();
        console.log('toto');
        DeployHelper.toggleFullscreen();
    }
});

Template.mainDisplay.helpers({
    handleFullscreen: function(divId){
        var $currentDiv = $('#' + divId);
        if($currentDiv.length > 0){
            if(DeployHelper.isFullscreen()){
                if(divId == 'divDeployList'){
                    $currentDiv.hide();
                    console.log('hide');
                }
//                else if(divId == 'divMainDisplay'){
//                    $currentDiv.attr('class', 'span12');
//                }
            }else{
                if(divId == 'divDeployList'){
                    console.log('show');
                    $currentDiv.show();
                }
//                else if(divId == 'divMainDisplay'){
//                    $currentDiv.attr('class', 'span10');
//                }
            }
        }
    }
});
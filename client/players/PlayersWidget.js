/**
 * User: mfaye
 * Date: 29/03/13
 * Time: 16:22
 */
var PlayersWidget = {
    isUpdateSessionKey: 'isPlayerListUpdate',
    checkForAvailablePlayers: function(query, process){
        var currentDeploy = Session.get('currentDeploy');
        var out = [];
        if(currentDeploy && currentDeploy._id){
            var idList = _.pluck(currentDeploy.playerList, '_id');
            console.log(idList);
            Meteor.users.find({'playerList._id' : {$nin : idList}}).forEach(function(player){
                var html = '<img src="' + player.profile.avatar_url + '" style="height: 32px; width: 32px" /> ' + player.profile.name;
                out.push(html);
            });
        }

        return out;
    },
    updateCurrentPlayerList : function(selectedItem){

    }
};
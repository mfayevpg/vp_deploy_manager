/**
 * User: mfaye
 * Date: 29/03/13
 * Time: 16:22
 */
var PlayersWidget = {
    isUpdateSessionKey: 'isPlayerListUpdate',
    checkForAvailablePlayers: function(query, process){
        var currentDeploy = Session.get('currentDeploy');
        if(currentDeploy && currentDeploy._id){
            Meteor.users.find({$nin:{playerList:currentDeploy.playerList}});
        }
    },
    updateCurrentPlayerList : function(selectedItem){

    }
};
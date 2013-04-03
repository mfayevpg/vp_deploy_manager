/**
 * User: mfaye
 * Date: 29/03/13
 * Time: 16:22
 */
var PlayersWidget = {
    isUpdateSessionKey: 'isPlayerListUpdate',
    checkForAvailablePlayers: function(query, process){
        var out = [];
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            var idList = _.pluck(currentDeploy.playerList, '_id');
            Meteor.users.find({_id : {$nin : idList}}).forEach(function(player){
                var html = '<img src="' + player.profile.avatar_url + '" style="height: 32px; width: 32px" data-player="' + player._id + '" /> ' + player.profile.name;
                out.push(html);
            });
        }

        return out;
    },
    updateCurrentPlayerList : function(selectedItem){
        var addedUserId = $(selectedItem).data('player');
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            var addedUser = Meteor.users.findOne({_id: addedUserId});
            var embeddedUser = _.pick(addedUser.profile,'avatar_url', 'name', 'html_url');
            embeddedUser['_id'] = addedUser._id;
            DeploymentList.update({_id: currentDeploy._id}, {$push : {playerList: embeddedUser}}, {}, function(err){
                if(err){
                    throw err;
                }
                console.log('Updated');
                currentDeploy.playerList.push(embeddedUser);
            });
        }
    }
};
/**
 * User: Maskime
 * Date: 03/04/13
 * Time: 19:30
 */
var DeployHelper = {
    sessionKey : 'currentDeploy',
    getCurrentDeploy: function(){
        var currentDeploy = Session.get(DeployHelper.sessionKey);
        var out = null;
        if(currentDeploy && currentDeploy._id){
            out = currentDeploy;
        }

        return out;
    },
    setCurrentDeploy : function(currentDeploy){
        Session.set(DeployHelper.sessionKey, currentDeploy);
    }
};
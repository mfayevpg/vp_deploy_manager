if (Meteor.isClient) {
    Template.mainDisplay.helpers({
        currentDeploy:function(){
            var out =false;
            var currentDeploy = DeployHelper.getCurrentDeploy();
            if(currentDeploy != null){
                out = true;
            }

            return out;
        }
    });
}

if (Meteor.isServer) {
//  Meteor.startup(function () {
//    // code to run on server at startup
//  });
}

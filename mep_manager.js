if (Meteor.isClient) {
    Template.mainDisplay.helpers({
        currentDeploy:function(){
            var currentDeploy = Session.get('currentDeploy');
            var out =false;
            if(currentDeploy && currentDeploy._id){
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

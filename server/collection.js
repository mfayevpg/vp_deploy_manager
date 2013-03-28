/**
 * User: mfaye
 * Date: 28/03/13
 * Time: 18:26
 */
Meteor.methods({
    userExists: function (email) {
        var out = false;
        if(Meteor.users){
            out = (Meteor.users.find({email: email}).count() > 0);
        }
        return out;
    }
});
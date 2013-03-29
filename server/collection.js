/**
 * User: mfaye
 * Date: 28/03/13
 * Time: 18:26
 */
Meteor.publish('availablePlayers', function(query, mepId){
    var out;
    var self = this;
    if(mepId){

    }else{
        var queryDocument = {
            $and:[
                {_id: {$ne: self.userId}},
                {
                    $or:[
                        {'profile.name': /.*query.*/},
                        {'profile.login': /.*query.*/},
                        {'profile.email': /.*query.*/},
                    ]
                }
            ]
        };
       out = Meteor.users.find(queryDocument,{
           fieds:{_id: 1, 'profile.email': 1, 'profile.login': 1, 'profile.name': 1, 'profile.avatar_url': 1}
       });
    }

    return out;
});
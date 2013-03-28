/**
 * User: Maskime
 * Date: 28/03/13
 * Time: 21:20
 */
Accounts.validateNewUser(function (user) {
//Checking that the member trying to signup is member of VPG
    var accessToken = user.services.github.accessToken;
    console.log(accessToken, user.profile.login);
    var organizations = Meteor.http.get("https://api.github.com/users/" + user.profile.login + "/orgs", {
        params: {
            access_token: accessToken
        }
    });
    var found = false;
    if (organizations.error) {
        throw organizations.error;
    } else {
        if (organizations.data.length > 0) {
            for (var i = 0; i < organizations.data.length; i++) {
                if (organizations.data[i].login == 'vpg' && organizations.data[i].id == '1394283') {
                    found = true;
                    break;
                }
            }
        }
    }
    return found;
});

Accounts.onCreateUser(function (options, user) {
//Retrieving additional data about user from github
    var accessToken = user.services.github.accessToken,
        result,
        profile;
    result = Meteor.http.get("https://api.github.com/user", {
        params: {
            access_token: accessToken
        }
    });
    if (result.error)
        throw result.error;
    profile = result.data;
    user.profile = profile;

    return user;
});
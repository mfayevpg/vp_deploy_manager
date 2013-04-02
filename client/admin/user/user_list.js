/**
 * User: Maskime
 * Date: 02/04/13
 * Time: 23:01
 */
Template.userListDisplay.helpers({
    userList: function(){
        return Meteor.users.find();
    },
    isChecked: function(){
        var self = this;
        var out = '';
        if(self.isAdmin && self.isAdmin == true){
            out = 'checked="checked"';
        }
        return out;
    },
    isDisabled: function(){
        var self = this;
        var  out = '';
        if(self._id == Meteor.userId()){
            out = 'disabled="disabled"';
        }

        return out;
    }
});

Template.userListDisplay.events({
    'click input': function(event){
        var newAdminValue = false;
        if(this.isAdmin){
            newAdminValue = !this.isAdmin;
        }else{
            newAdminValue = true;
        }
        Meteor.users.update({_id: this._id}, {$set: {isAdmin:newAdminValue}});
    }
});
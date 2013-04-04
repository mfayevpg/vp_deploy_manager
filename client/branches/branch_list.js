/**
 * User: Maskime
 * Date: 03/04/13
 * Time: 19:29
 */
Template.branchListDisplay.helpers({
    branchList : function(){
        var out = null;
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            out = currentDeploy.branchList;
        }

        return out;
    },
    isUpdate: function(){
        return DeployHelper.getBranchListUpdateState();
    }
});

Template.branchListDisplay.events({
    'click a#addBranch': function(event){
        event.preventDefault();
        var $selectProduct = $('#selectProduct');
        var $branchName = $('#branchName');

        var selectedProduct = $selectProduct.val();
        var branchName = $branchName.attr('value');
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(selectedProduct != '' && branchName != '' && currentDeploy != null){
            var branch = {_id: Meteor.uuid(),product: selectedProduct, branchName: branchName};
            DeploymentList.update({_id: currentDeploy._id}, {$push: {branchList: branch}}, function(err){
                if(err){
                    throw err;
                }
                currentDeploy.branchList.push(branch);
                DeployHelper.setCurrentDeploy(currentDeploy);
                $selectProduct.val('');
                $branchName.attr('value', '');
            });
        }
    },
    'click a#toggleUpdateMode': function(event){
        event.preventDefault();
        DeployHelper.toggleBranchListUpdateState();
    },
    'click a.removeBranchFromList': function(event){
        event.preventDefault();
        var currentDeploy = DeployHelper.getCurrentDeploy();
        var self = this;
        if(currentDeploy != null){
            DeploymentList.find({_id: currentDeploy._id}).forEach(function(deploy){
                var newBranchList = _.reject(deploy.branchList, function(element){
                    return (element._id == self._id);
                });
                newBranchList = _.toArray(newBranchList);
                DeploymentList.update({_id: currentDeploy._id}, {$set:{branchList: newBranchList}}, function(err){
                    if(err){
                        throw err;
                    }
                    currentDeploy.branchList = newBranchList;
                    DeployHelper.setCurrentDeploy(currentDeploy);
                });
            });
        }
    }
});
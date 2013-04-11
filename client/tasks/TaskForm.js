/**
 * User: Maskime
 * Date: 11/04/13
 * Time: 08:35
 */

TaskForm = function(p_deploy){
    var self = this;
    this.pojso = {
        deployId: ''
    };

    this.separator = null;

    if(p_deploy != null){
        self.pojso.deployId = p_deploy._id;
        self.initializeFromForm();
    }

    this.initializeFromForm = function(){
        
    };

    this.isSeparator = function(){
        if(self.separator == null){
            self.separator = $('#separator');
        }
        return ((typeof self.separator.attr('checked') != 'undefined') && (self.separator.attr('checked') == 'checked'));
    };

    this.isValid = function(){

    };

    this.getObject = function(){

    };
};

//var TaskForm = {
//    separator:'',
//    separatorId:'separator',
//    productName: 'productName',
//    productNameId: '',
//    buList: '',
//    buIdList: '',
//    description: '',
//    descriptionId: '',
//    command: '',
//    commandId: '',
//    server: '',
//    serverId: '',
//    deployId: ''
//};

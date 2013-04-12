/**
 * User: Maskime
 * Date: 11/04/13
 * Time: 08:35
 */

TaskForm = function(p_deploy){
    var self = this;
    this.pojso = {
        deployId: '',
        isSeparator: false,
        description: '',
        productName: '',
        command: '',
        server: '',
        buList : []
    };

    this.fieldIdList = {
        separator : 'separator',
        description: 'description',
        productName: 'productName',
        command: 'command',
        server: 'server'
    };

    this.separator = null;
    this.description = null;
    this.productName = null;
    this.command = null;
    this.server = null;

    if(p_deploy != null){
        self.pojso.deployId = p_deploy._id;
    }

    this.initializeFromForm = function(){
        self.description = initJqueryWrapper(self.description, self.fieldIdList.description);
        self.description.parent().parent().removeClass('error');
    };

    function initJqueryWrapper(container, selector) {
        if (container == null) {
            container = $('#' + selector);
        }
        return container;
    }

    this.isSeparator = function(){
        self.separator = initJqueryWrapper(self.separator, self.fieldIdList.separator);
        return isCheckboxChecked(self.separator);
    };

    this.isValid = function(){
        self.initializeFromForm();
        var currentDescription = self.getDescription();
        return (currentDescription != '');
    };

    function isCheckboxChecked (jQueryWrapper){
        return ((typeof jQueryWrapper.attr('checked') != 'undefined') && (jQueryWrapper.attr('checked') == 'checked'))
    }

    function getFieldVal(fieldName){
        self[fieldName] = initJqueryWrapper(self[fieldName], self.fieldIdList[fieldName]);

        return self[fieldName].val();
    }

    this.getProductName = function(){
        return getFieldVal('productName');
    };
    
    this.getCommand = function(){
        return getFieldVal('command');
    };

    this.getServer = function(){
        return getFieldVal('server');
    };


    this.getDescription = function(){
        return getFieldVal('description');
    };

    this.getBuList = function(){
        var out = [];
        $('input[id^=bu_]').each(function(){
            var $self = $(this);
            if(isCheckboxChecked($self)){
                out.push($self.attr('value'));
            }
        });

        return out;
    };

    this.getObject = function(){
        self.pojso.isSeparator = self.isSeparator();
        self.pojso.productName = self.getProductName();
        self.pojso.command = self.getCommand();
        self.pojso.description = self.getDescription();
        self.pojso.server = self.getServer();
        self.pojso.buList = self.getBuList();
        console.log(self.pojso);
        return self.pojso;
    };

    this.highlightErrors = function(){
        self.description.parent().parent().addClass('error');
    };
};
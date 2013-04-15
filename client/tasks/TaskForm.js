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

    function workFieldVal(fieldName, fieldValue){
        self[fieldName] = initJqueryWrapper(self[fieldName], self.fieldIdList[fieldName]);

        var out = fieldValue;
        if(typeof fieldValue != 'undefined'){
            self[fieldName].val(fieldValue);
        }else{
            out = self[fieldName].val();
        }

        return out;
    }

    this.getProductName = function(){
        return workFieldVal('productName');
    };
    
    this.getCommand = function(){
        return workFieldVal('command');
    };

    this.getServer = function(){
        return workFieldVal('server');
    };


    this.getDescription = function(){
        return workFieldVal('description');
    };

    this.workBuList = function(isChecked){
        var out = [];
        var needToCheck = false;
        var checkedValue = false;
        if(typeof isChecked != 'undefined'){
            checkedValue = isChecked;
        }
        $('input[id^=bu_]').each(function(){
            var $self = $(this);
            if(!needToCheck){
                if(isCheckboxChecked($self)){
                    out.push($self.attr('value'));
                }
            }else{
                if(needToCheck && checkedValue){
                    $self.attr('checked', 'checked');
                }
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
        self.pojso.buList = self.workBuList();
        console.log(self.pojso);
        return self.pojso;
    };

    this.highlightErrors = function(){
        self.description.parent().parent().addClass('error');
    };

    this.clean = function(){
        workFieldVal('productName', '');
        workFieldVal('command', '');
        workFieldVal('server', '');
        workFieldVal('description', '');
        self.workBuList(false);
        self.separator = initJqueryWrapper(self.separator, self.fieldIdList.separator);
        self.separator.removeAttr('checked');
    };
};
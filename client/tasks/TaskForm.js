/**
 * User: Maskime
 * Date: 11/04/13
 * Time: 08:35
 */

TaskForm = function (p_deploy) {
    var self = this;
    this.pojso = {
        deployId: '',
        isSeparator: false,
        description: '',
        productName: '',
        command: '',
        server: '',
        buList: [],
        position: 1
    };

    this.fieldIdList = {
        separator: 'separator',
        description: 'description',
        productName: 'productName',
        command: 'command',
        server: 'server',
        position: 'position'
    };

    this.separator = null;
    this.description = null;
    this.productName = null;
    this.command = null;
    this.server = null;
    this.position = null;

    if (p_deploy != null) {
        self.pojso.deployId = p_deploy._id;
    }

    this.initializeFromForm = function () {
        self.description = initJqueryWrapper(self.description, self.fieldIdList.description);
        self.description.parent().parent().removeClass('error');
    };

    function initJqueryWrapper(container, selector) {
        if (container == null) {
            container = $('#' + selector);
            if(container.length == 0){
                container = null;
            }
        }
        return container;
    }

    this.isSeparator = function () {
        self.separator = initJqueryWrapper(self.separator, self.fieldIdList.separator);
        return isCheckboxChecked(self.separator);
    };

    this.isValid = function () {
        self.initializeFromForm();
        var currentDescription = self.getDescription();
        return (currentDescription != '');
    };

    function isCheckboxChecked(jQueryWrapper) {
        return ((typeof jQueryWrapper.attr('checked') != 'undefined') && (jQueryWrapper.attr('checked') == 'checked'))
    }

    function workFieldVal(fieldName, fieldValue) {
        var out = null;
        self[fieldName] = initJqueryWrapper(self[fieldName], self.fieldIdList[fieldName]);
        if(self[fieldName] != null){
            if (typeof fieldValue != 'undefined') {
                self[fieldName].val(fieldValue);
            } else {
                out = self[fieldName].val();
            }
        }

        return out;
    }

    this.getProductName = function () {
        return workFieldVal('productName');
    };

    this.getCommand = function () {
        return workFieldVal('command');
    };

    this.getServer = function () {
        return workFieldVal('server');
    };

    this.getPosition = function(){
        return workFieldVal('position');
    };


    this.getDescription = function () {
        return workFieldVal('description');
    };

    this.retrieveCheckedBuList = function () {
        var out = [];
        $('input[id^=bu_]').each(function () {
            var $self = $(this);
            if (isCheckboxChecked($self)) {
                out.push($self.attr('value'));
            }
        });

        return out;
    };

    this.checkBuListCheckbox = function(checkTheBoxes, buList){
        var selector = 'input[id^=bu_]';
        if(typeof buList != 'undefined'){
            //This is to be sure that only the bu given in the list are the one checked
            this.checkBuListCheckbox(false);
            var selectorList = [];
            _.each(buList, function(element){
                selectorList.push('#bu_' + element.toUpperCase());
            });
            selector = selectorList.join(',');
        }
        $(selector).each(function () {
            var $self = $(this);
            if(checkTheBoxes){
                $self.attr('checked', true);
            }else{
                if(typeof $self.attr('checked') != 'undefined'){
                    $self.attr('checked', false);
                }
            }
       });
    };

    this.getObject = function () {
        self.pojso.isSeparator = self.isSeparator();
        self.pojso.productName = self.getProductName();
        self.pojso.command = self.getCommand();
        self.pojso.description = self.getDescription();
        self.pojso.server = self.getServer();
        self.pojso.buList = self.retrieveCheckedBuList();

        return self.pojso;
    };

    this.highlightErrors = function () {
        self.description.parent().parent().addClass('error');
    };

    this.clean = function () {
        workFieldVal('productName', '');
        workFieldVal('command', '');
        workFieldVal('server', '');
        workFieldVal('description', '');
        workFieldVal('position', '');
        self.checkBuListCheckbox(false);
        self.separator = initJqueryWrapper(self.separator, self.fieldIdList.separator);
        self.separator.removeAttr('checked');
    };

    this.initFormWithTask = function (taskDocument) {
        workFieldVal('description', taskDocument.description);
        workFieldVal('position', taskDocument.position);
        self.separator = initJqueryWrapper(self.separator, self.fieldIdList.separator);
        if(taskDocument.isSeparator){
            self.separator.attr('checked', true);
            this.toggleSeparatorMode();
        }else{
            self.separator.attr('checked', false);
            workFieldVal('productName', taskDocument.productName);
            workFieldVal('command', taskDocument.command);
            workFieldVal('server', taskDocument.server);
            self.checkBuListCheckbox(true, taskDocument.buList);
        }
    };
    this.toggleSeparatorMode = function(){
        self.separator = initJqueryWrapper(self.separator, self.fieldIdList.separator);
        var isChecked = ((typeof self.separator.attr('checked') != 'undefined') && (self.separator.attr('checked') == 'checked'));
        var selectorList = ['#productName', '[id^=bu_]', '#command', '#server'];
        _.forEach(selectorList, function (selector) {
            if (isChecked) {
                $(selector).attr('disabled', 'disabled');
            } else {
                $(selector).attr('disabled', null);
            }
        });
    };
};
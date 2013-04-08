/**
 * User: Maskime
 * Date: 08/04/13
 * Time: 08:04
 */
Handlebars.registerHelper('isInProgress', function () {
        return checkStatus('in_progress');
    }
);

Handlebars.registerHelper('isEdit', function () {
        return checkStatus('edit');
    }
);

Handlebars.registerHelper('isDone', function () {
        return checkStatus('done');
    }
);

Handlebars.registerHelper('canUpdate', function () {
        var out = checkStatus('edit');
        if (out) {
            out = (out && isPlayer());
            out = (out || isCurrentUserAdmin());
        }

        return out;
    }
);

Handlebars.registerHelper('isAdmin', function () {
        return isCurrentUserAdmin();
    }
);
import {DatabaseManagerFactory, DatabaseManager} from "./services/database-manager.service";
import {Range} from "./filter/range";
/**
 * Created by reyra on 1/26/2017.
 */

var app = require('./module').app;

require('./factory/utilities')(app);

require('./providers/lazy-loader.provider')(app);
require('./providers/route-state.provider')(app);
require('./providers/loki-storage.provider')(app);


/**
 * Created by ramor11 on 5/1/2016.
 *  ng-repeat="p in [] | range:3 track by $index"
 */
app.filter('range', Range);

//typescript factory
databaseManager.$inject = ['Loki', '$q'];
function databaseManager(Loki: any, $q: ng.IQService): DatabaseManagerFactory {
    return () => {
        return new DatabaseManager(Loki, $q);
    }
}


app.factory('DatabaseManager', databaseManager);


module.exports = app;

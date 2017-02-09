import IQService = angular.IQService;
import {DatabaseManagerFactory, DatabaseManager} from "./services/database-manager.service";
/**
 * Created by reyra on 1/26/2017.
 */

var app = require('./module').app;

require('./factory/utilities')(app);

require('./providers/lazy-loader.provider')(app);
require('./providers/route-state.provider')(app);
require('./providers/loki-storage.provider')(app);
require('./filter/range')(app);


//typescript factory
databaseManager.$inject = ['Loki', '$q'];
function databaseManager(Loki: any, $q: IQService): DatabaseManagerFactory {
    return () => {
        return new DatabaseManager(Loki, $q);
    }
}


app.factory('DatabaseManager', databaseManager);


module.exports = app;

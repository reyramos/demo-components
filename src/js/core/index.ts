import IQService = angular.IQService;
import {DatabaseManagerFactory, DatabaseManager} from "./services/database-manager.service";
/**
 * Created by reyra on 1/26/2017.
 */

var app = require('./module').app;


require('./providers/lazy-loader.provider')(app);
require('./providers/route-state.provider')(app);
require('./filter/range')(app);


//typescript factory
databaseManager.$inject = ['Loki', '$q'];
function databaseManager(Loki: any, $q: IQService): DatabaseManagerFactory {
    return () => {
        return new DatabaseManager(Loki, $q);
    }
}


module.exports = app;

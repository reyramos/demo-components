/**
 * Created by reyra on 2/24/2017.
 */
import * as angular from "angular";
// import {DatabaseManagerFactory, DatabaseManager} from "../../core/services/database-manager.service";

const CONTACTS = require('./contacts.json');

describe('component: exportContacts', () => {
    let $componentController;
    let dbManager;

    // load the service's module
    beforeEach(angular.mock.module(require('../module').name));
    beforeEach(angular.mock.module('app.core'));

    //tell $provide to use the mock not the original $rootScope
    angular.mock.module(function($provide): void {
        $provide.value('Loki', {});
        $provide.value('$q', {});
    });

    beforeEach(inject((_$componentController_, DatabaseManager): void => {
        $componentController = _$componentController_;
        dbManager = DatabaseManager;
    }));


    it('should expose a `contacts` object', function () {
        // Here we are passing actual bindings to the component
        let bindings = {contacts: CONTACTS};
        let ctrl = $componentController('exportContacts', {
            DatabaseManager: dbManager
        }, bindings);
        expect(ctrl.contacts.length).toBe(6);

    });
});

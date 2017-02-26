/**
 * Created by reyra on 2/24/2017.
 */
import * as angular from "angular";
// import {DatabaseManagerFactory, DatabaseManager} from "../../core/services/database-manager.service";

const CONTACTS = require('./contacts.json');

describe('component: exportContacts', () => {
    let $componentController;
    let dbManager;
    let scope = {},
        element = angular.element('<div></div>'); //provide element you want to test

    // load the service's module
    beforeEach(angular.mock.module(require('../../app.module.ts').name, ($provide) => {
        $provide.value('$location', {});
    }));
    beforeEach(angular.mock.module(require('../module.ts').name));


    beforeEach(inject((_$componentController_) => {
        $componentController = _$componentController_;
        let $injector = angular.injector(['app.core']);
        dbManager = $injector.get('DatabaseManager');
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

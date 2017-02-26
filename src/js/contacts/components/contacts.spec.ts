/**
 * Created by reyra on 2/24/2017.
 */
import * as angular from "angular";
import {DatabaseManagerFactory, DatabaseManager} from "../../core/services/database-manager.service";
const CONTACTS = require('./contacts.json');

let app = require('../module.ts');
require('../../core/providers/loki-storage.provider')(app);

describe('component: exportContacts', () => {
    let $componentController;
    let scope = {},
        element = angular.element('<div></div>'); //provide element you want to test

    beforeEach(()=>{
        let provide;
        angular.mock.module(app.name, ($provide) => {
            provide = $provide;
        });
        inject((_$componentController_, $injector, $q) => {
            $componentController = _$componentController_;
            let Loki = $injector.get('Loki');
            provide.value('DatabaseManager', () => {
                return new DatabaseManager(Loki, $q);
            });
        })
    });


    it('should expose a `contacts` object', function () {
        let bindings = {contacts: CONTACTS};
        let ctrl = $componentController('exportContacts', null, bindings);
        expect(ctrl.contacts.length).toBe(6);

    });
});

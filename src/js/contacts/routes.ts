/**
 * Created by redroger on 8/5/2015.
 */
'use strict';
import {DatabaseManagerFactory} from "../core/services/database-manager.service";
const CONTACTS: Array<any> = JSON.parse(require('!!raw!./components/contacts/contacts.json'));

export module ExternalContact {

    export let routes: Array<any> = [
        {
            name    : 'ContactsModule',
            parent  : "rootBundle.root",
            abstract: true,
            resolve : {
                /**
                 * LazyLoad application on needed route
                 */
                ModuleResolver: ['jsBundleResolver', function (jsBundleResolver) {
                    return jsBundleResolver(function (app, resolve) {
                        (require as any).ensure([], function () {
                            app.register(require('./module'));
                            resolve();
                        });
                    });
                }],
                DatabaseInit  : ['DatabaseManager', (DatabaseManager: DatabaseManagerFactory) => {
                    const contacts: Array<any> = CONTACTS;
                    let dbManager = DatabaseManager();
                    dbManager.Collection = 'contacts';
                    return new Promise((resolve) => {
                        let results = dbManager.get({}, true);
                        if(results.length){
                            resolve()
                        }else{
                            dbManager.put(contacts).then(resolve);
                        }
                    })

                }]
            }
        },
        {
            name     : 'externalContacts',
            url      : 'external-contacts/',
            parent   : 'ContactsModule',
            component: 'exportContacts',
            resolve:{
                contacts:['DatabaseManager', (DatabaseManager: DatabaseManagerFactory)=>{
                    let dbManager = DatabaseManager();
                    dbManager.Collection = 'contacts';
                    return new Promise((resolve) => {
                        let results = dbManager.get({}, true);
                        resolve(results)
                    })
                }]
            }
        }];

}

/**
 * Created by redroger on 8/5/2015.
 */
'use strict';


export module ExternalContact {

    export let routes: Array<any> = [
        {
            name: 'ContactsModule',
            parent: "rootBundle.root",
            abstract: true,
            resolve: {
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
                }]
            }
        },
        {
            name: 'externalContacts',
            url: 'external-contacts/',
            parent: 'ContactsModule',
            template: require('./index.html')
        }];

}

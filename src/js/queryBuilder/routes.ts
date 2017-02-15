/**
 * Created by redroger on 8/5/2015.
 */
'use strict';


export module QueryBuilder {

    export let routes: Array<any> = [
        {
            name: 'QueryBuilder',
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
            name: 'queryBuilder',
            url: 'query-builder/',
            parent: 'QueryBuilder',
            template: require('./index.sample.html')
        }];

}

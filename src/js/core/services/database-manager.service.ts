/**
 * Created by reyra on 9/30/2016.
 */

'use strict';
import * as angular from "angular";
import {EmitterService} from "./Emitter.service";
import IQService = angular.IQService;


export class DatabaseManager extends EmitterService {

    static $inject = ['Loki', '$q'];

    private ignore: Array<string> = ['requestType', 'token', 'last_updated', 'remember'];

    private collection: any;
    private event: string;

    constructor(protected Loki: any, protected $q: IQService) {
        super();
    }

    set Collection(name: string) {
        this.event = name;
        this.collection = this.Loki.getCollection(name);
    }

    _onLoadStart() {
        let self: any = this;
        return self.$q(function (resolve) {
            // self.loaderService.start({
            //     backdrop: false
            // });

            self.emit('onLoadStart');
            resolve();
        })
    }

    private _onLoadComplete() {
        super.emit('onLoadComplete');
        return true;
    }

    private updateCollection(data) {
        super.emit(this.event, data);
        return true;
    }


    destroy() {
        this.dispose();
    };

    onChange(callback) {
        super.listen(this.event, callback);
    };

    onLoadStart(callback) {
        super.listen('onLoadStart', callback);
    };

    onLoadComplete(callback) {
        super.listen('onLoadComplete', callback);
    };

    update(obj: any) {
        let self: any = this;

        Object.assign(obj, this.timeStamp(obj));
        return self.$q((resolve: any, reject: any) => {
            self._onLoadStart().then(function () {
                self.collection.update(obj);
                self.Loki.saveDatabase().then(function () {
                    return self.get().then((data: any) => {
                        self.updateCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete()
                    });
                }.bind(self));
            });
        });
    };

    put(obj: any) {

        let original_object = angular.copy(obj);

        obj.$indeed = Date.now();
        let self: any = this;

        return self.$q((resolve: any, reject: any) => {
            self._onLoadStart().then(function () {
                self.collection.insert(self.timeStamp(self.getParams(obj)));
                self.Loki.saveDatabase().then(function () {
                    return self.get().then((data: any) => {
                        self.updateCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete()
                    });
                }.bind(self));
                // self.get(original_object).then(function (data) {
                //     let result = Object.assign({}, data[0], self.timeStamp(data[0]));
                //     self.collection.update(result);
                // }, () => {
                //     self.collection.insert(self.timeStamp(self.getParams(obj)));
                // }).finally(()=>{
                //     self.Loki.saveDatabase().then(function () {
                //         return self.get().then((data: any) => {
                //             self.updateCollection(data);
                //             resolve(data);
                //         }, reject).finally(() => {
                //             self._onLoadComplete()
                //         });
                //     }.bind(self));
                // });
            });
        });
    };


    private _get(data) {
        return this.$q(function (resolve: any, reject: any) {
            data.length ? resolve(data) : reject([]);
        })
    }


    get(query: any, async?: boolean) {
        let self: any = this;
        let data: any = this.collection.find(this.getParams(query));

        return async ? data : self.$q((resolve: any, reject: any) => {
                self._onLoadStart().then(function () {
                    self._get(data).then(function (data) {
                        self.updateCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete()
                    });
                });
            })
    };

    remove(query: any) {
        let self: any = this;

        return this.$q(function (resolve: any, reject: any) {
            self._onLoadStart().then(function () {
                self.collection.remove(query);
                self.Loki.saveDatabase().then(function () {
                    return self.get().then((data: any) => {
                        self.updateCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete()
                    });
                });
            });
        });

    };


    private getParams(parms: any) {
        if (typeof parms === 'undefined')return {};

        let handler: any = {};
        let self: any = this;
        Object.keys(parms).forEach(function (key: any) {
            if (typeof key === 'string' && self.ignore.indexOf(key) === -1) {
                handler[key] = self.isNumeric(parms[key]);
            } else if (typeof key !== 'string') {
                handler[key] = self.getParams(parms[key])
            }
        });

        return handler;
    }

    private isNumeric(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n) ? Number(n) : n;
    }

    private timeStamp(obj: any) {
        obj.last_updated = Date.now();
        return Object.assign({}, obj);
    }

}
export type DatabaseManagerFactory = () => DatabaseManager;


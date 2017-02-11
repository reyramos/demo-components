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

    get Collection() {
        return this.collection;
    }

    _onLoadStart() {
        let self: any = this;
        return self.$q(function (resolve) {
            // Future use of loading bar
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

    private notifyCollection(data) {
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

        Object.assign(obj, obj);
        return self.$q((resolve: any, reject: any) => {
            self._onLoadStart().then(function () {
                self.collection.update(obj);
                self.Loki.saveDatabase().then(function () {
                    return self.get().then((data: any) => {
                        self.notifyCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete()
                    });
                }.bind(self));
            });
        });
    };

    put(obj: any) {
        let self: any = this;
        if (Array.isArray(obj)) {
            obj.forEach(function (o) {
                o.$indeed = Date.now();
            })
        } else {
            obj.$indeed = Date.now();
        }


        return self.$q((resolve: any, reject: any) => {
            self._onLoadStart().then(function () {
                self.collection.insert(obj);
                self.Loki.saveDatabase().then(function () {
                    return self.get().then((data: any) => {
                        self.notifyCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete()
                    });
                }.bind(self));
                // self.get(original_object).then(function (data) {
                //     let result = Object.assign({}, data[0], (data[0]));
                //     self.collection.update(result);
                // }, () => {
                //     self.collection.insert(((obj)));
                // }).finally(()=>{
                //     self.Loki.saveDatabase().then(function () {
                //         return self.get().then((data: any) => {
                //             self.notifyCollection(data);
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
        let data: any = this.collection.find(query);

        return async ? data : self.$q((resolve: any, reject: any) => {
                self._onLoadStart().then(function () {
                    self._get(data).then(function (data) {
                        self.notifyCollection(data);
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
                        self.notifyCollection(data);
                        resolve(data);
                    }, reject).finally(() => {
                        self._onLoadComplete()
                    });
                });
            });
        });

    };


    private isNumeric(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n) ? Number(n) : n;
    }


}
export type DatabaseManagerFactory = () => DatabaseManager;


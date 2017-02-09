import {DatabaseManagerFactory, DatabaseManager} from "../../../core/services/database-manager.service";
/**
 * Created by reyra on 2/8/2017.
 */


class ContactsCtrl implements ng.IComponentController {


    static $inject: Array<string> = ['$element', 'DatabaseManager'];

    public user: any = {};
    public contacts: Array<any>;

    private dbManager: DatabaseManager;


    constructor(private $element, private DatabaseManagerFactory: DatabaseManagerFactory) {
        this.dbManager = DatabaseManagerFactory();
        /**
         * Point to Database Name
         * @type {string}
         */
        this.dbManager.Collection = 'contacts';
    }

    AddContact() {
        let self: any = this;
        if (!Object.keys(this.user).length)return;
        this.dbManager.put(this.user).then((data) => {
            self.contacts = data;
        })
    }

    RemoveContact(indeed: number) {
        let self: any = this;
        let contact = this.contacts.find((o: any) => {
            return o.$indeed === indeed;
        });

        this.dbManager.remove(contact).then((data) => {
            self.contacts = data;
        }, (data) => {
            self.contacts = data;
        })
    }


}

require('./styles.less');


export class Contacts implements ng.IComponentOptions {

    public bindings: any;
    public template: any;
    public controller: any;


    constructor() {
        this.bindings = {
            contacts: '<'
        };

        this.template = require('./contacts.html');
        this.controller = ContactsCtrl;
    }

}

/**
 * Created by reyra on 2/8/2017.
 */

const CONTACTS: Array<any> = JSON.parse(require('!!raw!./contacts.json'));


class ContactsCtrl implements ng.IComponentController {


    static $inject: Array<string> = ['$element'];

    public contacts: Array<any> = CONTACTS;

    constructor(private $element) {
    }


    $onInit(){
        console.log(this)
    }

}

require('./styles.less');


export class Contacts implements ng.IComponentOptions {

    public template: any;
    public controller: any;


    constructor() {

        this.template = require('./contacts.html');
        this.controller = ContactsCtrl;
    }

}

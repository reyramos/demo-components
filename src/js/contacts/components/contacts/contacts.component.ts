/**
 * Created by reyra on 2/8/2017.
 */

const CONTACTS: Array<any> = JSON.parse(require('!!raw!./contacts.json'));


class ContactsCtrl implements ng.IComponentController {


    static $inject: Array<string> = ['$element', '$eqDialog'];

    public contacts: Array<any> = CONTACTS;

    constructor(private $element, private $eqDialog) {
    }


    $onInit() {
        console.log(this)
    }


    addContact(): void {
        let self: any = this;

        return new this.$eqDialog({
            template: `<eq-dialog class="dialog-box">
<add-contact-dialog $eq-dialog="::$ctrl.$eqDialog"></add-contact-dialog>
</eq-dialog><eq-backdrop></eq-backdrop>`,
            controller  : 'Contact$eqDialogCtrl',
            controllerAs: '$ctrl',
        }).show((data: any) => {
            // return self.dbManager[data.state](data.data).finally(self.$eqDialog.hide);
        }).clickOutsideToClose(true)
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

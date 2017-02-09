/**
 * Created by reyra on 1/28/2017.
 */


import * as angular from "angular";
// import {EmitterService} from "../../../core/service/Emitter.service";
// import {ENUMS} from "../../../core/constants/ENUMS.constant";
// import {DatabaseManager} from "../../../auth/services/database-manager.service";


declare let moment: any;


// class CollectionDialogCtrl extends EmitterService {
//
//
//     private starred: any;
//     private $eqDialog: any;
//     private eventType: string;
//     private collections: Array<any>;
//
//     public category: any = {};
//     public Disabled: boolean;
//     public title: string;
//     public AddCat: any = {};
//
//     constructor() {super();}
//
//     $onInit() {
//         let self: any = this;
//         this.category = Object.assign({}, {
//             id  : null,
//             name: ""
//         }, (Array.isArray(self.collections) ? {} : self.collections), {
//             eventType: self.eventType
//         });
//
//         this.Disabled = false;
//         this.title = this.switchCase().title;
//     }
//
//     private switchCase() {
//
//         let state: any = {};
//         let self: any = this;
//
//         switch (this.eventType) {
//             case ENUMS.CATEGORY.RENAME:
//                 state.title = "Rename Collection";
//                 state.state = "update";
//                 break;
//             case ENUMS.CATEGORY.DELETE:
//                 self.Disabled = true;
//                 state.title = "Are you sure you want to delete collections?";
//                 state.state = "remove";
//                 break;
//             case ENUMS.CATEGORY.ADD:
//             default:
//                 state.title = "Add Collection";
//                 state.state = "put";
//                 break;
//         }
//
//         return state;
//
//     }
//
//
//     Create(e) {
//
//         let form: any = this.AddCat.categoryName;
//         let self: any = this;
//
//         if (this.category.name === "") {
//             form.$setValidity('invalid', false);
//             form.$setDirty();
//         } else if (form.$valid) {
//             self.$eqDialog.hide({
//                 state: self.switchCase().state,
//                 data : self.category
//             });
//         }
//
//         form.$render();
//
//
//     };
//
//     Cancel() {
//         this.$eqDialog.cancel()
//     }
//
//
// }

export class AddContacts implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public template: string;

    constructor() {
        this.bindings = {
            $eqDialog : '<',
        };

        this.template = require('./add-contact.dialog.html');
        // this.controller = CollectionDialogCtrl;

    }
}


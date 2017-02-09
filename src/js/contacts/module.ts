/**
 * Created by reyra on 7/12/2016.
 */


"use strict";

import * as angular from "angular";
import {Contacts} from "./components/contacts/contacts.component";
import {AddContacts} from "./components/addContact/add-contact-dialog.component";

var app = angular.module("app.contactsDemo", []);


app.component('exportContacts', new Contacts());
// app.component('addContactDialog', new AddContacts());
//
//
// //TODO:CONVERT TO TYPESCRIPT
// require('./components/addContact/contact.$eqDialog.controller')(app);

module.exports = app;



/**
 * Created by reyra on 7/12/2016.
 */


"use strict";

import * as angular from "angular";
import {Contacts} from "./components/contacts/contacts.component";

var app = angular.module("app.contactsDemo", []);

app.component('exportContacts', new Contacts());
module.exports = app;



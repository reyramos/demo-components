import {Public} from "./public/public.routes";
import {ExternalContact} from "./contacts/routes";

/**
 * Created by ramor11 on 4/19/2016.
 */


export class RouteProvider {
    static $inject = ['routeStateProvider'];

    constructor(private states) {
        //public routes no authentication needed
        states.inject(Public.routes);
        states.inject(ExternalContact.routes);

    }
}

/**
 * Created by reyra on 2/24/2017.
 */
import * as angular from "angular";

describe('filter: Range', () => {
    let element;
    
    beforeEach(() => {
        angular.mock.module(require('../index.ts').name);
        inject((_$componentController_, $rootScope, $compile) => {
            let $scope = $rootScope.$new();
            element = $compile(angular.element('<ul><li ng-repeat="p in [] | range:3 track by $index">{{$index}}</li></ul>'))($scope);
            $scope.$apply();
            
        })
    });
    
    
    it('should have `3` object', function () {
        let list = element[0].querySelectorAll('li');
        expect(list.length).toBe(3);
    });
    
    
});

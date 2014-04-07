(function(){
	/*global angular*/

	'use strict';

	angular.module('myApp.directives',[]);
	angular.module('myApp.controllers', []);
	angular.module('myApp.services', []);

	angular.module('myApp', ['myApp.controllers', 'myApp.directives', 'myApp.services']);
	
})();
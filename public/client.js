(function(){
	/*global angular*/

	'use strict';

	angular.module('myApp.directives',[]);
	angular.module('myApp.controllers', []);

	angular.module('myApp', ['myApp.controllers', 'myApp.directives'])
	.config(function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'http://www.youtube.com/embed/**'
		]);
	});
})();
app.config(function($routeProvider,$locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider	
    .when('/profile', {
		templateUrl : 'templates/dashboards/profile.html',
	})
    .when('/profile_edit', {
		templateUrl : 'templates/dashboards/profile_edit.html',
	})
    .when('/comments', {
		templateUrl : 'templates/dashboards/comments.html',
	})
    .when('/offers', {
		templateUrl : 'templates/dashboards/offers.html',
	})
    .when('/promoted_offers', {
		templateUrl : 'templates/dashboards/promo.html',
	})
    .when('/ended', {
		templateUrl : 'templates/dashboards/ended.html',
	})
    .when('/premium', {
		templateUrl : 'templates/dashboards/premium.html',
	})
    .when('/academy', {
		templateUrl : 'templates/dashboards/academy.html',
	})
    .when('/pakiet', {
		templateUrl : 'templates/dashboards/pakiet.html',
	})
    .when('/points', {
		templateUrl : 'templates/dashboards/points.html',
	})
    .when('/history', {
		templateUrl : 'templates/dashboards/history.html',
	})
    .when('/contact', {
		templateUrl : 'templates/dashboards/contact.html',
	})
    .when('/edit', {
		templateUrl : 'templates/dashboards/agent_edit.html',
	})
	.otherwise({
		redirectTo : '/profile'
	});
});
app.config(function($routeProvider,$locationProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider	
  .when('/clients', {
		templateUrl : 'pages/client_list.html'
	})
	.when('/add_user', {
		templateUrl : 'pages/add_user.html'
	})
	.when('/list_user', {
		templateUrl : 'pages/list_user.html'
	})
	.when('/settings', {
		templateUrl : 'pages/settings.html'
	})
	.when('/profile', {
		templateUrl : 'pages/profile.html'
	})
	.when('/add_client', {
		templateUrl : 'pages/add_client.html'
	})
	.otherwise({
		redirectTo : '/clients'
	});
});
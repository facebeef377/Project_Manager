app.run(function($rootScope) {
    
    //Alerty
    $rootScope.showSuccessAlert = function(text)
    {
        swal({
            type: 'success',
            title: text,
            showConfirmButton: false,
            timer: 1500
        })
    }
            
    $rootScope.showErrorAlert = function(text)
    {
        swal({
            type: 'error',
            title: text,
            showConfirmButton: false,
            timer: 1500
        })
    }
    
    $rootScope.showLoading = function()
    {
        swal({
            title: 'Czekaj!',
            text: 'Trwa ładowanie.',
            type: 'info',
            showConfirmButton: false,
        })   
    }
    
    $rootScope.showInfoAlert = function(text)
    {
        swal({
            type: 'info',
            title: text,
            showConfirmButton: false,
            timer: 1500
        })
    }
    
    $rootScope.showInfoAlert2 = function(text,time)
    {
        swal({
            type: 'info',
            title: text,
            showConfirmButton: false,
            timer: time
        })
    }
    
    $rootScope.showLoadingText = function(text)
    {
        swal({
            title: 'Czekaj!',
            text: text,
            type: 'info',
            showConfirmButton: false,
        })         
    }
            
    $rootScope.closeLoading = function()
    {
        swal.close();    
    }

    
});

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
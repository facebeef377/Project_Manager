var app = angular.module('app', [
  'ngRoute',
  'ngCookies',
  'ngStorage',
  'simplePagination',
  'filters',
  'filters2',
  'filters3',
  'rzModule',
  'ngImgCrop'
]);

app
  .controller(
    'appController',
    function ($rootScope, $scope, $http, $cookies, $localStorage, Pagination, $timeout, $filter) {

      //Kontenery na dane
      $scope.model = {};
      $scope.offers = {};
      $scope.offerid = {};
      $scope.ActivityHistoryResults = [];
      $scope.pass = {
        second: ''
      };
      $scope.points = {
        id: "2"
      };

      $scope.current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

      //Funkcja inicjalizująca wszystkie dashboardy
      $scope.initStart = function (json) {
        $scope.baseUrl = json.base_url;
        $rootScope.baseUrl = json.base_url;
        /* $scope.token = json.token;
         $rootScope.token = json.token;

         if ($scope.token == null || $scope.token == undefined || $scope.token == '') {
             $scope.token = $cookies.get('token');
             $rootScope.token = $cookies.get('token');
         }*/
        $scope.token = $cookies.get('token');
        $rootScope.token = $cookies.get('token');

        $scope.checkLogin(); //Sprawdza czy uzytkownik ma uprawnienia
        $scope.initFav(); //Pobiera liste polubionych ogłoszeń
        $scope.GetCountryAndVoivodshipList(); //Pobiera dane do formularzy
        $scope.GetActivityHistory(); //Pobiera historię aktywności
      }

      //Paginacja
      $scope.pagination = Pagination.getNew(10);

      //Funkcje przydatne do obsługi
      $rootScope.isDefined = function (x) {
        return x != null && x != undefined;
      }

      $scope.checkValidity = function (val1, val2) {
        if (val1 == val2) {
          return 1;
        } else {
          return 0;
        }
      }

      /*///////////////////////////////////////////////////////////////////////
      Developer:
      */ ///////////////////////////////////////////////////////////////////////
      $scope.developer = {};
      $scope.developer_list = {};

      $scope.initVars_developer = function (json) {
        $scope.initStart(json);
        $rootScope.developerbutton = true;
        $scope.GetMyInvestmentList();
        $scope.GetDeveloperProfile();
      }

      $scope.GetMyInvestmentList = function () {

        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetMyInvestmentList", req)
          .then(
            function (result) {
              $scope.developer_list = result.data.data.list;
            });
      }

      $scope.GetDeveloperProfile = function () {
        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetDeveloperProfileWithToken", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.model = result.data.data;

                if ($scope.model.country == null || $scope.model.country == undefined || $scope.model.country == 'Nieokreślone' | $scope.model.country == '0') {
                  $scope.model.country = "161";
                }

                if ($scope.model.voivodship == null || $scope.model.voivodship == undefined || $scope.model.voivodship == 'Nieokreślone' | $scope.model.voivodship == '0') {
                  $scope.model.voivodship = "1";
                }

                $scope.model.country = $scope.model.country.toString();
                $scope.model.voivodship = $scope.model.voivodship.toString();
              }
            });
      }

      $scope.SaveUserData_Developer = function () {
        if ($scope.model.pass) {
          if (!($scope.checkValidity($scope.model.pass, $scope.pass.second))) {
            $rootScope.errorHandle("Hasła nie są identyczne!");
            return;
          }
        }

        $scope.model.country = parseInt($scope.model.country);
        $scope.model.voivodship = parseInt($scope.model.voivodship);

        delete $scope.model.url;
        delete $scope.model.image;

        if ($scope.model.ad) {
          delete $scope.model.ad;
        }

        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.model
        };

        $http
          .post($scope.baseUrl + "/SaveUserData", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
                $scope.GetDeveloperProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }


      /*///////////////////////////////////////////////////////////////////////
      Właściciel nieruchomości:
      */ ///////////////////////////////////////////////////////////////////////
      $scope.initVars_owner = function (json) {
        $scope.initStart(json);
        $scope.getOwnerData();
        $scope.GetOwnerOfferList();
      }

      $scope.getOwnerData = function () {
        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetOwnerData", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $scope.model = result.data.data;
              }
            });
      };

      $scope.GetOwnerOfferList = function () {
        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetOwnerOfferList", req)
          .then(
            function (result) {
              $scope.offers = result.data.data;
              $scope.initAgentMarkers();
            });
      }

      $scope.SaveUserData_Owner = function () {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.model
        };

        if ($scope.model.pass) {
          if (!($scope.checkValidity($scope.model.pass, $scope.pass.second))) {
            $rootScope.errorHandle("Hasła nie są identyczne!");
            return;
          }
        }

        delete $scope.model.url;

        $http
          .post($scope.baseUrl + "/SaveUserData", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
                $scope.getOwnerData();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      /*///////////////////////////////////////////////////////////////////////
      Agencja nieruchomości:
      */ ///////////////////////////////////////////////////////////////////////
      $scope.agent_list = {};
      $scope.settings_agency = {};

      $scope.initVars_agency = function (json) {
        $scope.initStart(json);
        $scope.GetPackagePriceList();
        $scope.GetAgencyProfile();
      }

      $scope.GetAgencyProfile = function () {
        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetAgencyProfileWithToken", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.model = result.data.data; //dane agencji

                if ($scope.model.country == null || $scope.model.country == undefined || $scope.model.country == 'Nieokreślone' | $scope.model.country == '0') {
                  $scope.model.country = "161";
                }

                if ($scope.model.voivodship == null || $scope.model.voivodship == undefined || $scope.model.voivodship == 'Nieokreślone' | $scope.model.voivodship == '0') {
                  $scope.model.voivodship = "1";
                }

                $scope.model.country = $scope.model.country.toString();
                $scope.model.voivodship = $scope.model.voivodship.toString();

                if ($scope.model.export_valid != null && $scope.model.export_valid != undefined) {
                  var str = $scope.model.export_valid;
                  var res = str.split(" ");
                  $scope.model.export_valid = res[0];
                }


                $scope.GetAgencyAgentList();
              }
            });
      }

      $scope.GetAgencyAgentList = function () {
        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetAgencyAgentList", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.agent_list = result.data.data.list;
              }
            });
      }

      $scope.InviteWorker = function () {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            email: $scope.settings_agency.invite_email
          }
        };

        $http
          .post($scope.baseUrl + "/InviteWorker", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Dodano!");
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }

            });
      }

      $scope.BuyExports = function () {
        $scope.settings_agency.exports = parseInt($scope.settings_agency.exports);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            exports: $scope.exportsIN.exports,
            period: $scope.exportsIN.period
          }
        };

        $http
          .post($scope.baseUrl + "/BuyExports", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Zakupiono!");
                $scope.GetAgencyProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      $scope.SendPointsToAgent = function () {
        $scope.settings_agency.workerid = parseInt($scope.settings_agency.workerid);
        $scope.settings_agency.points = parseInt($scope.settings_agency.points);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            worker: $scope.settings_agency.workerid,
            points: $scope.settings_agency.points
          }
        };

        $http
          .post($scope.baseUrl + "/SendPointsToAgent", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Wysłano!");
                $scope.GetAgencyAgentList();
                $scope.GetAgencyProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
              $scope.settings_agency.workerid = $scope.settings_agency.workerid.toString();
              $scope.settings_agency.points = $scope.settings_agency.points.toString();
            });
      }

      $scope.SendVirtualPointsToAgent = function () {
        $scope.settings_agency.workerid = parseInt($scope.settings_agency.workerid);
        $scope.settings_agency.points_promo = parseInt($scope.settings_agency.points_promo);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            worker: $scope.settings_agency.workerid,
            points: $scope.settings_agency.points_promo
          }
        };

        $http
          .post($scope.baseUrl + "/SendVirtualPointsToAgent", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Wysłano!");
                $scope.GetAgencyAgentList();
                $scope.GetAgencyProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
              $scope.settings_agency.workerid = $scope.settings_agency.workerid.toString();
              $scope.settings_agency.points_promo = $scope.settings_agency.points_promo.toString();
            });
      }

      $scope.updateprice = function () {
        for (var i = 0; i < $scope.settings.package.length; i++) {
          if ($scope.settings_agency.id == $scope.settings.package[i].id)
            $scope.settings_agency.price = $scope.settings.package[i].price;
        }
      }

      $scope.SetAgencyAgentPackage = function () {
        $scope.settings_agency.workerid = parseInt($scope.settings_agency.workerid);
        $scope.settings_agency.id = parseInt($scope.settings_agency.id);
        $scope.settings_agency.price = parseInt($scope.settings_agency.price);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            worker: $scope.settings_agency.workerid,
            package_id: $scope.settings_agency.id,
            package_price: $scope.settings_agency.price
          }
        };

        $http
          .post($scope.baseUrl + "/SetAgencyAgentPackage ", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Zmieniono!");
                $scope.GetAgencyAgentList();
                $scope.GetAgencyProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      $scope.RemoveWorkerFromAgency = function () {
        $scope.settings_agency.delworkerid = parseInt($scope.settings_agency.delworkerid);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            worker: $scope.settings_agency.delworkerid,
          }
        };

        swal({
          title: 'Czy jesteś pewien?',
          text: "Tej operacji nie można cofnąć!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Tak, kasuje!'
        }).then((result) => {
          if (result.value) {
            swal({
              title: 'Czy jesteś pewien?',
              text: "Ta operacja wymaga podwójnego potwierdzenia!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Tak, jestem pewien!'
            }).then((result) => {
              if (result.value) {
                $http
                  .post($scope.baseUrl + "/RemoveWorkerFromAgency", req)
                  .then(
                    function (result) {
                      if (result.data.metadata.status == "OK") {
                        $rootScope.showSuccessAlert("Usinięto!");
                        $scope.GetAgencyAgentList();
                      } else {
                        $rootScope.errorHandle(result.data.metadata.status);
                      }
                    });
              }
            })
          }
        })
      }


      $scope.SaveUserData_Agency = function () {

        if ($scope.model.pass) {
          if (!($scope.checkValidity($scope.model.pass, $scope.pass.second))) {
            $rootScope.errorHandle("Hasła nie są identyczne!");
            return;
          }
        }
        $scope.model.country = parseInt($scope.model.country);
        $scope.model.voivodship = parseInt($scope.model.voivodship);

        if ($scope.model.agent_list) {
          delete $scope.model.agent_list;
        }

        if ($scope.model.picture) {
          delete $scope.model.picture;
        }

        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.model
        };

        $http
          .post($scope.baseUrl + "/SaveUserData", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
                $scope.GetAgencyProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      /*///////////////////////////////////////////////////////////////////////
      Agent:
      */ ///////////////////////////////////////////////////////////////////////

      $scope.agent_comment = {};
      $scope.rating = {};
      $scope.avg_rating = 0;
      $scope.street_promotion = {};
      $scope.agent_data = {
        pakiet: {},
      };

      $scope.initVars_agent = function (json) {
        $scope.initStart(json);
        $scope.GetAgentProfile();
        $scope.GetPackagePriceList();
        $scope.GetAgentOfferList();
      }

      $scope.GetAgentOfferList = function () {
        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetAgentOfferList", req)
          .then(
            function (result) {});
      }

      $scope.GetAgentProfile = function () {
        
        $scope.agentMapInit();
        
        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetAgentProfileWithToken", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                console.log(result.data.data);
                $scope.model = result.data.data;
                $scope.rating = result.data.data.rating;
                $scope.street_promotion = result.data.data.street_promotion;
                delete $scope.model.street_promotion;
                delete $scope.model.rating;
                $scope.GetOwnerOfferList();
                for (var i = 0; i < $scope.rating.length; i++) {
                  $scope.avg_rating = $scope.avg_rating + $scope.rating[i].rate;
                }
                $scope.avg_rating = $scope.avg_rating / $scope.rating.length;
                $scope.model.language = $scope.model.language.toString();
              }
            });
      }
      
      var element;

      var popup;
      
      $scope.createContent = function(x) {
        if ($scope.offers.active[x].price != 0) {

          var price = $scope.offers.active[x].price.toString();

          return '<div id="wall_marker"> <div class="brick"> <img style="max-width: 200px;" src="' + $scope.offers.active[x].url + '"/> <div class="info"> <h4>' + $filter('numberFilter')(price) + '</h4> <p class="long">' + $scope.offers.active[x].area + ' m<sup>2</sup> | p.' + $scope.offers.active[x].city + '</p> </div> </div> </div>';
        }
      }
      
      $scope.initAgentMarkers = function() {
        element = document.getElementById('popup');
        
        popup = new ol.Overlay({
              element: element,
              positioning: 'center-bottom',
              stopEvent: false
            });
        
        map.addOverlay(popup);
        
        console.log($scope.offers.active);
        
        for (var i = 0; i < $scope.offers.active.length; i++) {
            let lngLat = [$scope.offers.active[i].longitude, $scope.offers.active[i].latitude];
            if ($scope.offers.active[i].deal == "sprzedaż") {
              var urlIcon = "../img/marker_blue.png";
            } else {
              var urlIcon = "../img/marker_green.png";
            }

            var urlIcon2 = "../img/marker_orange.png";

            var iconFeature = new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.transform(lngLat, 'EPSG:4326',
                'EPSG:3857')),
              name: 'Null'
            });

            var iconStyle = new ol.style.Style({
              image: new ol.style.Icon({
                size: [14, 14],
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 1.0,
                src: urlIcon
              }),
            	zIndex: 3
            });

            var iconStyle_active = new ol.style.Style({
              image: new ol.style.Icon({
                size: [14, 14],
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                opacity: 1.0,
                src: urlIcon2
              }),
            	zIndex: 4
            });

            iconFeature.setStyle(iconStyle);
            iconFeature.setId(i);
            iconFeature.set("ad",$scope.offers.active[i].id);
            iconFeature.set("name","Marker");
            //iconFeature.setGeometryName("Marker");
            $scope.vectorSource.addFeature(iconFeature);
          }

          var feature_tmp = null;
          $(map.getViewport()).on('mousemove', function(e) {
            var pixel = map.getEventPixel(e.originalEvent);
            if (!$scope.drawing) {
              var feature = map.forEachFeatureAtPixel(pixel,
                function(feature, layer) {
                  return feature;
                });
              if (feature == feature_tmp) 
              {
                  return
              }
              if (feature){
              	if (feature.get("name") == "Marker") {
              		var id = feature.id_;
              		feature_tmp = feature;
              		feature_tmp.setStyle(iconStyle_active);
              		$('html,body').css('cursor', 'pointer');
              		var geometry = feature.getGeometry();
              		var coord = geometry.getCoordinates();
              		popup.setPosition(coord);
              		$(element).popover({
              			'placement': 'top',
              	    'animation': false,
              			'html': true,
              			'content': $scope.createContent(id),
              		});
              		$(element).popover('show');
              		
              	} else {
              		if (feature_tmp != null) {
              			feature_tmp.setStyle(iconStyle);
              			feature= feature_tmp;
              			feature_tmp = null;
              			$(element).popover('dispose');
              			$('html,body').css('cursor', 'default');
              		}
              	}
              }
            }
          });
          
          $(map.getViewport()).on('click', function(e) {
            var pixel = map.getEventPixel(e.originalEvent);
            if (!$scope.drawing) {
              var feature = map.forEachFeatureAtPixel(pixel,
                function(feature, layer) {
                  return feature;
                });
              if (feature) {
                if (feature.get("name") == "Marker") {
                  var id = feature.id_;
                  $rootScope.gotoOffer($scope.offers.active[id].pl_url);
                }
              }
            }
          });


          var vectorLayer = new ol.layer.Vector({
            source: $scope.vectorSource,
            zIndex: 3,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(0, 254, 163, 0.2)'
              }),
              stroke: new ol.style.Stroke({
                color: '#00fea3',
                width: 1
              })
            })
          });

          map.addLayer(vectorLayer);
          var extent = vectorLayer.getSource().getExtent();
          map.getView().fit(extent, map.getSize());
          vectorLayer.set('name', 'vectorLayer');
      }

      $scope.SaveAgentData = function () {
        if ($scope.model.pass) {
          if (!($scope.checkValidity($scope.model.pass, $scope.pass.second))) {
            $rootScope.errorHandle("Hasła nie są identyczne!");
            return;
          }
        }

        delete $scope.model.picture;
        delete $scope.model.premium;

        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.model
        };

        $http
          .post($scope.baseUrl + "/SaveAgentData", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
                $scope.GetAgentProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      $scope.area = {};

      $scope.AddArea = function () {
        var tmp = {
          description: $scope.area.data
        }
        if ($scope.model.user_area == undefined) {
          $scope.model.user_area = [];
          $scope.model.user_area.push(tmp);
        } else {
          $scope.model.user_area.push(tmp);
        }
        $scope.area.data = '';
      }

      $scope.DelArea = function (x) {

        if (x.id != null && x.id != undefined) {
          var req = {
            metadata: {
              token: $scope.token
            },
            data: {
              id: x.id
            }
          };

          $http
            .post($scope.baseUrl + "/RemoveAgentArea", req)
            .then(function (result) {
              console.log(result.data);
            });
        }

        var index = $scope.model.user_area.indexOf(x);
        $scope.model.user_area.splice(index, 1);

      }

      //ZAKUP PUNKTÓW
      $scope.pointsIN = {};
      $scope.pointsOUT = {
        netto: 0,
        vat: 0,
        brutto: 0
      };
      $scope.exportsIN = {};
      $scope.exportsOUT = {
        netto: 0,
        vat: 0,
        brutto: 0
      };

      $scope.GetPaymentData = function () {

        $scope.pointsIN.points = parseInt($scope.pointsIN.points);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.pointsIN
        };

        $http
          .post($scope.baseUrl + "/GetPaymentData", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.pointsOUT = result.data.data;
                $scope.pointsOUT.vat = result.data.data.netto * 0.23;
              }
            });

        $scope.pointsIN.points = $scope.pointsIN.points.toString();
      }

      $scope.GetExportPaymentData = function () {

        if ($scope.exportsIN.exports2 != 'more') {
          $scope.exportsIN.exports = $scope.exportsIN.exports2;
        }

        $scope.exportsIN.exports = parseInt($scope.exportsIN.exports);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.exportsIN
        };

        $http
          .post($scope.baseUrl + "/GetExportPaymentData", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.exportsOUT = result.data.data;
                $scope.exportsOUT.vat = result.data.data.netto * 0.23;
              }
            });
        $scope.exportsIN.exports = $scope.exportsIN.exports.toString();
      }

      //Ustaw pakiet
      $scope.GetPackagePriceList = function () {
        $http
          .post($scope.baseUrl + "/GetPackagePriceList")
          .then(
            function (result) {
              $scope.settings.package = result.data.data.list;
            });
      }

      $scope.agent_pakiet_tmp = {};
      $scope.setPackage = function (x) {
        for (var i = 0; i < $scope.settings.package.length; i++) {
          var tmp = $scope.settings.package[i];
          if(tmp.id == $scope.agent_pakiet_tmp.id){
            $scope.agent_data.pakiet = tmp;
          }
        }
      }

      $scope.SetUserPackage = function () {
        $scope.agent_data.pakiet.price = parseInt($scope.agent_data.pakiet.price);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: $scope.agent_data.pakiet.id
          }
        };

        $http
          .post($scope.baseUrl + "/SetUserPackage", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
                $scope.GetAgentProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });

        $scope.agent_data.pakiet.price = $scope.agent_data.pakiet.price.toString();
      }

      //Agent Premium
      $scope.promotion_data = {
        price: 0,
        code: ""
      };
      $scope.promotion_list = [];
      $scope.checked_street = [];
      $scope.checks = [];

      $scope.AddStreetToPromotion = function () {
        if ($scope.promotion_data.city == "" || $scope.promotion_data.street == "" || $scope.promotion_data.city == undefined || $scope.promotion_data.street == undefined) {
          $rootScope.showInfoAlert("Wpisz miasto i poprawną nazwę ulicy");
        } else {
        	$scope.address = $scope.promotion_data.city + " " + $scope.promotion_data.street;
        	$scope.getAddress();
        }
      }
      
      $scope.getAddress = function() {
        console.log($scope.address)
        var req = {
         method: 'POST',
         url: 'https://places-dsn.algolia.net/1/places/query',
         headers: {
           'X-Algolia-Application-Id': "plLQI18BI714",
           'X-Algolia-API-Key': "9c2d0eabb42b231e40d128c222ff4c49"
         },
         data: { 
           query: $scope.address,
           countries: "pl",
           language: "pl_PL",
           type: ['city', 'address']
         }
        }

        $http(req).then(function(result){
        	if (result.data.hits[0].is_city == true) {
        		$rootScope.showInfoAlert("Wpisz miasto i poprawną nazwę ulicy");
        	} else {
        		$scope.cit = result.data.hits[0].city[0];
            console.log($scope.cit)
        		$scope.str = result.data.hits[0].locale_names[0];
            console.log($scope.str)
            $scope.getStreetPrice();
					}
        });
      }
      
      $scope.getStreetPrice = function() {
	      var req = {
	          metadata: {
	            token: $scope.token
	          },
	          data: {
	            street: $scope.str,
	            city: $scope.cit
	          }
	        };
	        $http
	          .post($scope.baseUrl + "/GetStreetPrice", req)
	          .then(
	            function (result) {
	              if (result.data.metadata.status == "OK") {
	                var tmp = {
	                  price: result.data.data.price,
	                  city: $scope.cit,
	                  street: $scope.str
	                }
	                $scope.promotion_list.push(tmp);
	              } else {
	                rootScope.errorHandle(result.data.metadata.status);
	              }
	            });
      }

      $scope.toggleStreet = function (x) {
        $scope.addStreet(x);
        $scope.promotion_data.price = 0;
        for (var i = 0; i < $scope.checked_street.length; i++) {
          $scope.promotion_data.price = $scope.promotion_data.price + $scope.checked_street[i].price;
        }
      }
      $scope.addStreet = function (x) {
        for (var i = 0; i < $scope.checked_street.length; i++) {
          if ($scope.checked_street[i].street == x.street) {
            $scope.checked_street.splice(i, 1);

            return;
          }
        }
        $scope.checked_street.push(x);
      }

      $scope.PayForStreetPromotion = function () {
        $scope.promotion_data.time = parseInt($scope.promotion_data.time);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            period: $scope.promotion_data.time,
            list: $scope.checked_street,
            code: $scope.promotion_data.code
          }
        };

        $http
          .post($scope.baseUrl + "/PayForStreetPromotion", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
                $scope.GetAgentProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });

        $scope.promotion_data.time = $scope.promotion_data.time.toString();
      }

      $scope.GetStreetPromotionPrice = function () {
        $scope.promotion_data.time = parseInt($scope.promotion_data.time);

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            period: $scope.promotion_data.time,
            list: $scope.checked_street,
            code: $scope.promotion_data.code
          }
        };

        $http
          .post($scope.baseUrl + "/GetStreetPromotionPrice", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $scope.promotion_data.bill = result.data.data.bill;
              }
            });

        $scope.promotion_data.time = $scope.promotion_data.time.toString();
      }

      $scope.runPromo = function (x) {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            period: 30,
            list: [x],
          }
        };

        $http
          .post($scope.baseUrl + "/PayForStreetPromotion", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
                $scope.GetAgentProfile();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      /*///////////////////////////////////////////////////////////////////////
      SUPER-ADMIN:
      */ ///////////////////////////////////////////////////////////////////////

      $scope.initVars_superadmin = function (json) {
        $scope.baseUrl = json.base_url;
        $rootScope.baseUrl = json.base_url;
        $scope.token = json.token;
        $rootScope.token = json.token;

        if ($scope.token == null || $scope.token == undefined || $scope.token == '') {
          $scope.token = $cookies.get('token');
          $rootScope.token = $cookies.get('token');
        }
        $scope.model.name = "Superadmin";

        $scope.checkLogin();
        $scope.GetList('SuperadminGetAdList', 'id', 'asc');
      }

      //Tworzenie kodów
      $scope.code = {};
      $scope.codes = {};
      $scope.CreateCode = function () {

        if ($scope.code.type) {
          $scope.code.type = 'promotion';
        } else {
          $scope.code.type = 'gratis';
        }

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            type: $scope.code.type,
            value: $scope.code.value,
            quantity: $scope.code.quantity
          }
        };

        $http
          .post($scope.baseUrl + "/CreateCode", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.codes = result.data.data.list;
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }

              if ($scope.code.type == 'promotion') {
                $scope.code.type = true;
              } else {
                $scope.code.type = false;
              }

            });
      }
      //Oferty
      $scope.offer_data = {
        order_type: 'ASC',
      };

      $scope.NextAdminPage = function () {
        if ($scope.offer_data.start_page == null || $scope.offer_data.start_page == undefined) {
          $scope.offer_data.start_page = 1;
        } else {
          $scope.offer_data.start_page = $scope.offer_data.start_page + 1;
        }
        $scope.GetList($scope.tmp2.x, $scope.tmp2.y, 'tmp');
      }

      $scope.PrevAdminPage = function () {
        if ($scope.offer_data.start_page == null || $scope.offer_data.start_page == undefined) {
          $scope.offer_data.start_page = 0;
        } else if ($scope.offer_data.start_page != 0) {
          $scope.offer_data.start_page = $scope.offer_data.start_page - 1;
        }
        $scope.GetList($scope.tmp2.x, $scope.tmp2.y, 'tmp');
      }

      $scope.tmp2 = {}

      $scope.GetList = function (x, y, z) {

        $scope.offer_data.order_by = y;

        if (z == 'tmp') {
          //Nothing
        } else {
          if ($scope.offer_data.order_type == 'ASC') {
            $scope.offer_data.order_type = 'DESC';
          } else {
            $scope.offer_data.order_type = 'ASC';
          }
        }


        if (z == 'asc') {
          $scope.offer_data = {};
          $scope.offer_data.order_type = 'ASC';
        } else if (z == 'asc2') {
          $scope.offer_data.order_type = 'ASC';
        } else if (z == 'tmp') {}

        $scope.tmp2.x = x;
        $scope.tmp2.y = y;

        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.offer_data
        };

        $http
          .post($scope.baseUrl + "/" + x, req)
          .then(
            function (result) {
              $scope.offers = result.data.data.list;
            });
      }

      $scope.SuperadminReactivateAd = function (x) {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: x
          }
        };

        $http
          .post($scope.baseUrl + "/SuperadminReactivateAd", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Aktywowano!");
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }

            });
      }

      $scope.SuperadminRemoveUser = function (x) {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: x
          }
        };

        $http
          .post($scope.baseUrl + "/SuperadminRemoveUser", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Usunięto!");
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      $scope.aggr = {};

      $scope.Aggregate = function (x) {
        $scope.aggr = x;
        document.location = $rootScope.baseUrl + "/app?panel=superadmin#/merge";
      }

      $scope.AddAggregatedOffer = function (x) {

        if ($scope.aggr.id == undefined || $scope.aggr.id == null) {
          $scope.aggr = x;
          return;
        }

        var tmp = x.id.toString();

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            filter: $scope.aggr.id,
            other_ad: tmp
          }
        };

        $http
          .post($scope.baseUrl + "/AddAggregatedOffer", req)
          .then(
            function (result) {
              $rootScope.showSuccessAlert("Dodano!");
            });
      }

      $scope.RemoveAggregatedOffer = function (x) {

        if ($scope.aggr.id == undefined || $scope.aggr.id == null) {
          $scope.aggr = x;
          return;
        }

        var tmp = x.id.toString();

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            filter: $scope.aggr.id,
            other_ad: tmp
          }
        };

        $http
          .post($scope.baseUrl + "/AddAggregatedOffer", req)
          .then(
            function (result) {});
      }

      $scope.GetAggregatedOffers = function () {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            filter: $scope.aggr_set.id
          }
        };

        $http
          .post($scope.baseUrl + "/GetAggregatedOffers", req)
          .then(
            function (result) {
              $scope.superadmin_aggregated = result.data.data.list;
            });
      }

      $scope.GetOffersFromSameStreet = function () {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            filter: $scope.aggr_set.id
          }
        };

        $http
          .post($scope.baseUrl + "/GetOffersFromSameStreet", req)
          .then(
            function (result) {
              $scope.superadmin_aggregated_similar = result.data.data.list;
            });
      }

      //////////////////////////////////////////////////////////////////////////////////////
      /*

          Wspólne elementy dashboardów

      */
      //////////////////////////////////////////////////////////////////////////////////////

      $scope.tmp = {};

      $scope.gotoBack = function () {

        var tmp = $cookies.get('next');

        if (tmp == 'agent') {
          document.location = $rootScope.baseUrl + "/app?panel=agent";
        }
        if (tmp == 'developer') {
          document.location = $rootScope.baseUrl + "/app?panel=developer";
        }
        if (tmp == 'agency') {
          document.location = $rootScope.baseUrl + "/app?panel=agency";
        }
        if (tmp == 'owner') {
          document.location = $rootScope.baseUrl + "/app?panel=owner";
        }
      }

      $scope.gotoPoints = function () {

        var tmp = $cookies.get('next');

        if (tmp == 'agent') {
          document.location = $rootScope.baseUrl + "/app?panel=agent#/points";
        }
        if (tmp == 'developer') {
          document.location = $rootScope.baseUrl + "/app?panel=developer#/points";
        }
        if (tmp == 'agency') {
          document.location = $rootScope.baseUrl + "/app?panel=agency#/points";
        }
        if (tmp == 'owner') {
          document.location = $rootScope.baseUrl + "/app?panel=owner#/points";
        }
      }

      $scope.editActive = false;

      //Przejscie do edycji
      $scope.gotoEdit = function (x) {
        $localStorage.offerid = x;

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: $localStorage.offerid
          }
        };

        $http
          .post($scope.baseUrl + "/GetOffer", req)
          .then(
            function (result) {
              $scope.tmp = result.data;
              $scope.gotoCustomPage();
            });
      }

      $scope.gotoCustomPage = function () {

        if ($scope.tmp.deal == 3) {

          if ($scope.tmp.property == 2) { //Mieszkania
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_appartment_rent";
          }
          if ($scope.tmp.property == 6) { //Domy
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_house_rent";
          }
          if ($scope.tmp.property == 9) { //Działki
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_parcel_rent";
          }
          if ($scope.tmp.property == 5) { //Biura
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_office_rent";
          }
          if ($scope.tmp.property == 4) { //Lokale użytkowe
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_service_rent";
          }
          if ($scope.tmp.property == 3) { //Hale i magazyny
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_hall_rent";
          }
          if ($scope.tmp.property == 7) { //Inne
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_other_rent";
          }
          if ($scope.tmp.property == 10) { //Pokoje
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_room_rent";
          }
          if ($scope.tmp.property == 8) { //Garaze
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_garage_rent";
          }
        } else {
          if ($scope.tmp.property == 2) { //Mieszkania
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_appartment_sale";
          }
          if ($scope.tmp.property == 6) { //Domy
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_house_sale";
          }
          if ($scope.tmp.property == 9) { //Działki
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_parcel_sale";
          }
          if ($scope.tmp.property == 5) { //Biura
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_office_sale";
          }
          if ($scope.tmp.property == 4) { //Lokale użytkowe
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_service_sale";
          }
          if ($scope.tmp.property == 3) { //Hale i magazyny
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_hall_sale";
          }
          if ($scope.tmp.property == 7) { //Inne
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_other_sale";
          }
          if ($scope.tmp.property == 8) { //Garaze
            document.location = $rootScope.baseUrl + "/app?panel=edit#/add_garage_sale";
          }
        }
      }

      //Logowanie
      $scope.checkLogin = function () {
        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetAccessTokenType ", req)
          .then(
            function (result) {
              console.log("GetAccessTokenType" + JSON.stringify(result.data));
              if (result.data.metadata.status == "NO_SUCH_USER") {
                document.location = $rootScope.baseUrl + "/app?panel=home";
              }
              if (result.data.metadata.status == "OK") {
                $scope.logindata = result.data;
                $http
                  .post($scope.baseUrl + "/GetUserContactData", req)
                  .then(
                    function (result) {
                      $rootScope.contact.name = result.data.data.name;
                      $rootScope.contact.surname = result.data.data.surname;
                      $rootScope.contact.email = result.data.data.email;
                      $rootScope.contact.phone = result.data.data.phone;
                      $rootScope.contact.contact_file = [];
                    });
              }
            });
      }

      $scope.logout = function () {
        $scope.token = 'zero';
        $cookies.remove("token");
        $cookies.remove("next");
        $cookies.put("token", "zero"); 
        $cookies.put("token", "zero"); 
        $scope.contact = {};
        document.location = $scope.baseUrl;
      }

      $scope.gotoEdit_invest = function (x) {

        $scope.editActive = true;

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            ad: x
          }

        };

        $http
          .post($scope.baseUrl + "/GetInvestmentWithAdId", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.invest = result.data.data.investment;

                //Zamiana string na int
                $scope.invest.storage_room = parseInt($scope.invest.storage_room);
                $scope.invest.parking_space = parseInt($scope.invest.parking_space);
                $scope.invest.construction_end = new Date($scope.invest.construction_end);
                //Zamiana int na string
                $scope.invest.country = "161"; //TODO
                $scope.invest.voivodship = $scope.invest.voivodship.toString();
                $scope.invest.office_voivodship = $scope.invest.office_voivodship.toString();
                //Koniec zamiany

                $scope.invest.multimedia = result.data.data.multimedia;
                $scope.ads = result.data.data.ad;
                $scope.investment_worker = result.data.data.investment_worker;

                //if(invest.)


                document.location = $rootScope.baseUrl + "/app?panel=developer#/add";
              }
            });
      }

      $scope.countryData = {};
      $scope.GetCountryAndVoivodshipList = function () {
        $http
          .post($scope.baseUrl + "/GetCountryAndVoivodshipList")
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.countryData = result.data.data;
              }
            });
      }

      $rootScope.contact = {};
      $scope.ActivityHistory = {
        pagination: {
          start_page: 0,
          max_page_length: 30,
          order_by: "name"
        }
      }

      //Historia aktywności
      $scope.GetActivityHistory = function () {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.ActivityHistory
        };

        $http
          .post($scope.baseUrl + "/GetActivityHistory", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.ActivityHistoryResults = result.data.data.list;
                $scope.pagination.numPages = Math.ceil($scope.ActivityHistoryResults.length / $scope.pagination.perPage);
                $scope.pagination.page = 0;
              } else {
                console.log("Błąd pobierania historii aktywnośći" + JSON.stringify(result.data));
              }
            });
      }

      //Aktywowanie ogłoszenia
      $scope.activate = function (x) {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: x
          }
        };

        $http
          .post($scope.baseUrl + "/SetAdActive", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Aktywowano!");
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      $scope.setAdSold = function (x) {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: x
          }
        };

        $http
          .post($scope.baseUrl + "/SetAdSold", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Sprzedano!");
                $scope.GetAgentOfferList();
                location.reload(); 
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      //Kontakt
      $scope.SaveContact = function () {
        var req = {
          data: $rootScope.contact
        };

        $http
          .post($scope.baseUrl + "/SaveContact", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Wysłano wiadomosć!");
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      //////////////////////////////////////////////////////////////////////////////////////
      /*

          RYSOWANIE PO MAPIE + MARKERY

      */
      //////////////////////////////////////////////////////////////////////////////////////

      $scope.settings = {
        lat: 52.100856,
        lng: 18.886530
      }

      var map;
      $scope.vectorSource = new ol.source.Vector({});
      var markerSource = new ol.source.Vector();
      $scope.drawing = false;
      var styleJson = 'https://maps.tilehosting.com/c/feb46e8a-94d6-4dc8-ba00-0fa695ff52d5/styles/bright-55509-adab1/style.json?key=nrAk60aSagmrhd35Jw1G';
      var coordMin = ol.proj.fromLonLat([14.122864, 49.002025], 'EPSG:3857');
      var coordMax = ol.proj.fromLonLat([24.145893, 54.905476], 'EPSG:3857');
      var extentBorders = [coordMin[0], coordMin[1], coordMax[0], coordMax[1]];
      var vectorLayer = new ol.layer.Vector({});
      $scope.points_gps = [];
      $scope.shapes = [];
      var interaction;

   		$scope.mapInit = function () {
        $timeout(function () {
          console.info("MapInit!");

          map = new ol.Map({
            target: 'searchmap',
            view: new ol.View({
              center: ol.proj.fromLonLat([$scope.settings.lng, $scope.settings.lat], 'EPSG:3857'),
              extent: extentBorders,
              zoom: 6,
              minZoom: 5,
              zIndex: 1
            })
          });

          olms.apply(map, styleJson);
          var myFullScreenControl = new ol.control.FullScreen();
          map.addControl(myFullScreenControl);

          vectorLayer = new ol.layer.Vector({
            source: $scope.vectorSource,
            zIndex: 3,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(0, 254, 163, 0.2)'
              }),
              stroke: new ol.style.Stroke({
                color: '#00fea3',
                width: 1
              })
            })
          });
          map.addLayer(vectorLayer);
          vectorLayer.set('name', 'vectorLayer');
          
          $scope.initAgentMarkers();

        }, 1000);
      }
      
      $scope.agentMapInit = function () {
        $timeout(function () {
          console.info("AgentMapInit!");

          map = new ol.Map({
            target: 'agent_map',
            view: new ol.View({
              center: ol.proj.fromLonLat([$scope.settings.lng, $scope.settings.lat], 'EPSG:3857'),
              extent: extentBorders,
              zoom: 6,
              minZoom: 5,
              zIndex: 1
            })
          });

          olms.apply(map, styleJson);
          var myFullScreenControl = new ol.control.FullScreen();
          map.addControl(myFullScreenControl);

          vectorLayer = new ol.layer.Vector({
            source: $scope.vectorSource,
            zIndex: 3,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(0, 254, 163, 0.2)'
              }),
              stroke: new ol.style.Stroke({
                color: '#00fea3',
                width: 1
              })
            })
          });
          map.addLayer(vectorLayer);
          vectorLayer.set('name', 'vectorLayer');

        }, 1000);
			}

      $scope.setDraw = function () {
        $scope.drawing = !$scope.drawing;
        if ($scope.drawing) {

          var drawStyle = new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(0, 254, 163, 0.3)'
            }),
            stroke: new ol.style.Stroke({
              color: '#00fea3',
              width: 1
            }),
            image: new ol.style.Circle({
              radius: 3,
              fill: new ol.style.Fill({
                color: '#00fea3'
              })
            })
          });

          interaction = new ol.interaction.Draw({
            type: 'Polygon',
            source: $scope.vectorSource,
            freehand: true,
            style: drawStyle
          });

          interaction.on('drawend', function () {
            $scope.drawing = false;


            $timeout(function () {
              $scope.$apply();
            }, 1000);

            $scope.points_gps = [];

            var coords = interaction.sketchLineCoords_;

            coords.forEach(function (coord) {
              var gps = ol.proj.transform([coord[0], coord[1]], 'EPSG:3857', 'EPSG:4326');
              var item = {
                latitude: gps[1],
                longitude: gps[0]
              }
              $scope.points_gps.push(item);
            });

            var shapeFeature = new ol.Feature({
              geometry: new ol.geom.Polygon([
                $scope.points_gps
              ])
            });
            $scope.shapes.push(shapeFeature);
            map.removeInteraction(interaction);
            $scope.GetStreetNamesInArea();

          });
          map.addInteraction(interaction);
        } else {
          map.removeInteraction(interaction);
        }
      }

      $scope.delShapes = function () {
        var features = $scope.vectorSource.getFeatures();
        for (var i = 0; i < features.length; i++) {
          var tmp = features[i];
          if (tmp.get("name") == undefined) {
            $scope.vectorSource.removeFeature(tmp);
          }
        }
        $scope.shapes = [];
        $scope.foryou.address = '';
      }

      $scope.GetStreetNamesInArea = function () {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            points: $scope.points_gps
          }
        };

        $http
          .post($scope.baseUrl + "/GetStreetNamesInArea", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                if (result.data.data.list.length == 0) {
                  $rootScope.showInfoAlert("Zaznacz inny obszar");
                } else {
                  for (var i = 0; i < result.data.data.list.length; i++) {
                    $scope.promotion_list.push(result.data.data.list[i]);
                  }
                }
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      //////////////////////////////////////////////////////////////////////////////////////
      /*
          Lightbox
      */
      //////////////////////////////////////////////////////////////////////////////////////
      $scope.lightbox = {
        otico: true,
        facebook: false,
        adwords: false,
        data: {},
        buttons: {},
        radius: 3,
        localization: "0"
      };

      $scope.lightboxdata = {
        prev: "pc",
        send: {
          places: []
        },
        time: 7,
        sex: 0,
        service: {},
        prices: {
          blog: 0,
          search: 0,
          page: 0,
          all: 0
        }
      }

      $scope.priceSlider = {
        minValue: 25,
        maxValue: 35,
        options: {
          floor: 18,
          ceil: 65,
        }
      }

      $scope.priceSlider2 = {
        value: 39,
        options: {
          floor: 16,
          ceil: 66
        }
      }

      $scope.openTab = function (x, item) {
        if (item == 'otico') {
          $scope.lightbox.otico = true;
          $scope.lightbox.facebook = false;
          $scope.lightbox.adwords = false;
        }
        if (item == 'facebook') {
          $scope.lightbox.otico = false;
          $scope.lightbox.facebook = true;
          $scope.lightbox.adwords = false;
          //$scope.initMap2(); //Init mapy do lightboxa z promowaniem
        }
        if (item == 'adwords') {
          $scope.lightbox.otico = false;
          $scope.lightbox.facebook = false;
          $scope.lightbox.adwords = true;
        }
        if (x) {
          $scope.lightbox.data = x;
        }
      }

      $scope.addDataToLightbox = function (x) {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: x.id
          }

        };

        $http
          .post($scope.baseUrl + "/GetDetailedOffer", req)
          .then(
            function (result) {
              $scope.lightboxdata.data = result.data;
              $scope.lightboxdata.send.pictureurl = $scope.lightboxdata.data.multimedia[0].url;
              $scope.lightboxdata.data.multimedia[0].selected = true;
              $scope.GetInfoAboutOfferPromotions();
            });

        $scope.priceSlider2.options.ceil = $scope.model.points;
        if ($scope.model.points < 16) {
          $scope.priceSlider2.options.ceil = 16;
        }
        $scope.priceSlider2.value = 16;
      }

      $scope.ActivateInvestment = function (x) {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: x.ad
          }

        };


        alert(JSON.stringify(req));

        $http
          .post($scope.baseUrl + "/ActivateInvestment", req)
          .then(
            function (result) {


              alert(JSON.stringify(result));

              if (result.data.metadata.status = "OK") {
                $rootScope.showSuccessAlert("Aktywowano");
                $scope.GetMyInvestmentList();
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
              console.log(result.data);
            });
      }

      $scope.addDataToLightbox_invest = function (x) {

        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: x.ad
          }

        };

        $http
          .post($scope.baseUrl + "/GetDetailedOffer", req)
          .then(
            function (result) {
              $scope.lightboxdata.data = result.data;
              $scope.lightboxdata.send.pictureurl = $scope.lightboxdata.data.multimedia[0].url;
              $scope.lightboxdata.data.multimedia[0].selected = true;
            });

        $scope.GetInfoAboutOfferPromotions_invest(x.ad);

        $scope.priceSlider2.options.ceil = $scope.model.points;
        if ($scope.model.points < 16) {
          $scope.priceSlider2.options.ceil = 16;
        }
        $scope.priceSlider2.value = 16;
      }

      $scope.CreateFacebookAd = function () {

        $rootScope.showLoading();

        //Parse Date
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var start = yyyy + "-" + mm + "-" + dd;

        Date.prototype.addDays = function (days) {
          var dat = new Date(this.valueOf());
          dat.setDate(dat.getDate() + days);
          return dat;
        }

        var dat = new Date();
        dat = dat.addDays(parseInt($scope.lightboxdata.time));
        var new_dd = dat.getDate();
        var new_mm = dat.getMonth() + 1;
        var new_yyyy = dat.getFullYear();
        var end = new_yyyy + "-" + new_mm + "-" + new_dd;

        $scope.lightboxdata.send.starttime = start;
        $scope.lightboxdata.send.endtime = end;
        //End Parse Date

        $scope.lightboxdata.send.ad = $scope.lightboxdata.data.id;
        $scope.lightboxdata.send.address = $scope.lightboxdata.data.street + " " + $scope.lightboxdata.data.city;
        if ($scope.lightboxdata.sex == '0') {
          $scope.lightboxdata.send.gender = 'b';
        }
        if ($scope.lightboxdata.sex == '1') {
          $scope.lightboxdata.send.gender = 'f';
        }
        if ($scope.lightboxdata.sex == '2') {
          $scope.lightboxdata.send.gender = 'm';
        }
        $scope.lightboxdata.send.agemin = $scope.priceSlider.minValue;
        $scope.lightboxdata.send.agemax = $scope.priceSlider.maxValue;
        $scope.lightboxdata.send.budget = $scope.priceSlider2.value * 5;

        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.lightboxdata.send
        };

        $http
          .post($scope.baseUrl + "/CreateFacebookAd", req)
          .then(
            function (result) {
              console.log(result.data);
              if (result.data.metadata.status = "OK") {
                $rootScope.showSuccessAlert("Dodano");
              } else {
                if (result.data.data.cause != undefined) {
                  $rootScope.errorHandle("Zbyt mały budżet kampanii. Minimum: " + result.data.data.minimal_budget + "pkt");
                } else {
                  $rootScope.errorHandle(result.data.metadata.status);
                }
              }
            });
      }

      $scope.AddCityToPromotion = function () {
        var tmp = {
          city: $scope.lightbox.tmp.city,
          radius: $scope.lightbox.tmp.radius
        }

        $scope.lightboxdata.send.places.push(tmp);
      }

      $scope.DelCityFromPromotion = function (x) {
        var index = $scope.lightboxdata.send.places.indexOf(x);
        $scope.lightboxdata.send.places.splice(index, 1);
      }

      $scope.togglePrev = function (x) {
        $scope.lightboxdata.prev = x;
      }

      $scope.toggleImg = function (x) {
        for (var i = 0; i < $scope.lightboxdata.data.multimedia.length; i++) {
          $scope.lightboxdata.data.multimedia[i].selected = false;
          if ($scope.lightboxdata.data.multimedia[i].url == x.url) {
            $scope.lightboxdata.data.multimedia[i].selected = true;
            $scope.lightboxdata.send.pictureurl = $scope.lightboxdata.data.multimedia[i].url;
          }
        }
      }

      $scope.BuyOfferPromotion = function () {

        $scope.lightboxdata.service.id = $scope.lightboxdata.data.id;

        $scope.updatePromotions();

        var req = {
          metadata: {
            token: $scope.token
          },
          data: $scope.lightboxdata.service
        };

        console.log(req);

        if ($scope.model.virtual_points != undefined) {
          var all_points = $scope.model.points + $scope.model.virtual_points;
        } else {
          var all_points = $scope.model.points;
        }

        if ($scope.lightboxdata.prices.all > all_points) {
          $rootScope.showErrorAlert("Niewystarczająca ilosć punktów na koncie!");
          return;
        }

        $http
          .post($scope.baseUrl + "/BuyOfferPromotion", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $rootScope.showSuccessAlert("Dodano");
                //Przeładowanie konta
                var tmp = $cookies.get('next');
                console.log(tmp);
                if (tmp == 'agent') {
                  $scope.GetAgentProfile();
                }
                if (tmp == 'developer') {
                  $scope.GetDeveloperProfile();
                  $scope.GetMyInvestmentList();
                }
                if (tmp == 'owner') {
                  $scope.getOwnerData();
                  $scope.GetOwnerOfferList();
                }
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
              console.log(result.data);
            });
      }

      $scope.GetInfoAboutOfferPromotions = function () {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: $scope.lightboxdata.data.id
          }
        };


        $rootScope.showLoading();

        $http
          .post($scope.baseUrl + "/GetInfoAboutOfferPromotions", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.lightboxdata.info = result.data.data.prices;
              } else {
                console.log(result.data);
              }
              $rootScope.closeLoading();
            });
      }

      $scope.GetInfoAboutOfferPromotions_invest = function (x) {
        var req = {
          metadata: {
            token: $scope.token
          },
          data: {
            id: x
          }
        };

        $rootScope.showLoading();

        $http
          .post($scope.baseUrl + "/GetInfoAboutOfferPromotions", req)
          .then(
            function (result) {
              if (result.data.metadata.status == "OK") {
                $scope.lightboxdata.info = result.data.data.prices;
              } else {
                console.log(result.data);
              }
              $rootScope.closeLoading();
            });
      }

      $scope.updatePromotions = function () {
        if ($scope.lightbox.mainsite) {
          if ($scope.lightbox.mainsitetime == '7') {
            $scope.lightboxdata.service.home7 = true;
            $scope.lightboxdata.service.home14 = false;
            $scope.lightboxdata.service.home30 = false;
          }
          if ($scope.lightbox.mainsitetime == '14') {
            $scope.lightboxdata.service.home7 = false;
            $scope.lightboxdata.service.home14 = true;
            $scope.lightboxdata.service.home30 = false;
          }
          if ($scope.lightbox.mainsitetime == '30') {
            $scope.lightboxdata.service.home7 = false;
            $scope.lightboxdata.service.home14 = false;
            $scope.lightboxdata.service.home30 = true;
          }
        } else {
          $scope.lightboxdata.service.home7 = false;
          $scope.lightboxdata.service.home14 = false;
          $scope.lightboxdata.service.home30 = false;
        }

        if ($scope.lightbox.search) {
          if ($scope.lightbox.searchtime == '7') {
            $scope.lightboxdata.service.search7 = true;
            $scope.lightboxdata.service.search14 = false;
            $scope.lightboxdata.service.search30 = false;
          }
          if ($scope.lightbox.searchtime == '14') {
            $scope.lightboxdata.service.search7 = false;
            $scope.lightboxdata.service.search14 = true;
            $scope.lightboxdata.service.search30 = false;
          }
          if ($scope.lightbox.searchtime == '30') {
            $scope.lightboxdata.service.search7 = false;
            $scope.lightboxdata.service.search14 = false;
            $scope.lightboxdata.service.search30 = true;
          }
        } else {
          $scope.lightboxdata.service.search7 = false;
          $scope.lightboxdata.service.search14 = false;
          $scope.lightboxdata.service.search30 = false;
        }

        if ($scope.lightbox.blog) {
          if ($scope.lightbox.blogtime == '7') {
            $scope.lightboxdata.service.blog7 = true;
            $scope.lightboxdata.service.blog14 = false;
            $scope.lightboxdata.service.blog30 = false;
          }
          if ($scope.lightbox.blogtime == '14') {
            $scope.lightboxdata.service.blog7 = false;
            $scope.lightboxdata.service.blog14 = true;
            $scope.lightboxdata.service.blog30 = false;
          }
          if ($scope.lightbox.blogtime == '30') {
            $scope.lightboxdata.service.blog7 = false;
            $scope.lightboxdata.service.blog14 = false;
            $scope.lightboxdata.service.blog30 = true;
          }
        } else {
          $scope.lightboxdata.service.blog7 = false;
          $scope.lightboxdata.service.blog14 = false;
          $scope.lightboxdata.service.blog30 = false;
        }
      }

      $scope.updatePrices = function () {
        if (angular.isDefined($scope.lightboxdata.info[0])) {

          if ($scope.lightbox.mainsite) {
            if ($scope.lightbox.mainsitetime == '7') {
              $scope.lightboxdata.prices.page = parseInt($scope.lightboxdata.info[0].price);
            }
            if ($scope.lightbox.mainsitetime == '14') {
              $scope.lightboxdata.prices.page = parseInt($scope.lightboxdata.info[1].price);
            }
            if ($scope.lightbox.mainsitetime == '30') {
              $scope.lightboxdata.prices.page = parseInt($scope.lightboxdata.info[2].price);
            }
          } else {
            $scope.lightboxdata.prices.page = 0;
          }

          if ($scope.lightbox.search) {
            if ($scope.lightbox.searchtime == '7') {
              $scope.lightboxdata.prices.search = parseInt($scope.lightboxdata.info[3].price);
            }
            if ($scope.lightbox.searchtime == '14') {
              $scope.lightboxdata.prices.search = parseInt($scope.lightboxdata.info[4].price);
            }
            if ($scope.lightbox.searchtime == '30') {
              $scope.lightboxdata.prices.search = parseInt($scope.lightboxdata.info[5].price);
            }
          } else {
            $scope.lightboxdata.prices.search = 0;
          }

          if ($scope.lightbox.blog) {
            if ($scope.lightbox.blogtime == '7') {
              $scope.lightboxdata.prices.blog = parseInt($scope.lightboxdata.info[6].price);
            }
            if ($scope.lightbox.blogtime == '14') {
              $scope.lightboxdata.prices.blog = parseInt($scope.lightboxdata.info[7].price);
            }
            if ($scope.lightbox.blogtime == '30') {
              $scope.lightboxdata.prices.blog = parseInt($scope.lightboxdata.info[8].price);
            }
          } else {
            $scope.lightboxdata.prices.blog = 0;
          }

        }


        $scope.lightboxdata.prices.all = parseInt($scope.lightboxdata.prices.blog) + parseInt($scope.lightboxdata.prices.search) + parseInt($scope.lightboxdata.prices.page);
      }

      $scope.setPromotionMinPrice = function (x) {
        $scope.priceSlider2.options.floor = parseInt(x);
        $scope.priceSlider2.value = parseInt(x);

        if ($scope.model.points < parseInt(x)) {
          $scope.priceSlider2.options.ceil = parseInt(x);
        } else {
          $scope.priceSlider2.options.ceil = $scope.model.points;
        }
      }

      /*///////////////////////////////////////////////////////////////////////
      Lightbox END
      */ ///////////////////////////////////////////////////////////////////////

      $scope.initFav = function () {
        $scope.fervor = [];

        var req = {
          metadata: {
            token: $scope.token
          }
        };

        $http
          .post($scope.baseUrl + "/GetFavoriteList", req)
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                var list = result.data.data.list;
                var l = list.length;
                for (var i = 0; i < l; i++) {
                  $scope.fervor.push(list[i].id);
                }
              }
            });

      }
      
      //Dodawanie inwestycji
      $scope.invest = {
        voivodship: "1",
        country: "161",
        multimedia: []
      };

    	$scope.AddInvest = function(){
        $scope.invest = {
            voivodship: "1",
            country: "161",
            multimedia: []
        };
    	}

      $scope.investment_worker = [];
      $scope.ads = [];
      $scope.preview = false;
      $scope.contact = {};
      $scope.worker = {};
      $scope.home = {
        multimedia: []
      };
      $scope.valid = false;

      $scope.addWorker = function () {
        $scope.investment_worker.push($scope.worker);
        $scope.worker = {};
      }

      $scope.addHome = function () {
        $scope.ads.push($scope.home);
        $scope.home = {
          multimedia: []
        };
      }

      $scope.delWorker = function (item) {
        var index = $scope.investment_worker.indexOf(item);
        $scope.investment_worker.splice(index, 1);
      }

      $scope.delHome = function (item) {
        var index = $scope.ads.indexOf(item);
        $scope.ads.splice(index, 1);
      }
      $scope.getValidation = function () {

        $scope.valid = true;

        if (!$scope.invest.title || !$scope.invest.country || !$scope.invest.voivodship || !$scope.invest.city || !$scope.invest.street || !$scope.invest.custodian_phone || !$scope.invest.custodian_name) {
          $rootScope.errorHandle("Popraw pola zaznaczone kolorem czerwonym!");
          return false;
        }

        if (!$scope.invest.multimedia) {
          $rootScope.errorHandle("Dodaj co najmniej jedno zdjęcie!");
          return false;
        }

        return true;
      }
      $scope.promotioncode = '';
      $scope.addOffer = function () {

        if (!$scope.getValidation()) {
          return;
        }

        $scope.model.property = '2';


        var data = {
          investment: $scope.invest,
          investment_worker: $scope.investment_worker,
          ads: $scope.ads,
          code: $scope.promotioncode
        };

        var req = {
          metadata: {
            token: $scope.token,
          },
          data: data
        }

        for (var i = 0; i < $scope.invest.multimedia.length; i++) {
          delete $scope.invest.multimedia[i].select;
        }

        $http
          .post($scope.baseUrl + "/SaveInvestment", req)
          .then(
            function (result) {
              console.log(result.data)
              if (req.data.investment.ad != null && req.data.investment.ad != undefined) {
                $scope.gotoEdit_invest(req.data.investment.ad);
                console.log("Edit!");
              }
              if (result.data.metadata.status == 'OK') {
                $rootScope.showSuccessAlert("Dodano!");
                $scope.editActive = false;
                $scope.GetDeveloperProfile();
                $scope.invest = {};
                $scope.investment_worker = [];
                $scope.ads = [];
                $scope.promotioncode = '';
                document.location = $scope.baseUrl + "/app?panel=developer#/invest";
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            });
      }

      $scope.addInvestMedia = function (x) {

        var data = x.files[0];

        var fd = new FormData();
        fd.append("file", data);
        fd.append("token", $rootScope.token);
        fd.append("document", "document");
        fd.append("multimedia", "multimedia");

        $rootScope.showLoading();

        $http.post($rootScope.baseUrl + '/UploadImage', fd, {
            withCredentials: false,
            headers: {
              'Content-Type': undefined
            },
            transformRequest: angular.identity,
          })
          .then(
            function (result) {

              if (result.data.metadata.status == 'OK') {
                $rootScope.closeLoading();
                $rootScope.showSuccessAlert('Upload zakończył się sukcesem');
                $scope.invest.multimedia.push(result.data.data);
                return;
              }
            },
            function (result) {
              $rootScope.showErrorAlert("Ładowanie zakończyło się niepowodzeniem");
            }
          );
      }

      $scope.addInvestLogo = function (x) {

        var data = x.files[0];

        var fd = new FormData();
        fd.append("file", data);
        fd.append("token", $rootScope.token);
        fd.append("document", "document");
        fd.append("multimedia", "multimedia");

        $rootScope.showLoading();

        $http.post($rootScope.baseUrl + '/UploadImage', fd, {
            withCredentials: false,
            headers: {
              'Content-Type': undefined
            },
            transformRequest: angular.identity,
          })
          .then(
            function (result) {

              if (result.data.metadata.status == 'OK') {
                $rootScope.closeLoading();
                $rootScope.showSuccessAlert('Upload zakończył się sukcesem');
                $scope.invest.logo = result.data.data.url;
                return;
              }
            },
            function (result) {
              $rootScope.showErrorAlert("Ładowanie zakończyło się niepowodzeniem");
            }
          );
      }

      $scope.selectimage = function (x) {
        if (x.select) {
          x.select = false;
        } else {
          x.select = true;
        }
      }

      $scope.delall = function () {
        delete $scope.invest.multimedia;
      }

      $scope.delselect = function () {

        var tmp = $scope.invest.multimedia;
        $scope.invest.multimedia = [];

        for (var i = 0; i < tmp.length; i++) {
          if (!tmp[i].select) {
            $scope.invest.multimedia.push(tmp[i]);
          }
        }
      }

      $scope.multimedia_select = 'foto';
      $scope.setMedia = function (x) {
        $scope.multimedia_select = x;
      }

      $scope.addInvestMedia_local = function (x) {

        var data = x.files[0];

        if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(data.name)) {
          var fd = new FormData();
          fd.append("file", data);
          fd.append("token", $rootScope.token);
          fd.append("document", "document");
          fd.append("multimedia", "multimedia");

          $rootScope.showLoading();

          $http.post($rootScope.baseUrl + '/UploadImage', fd, {
              withCredentials: false,
              headers: {
                'Content-Type': undefined
              },
              transformRequest: angular.identity,
            })
            .then(
              function (result) {

                if (result.data.metadata.status == 'OK') {
                  $rootScope.closeLoading();
                  $rootScope.showSuccessAlert('Upload zakończył się sukcesem');
                  $scope.home.multimedia.push(result.data.data);
                  return;
                }
              },
              function (result) {
                $rootScope.showErrorAlert("Ładowanie zakończyło się niepowodzeniem");
              }
            );
        } else {
          $rootScope.errorHandle("Nieobsługiwany typ pliku!");
        }


      }


      $scope.offerdetail = {};
      $scope.moreinfo = {};

      $scope.goPreview = function () {
        document.location = $scope.baseUrl + "/app?panel=developer#/preview";

        $scope.moreinfo.area_min = 0;
        $scope.moreinfo.area_max = 0;
        $scope.moreinfo.price_min = 0;
        $scope.moreinfo.sell = 0;
        $scope.moreinfo.reserved = 0;
        $scope.moreinfo.sold = 0;

        //Ceny i powierzchnia
        if ($scope.ads.length) {

          $scope.moreinfo.area_min = parseInt($scope.ads[0].area);
          $scope.moreinfo.area_max = parseInt($scope.ads[0].area);
          $scope.moreinfo.price_min = parseInt($scope.ads[0].price);

          for (var i = 0; i < $scope.ads.length; i++) {
            var tmp = $scope.ads[i];

            if (tmp.status == 'sell') {
              $scope.moreinfo.sell = $scope.moreinfo.sell + 1;
            }
            if (tmp.status == 'reserved') {
              $scope.moreinfo.reserved = $scope.moreinfo.reserved + 1;
            }
            if (tmp.status == 'sold') {
              $scope.moreinfo.sold = $scope.moreinfo.sold + 1;
            }

            var area = parseInt(tmp.area);
            var price = parseInt(tmp.price);

            if (area > $scope.moreinfo.area_max) {
              $scope.moreinfo.area_max = area;
            }
            if ($scope.moreinfo.area_min > area) {
              $scope.moreinfo.area_min = area;
            }
            if (price < $scope.moreinfo.price_min) {
              $scope.moreinfo.price_min = price;
            }
          }
        }
      }

      $scope.backPreview = function () {
        document.location = $scope.baseUrl + "/app?panel=developer#/add";
      }

      $scope.picture = [];
      $scope.inv_picture = [];
      $scope.picture_tmp = [];

      /*//////////////////////////////////////////////////
          Blok dodawania awatara
      //////////////////////////////////////////////////*/
      $scope.myImage = '';
      $scope.myCroppedImage = {
        data: ''
      };

      $scope.handleFileSelect = function (evt) {
        var file = evt.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
          $scope.$apply(function ($scope) {
            $scope.myImage = evt.target.result;
          });
        };
        reader.readAsDataURL(file);
      }

      function dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
        else
          byteString = unescape(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {
          type: mimeString
        });
      }

      $scope.UploadAvatar = function () {
        var decodedImage = dataURItoBlob($scope.myCroppedImage.data);
        var blob = new Blob([decodedImage], {
          type: 'image/png'
        });
        var file = new File([blob], 'imageFileName.png');

        var fd = new FormData();
        fd.append("file", file);
        fd.append("token", $rootScope.token);
        fd.append("document", "document");
        fd.append("multimedia", "multimedia");

        $http.post($rootScope.baseUrl + '/SetUserImage', fd, {
            withCredentials: false,
            headers: {
              'Content-Type': undefined
            },
            transformRequest: angular.identity,
          })
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
              }
            }
          );
      }

      $scope.av_tmp = {}

      $scope.delAvek = function () {
        $scope.av_tmp = {};
      }

      $scope.UploadAvatar2 = function (file) {

        var data = file.files[0];

        var fd = new FormData();
        fd.append("file", data);
        fd.append("token", $rootScope.token);
        fd.append("document", "document");
        fd.append("multimedia", "multimedia");

        $http.post($rootScope.baseUrl + '/SetUserImage', fd, {
            withCredentials: false,
            headers: {
              'Content-Type': undefined
            },
            transformRequest: angular.identity,
          })
          .then(
            function (result) {
              if (result.data.metadata.status == 'OK') {
                $rootScope.showSuccessAlert("Pomyślnie zapisano!");
                $scope.av_tmp = result.data.data;
              } else {
                $rootScope.errorHandle(result.data.metadata.status);
              }
            }
          );
      }
      /*//////////////////////////////////////////////////
          KONIEC - Blok dodawania awatara
      //////////////////////////////////////////////////*/


    });

function img_button_clicked() {
  $('#my-image').click();
}

function img_button_clicked2() {
  $('#my-image2').click();
}

function logo_button_clicked() {
  $('#my-logo').click();
}

(function () {

  app.directive('onlyLettersInput', onlyLettersInput);

  function onlyLettersInput() {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
          var transformedInput = text.replace(/[^a-zA-Z]/g, '');
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  };

})();

app.directive('backImg', function () {
  return function (scope, element, attrs) {
    var url = attrs.backImg;
    element.css({
      'background-image': 'url(' + url + ')'
    });
  };
});

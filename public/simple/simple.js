'use strict';

angular.module('playground.simple', ['ngRoute', 'paypal-button'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/simple/', {
      templateUrl: 'simple/simple.html',
      controller: 'simplePmtCtl'
  });
}])

.controller('simplePmtCtl', function($scope, $route){

  $scope.defoptions = {
      env: {
        live: 'production',
        sandbox: 'sandbox'
      },
      locale: {
        da_DK: 'da_DK',
        de_DE: 'de_DE',
        en_AU: 'en_AU',
        en_GB: 'en_GB',
        en_US: 'en_US',
        es_ES: 'es_ES',
        fr_CA: 'fr_CA',
        fr_FR: 'fr_FR',
        he_IL: 'he_IL',
        id_ID: 'id_ID',
        it_IT: 'it_IT',
        ja_JP: 'ja_JP',
        nl_NL: 'nl_NL',
        no_NO: 'no_NO',
        pl_PL: 'pl_PL',
        pt_PT: 'pt_BR',
        pt_PT: 'pt_PT',
        ru_RU: 'ru_RU',
        sv_SE: 'sv_SE',
        th_TH: 'th_TH',
        zh_CN: 'zh_CN',
        zh_HK: 'zh_HK',
        zh_TW: 'zh_TW'
      },
      size: {
        medium: 'medium',
        small: 'small',
        tiny: 'tiny'
      },
      shape: {
        pill: 'pill',
        rectangle: 'rect'
      },
      color: {
        gold: 'gold',
        blue: 'blue',
        silver: 'silver'
      },
      currency: {
        EUR: 'EUR',
        USD: 'USD',
        GBP: 'GBP',
      }
  };

  $scope.authorizeResults = false;
  $scope.executeResults = false;
  $scope.authorizeSuccessResults = false;

  $scope.optenv = $scope.defoptions.env.sandbox;
  $scope.optlocale = $scope.defoptions.locale.de_DE;
  $scope.optsize = $scope.defoptions.size.medium;
  $scope.optshape = $scope.defoptions.shape.pill;
  $scope.optcolor = $scope.defoptions.color.gold;

  /*  Purchase Details    */

  $scope.optdesc = 'Purchase Description';

  $scope.optitem1name = 'Test Item 1';
  $scope.optitem1price = 10.00;
  $scope.optitem1quantity = 1;

  $scope.optitem2name = 'Test Item 2';
  $scope.optitem2price = 10.00;
  $scope.optitem2quantity = 1;

  $scope.optsubtotal = $scope.optitem1price * $scope.optitem1quantity + $scope.optitem2price * $scope.optitem2quantity;
  $scope.opttax = 1.00;
  $scope.opthandling = 1.00;

  $scope.optamt = $scope.optsubtotal + $scope.opttax + $scope.opthandling;
  $scope.optcurrency = $scope.defoptions.currency.EUR;

  /* Purchase Details */

  $scope.subtotalcalc = function() {
      $scope.optsubtotal = $scope.optitem1price * $scope.optitem1quantity + $scope.optitem2price * $scope.optitem2quantity;
      $scope.totalcalc();
  };

  $scope.totalcalc = function() {
      $scope.optamt = $scope.optsubtotal + $scope.opttax + $scope.opthandling;
  };


  $scope.spawnButton = function(){

    $('#paypal-button').empty();
    $('#authresults').empty();
    $('#exeresults').empty();
    $scope.authorizeResults = false;
    $scope.authorizeSuccessResults = false;
    $scope.executeResults = false;

    paypal.Button.render({

      locale: $scope.optlocale,

      style: {
          size: $scope.optsize,
          color: $scope.optcolor,
          shape: $scope.optshape
      },

      env: $scope.optenv,

      client: {
        sandbox: 'AdhnjNyK9ORHQcPuIc5UuIAxEo8cfDkKQ7l4ien5Z08aflh2I0SZNDa9oDCK-1AUyqJEC5nyM6DIPkjG', // from https://developer.paypal.com/developer/applications/
        production: 'AYUh6BCSB9Z9HFekGQTHPwmDCfe5jBYLV4LKC4xJiSWX-UwGZ_Xdea97Xc9y'
      },

      payment: function() {

          var env    = this.props.env;
          var client = this.props.client;
          return paypal.rest.payment.create(env, client, {
              transactions: [
                {
                  amount: {
                    total: $scope.optamt,
                    currency: $scope.optcurrency,
                    details: {
                        subtotal: $scope.optsubtotal,
                        tax: $scope.opttax,
                        handling_fee: $scope.opthandling
                    }
                  },
                  description: $scope.optdesc,
                  item_list: {
                    items: [
                        {
                            quantity: $scope.optitem1quantity,
                            name: $scope.optitem1name,
                            price: $scope.optitem1price,
                            currency: $scope.optcurrency
                        },
                        {
                            quantity: $scope.optitem2quantity,
                            name: $scope.optitem2name,
                            price: $scope.optitem2price,
                            currency: $scope.optcurrency
                        }
                    ]
                  }
                }
              ]
            });
      },

      onCancel: function(data, actions) {
        $scope.$apply(function(){
          $scope.authorizeResults = true;
          $scope.authorizeSuccessResults = false;
          $scope.resultFunction = 'onCancel';
        });

        var outData = JSON.stringify(data, null, 2);
        var outActions = JSON.stringify(actions, null, 2);

        $('#authresults').append('Payment not successful. Please try again. The following might contain some error data:');
        $('#authresults').append(outData);
        $('#resultsPanel').collapse('show');
        console.log(actions);
      },

      onAuthorize: function(data, actions) {
          // Optional: display a confirmation page here

          $scope.$apply(function(){
            $scope.authorizeResults = true;
            $scope.authorizeSuccessResults = true;
            $scope.resultFunction = 'onAuthorize';
          });

          var outData = JSON.stringify(data, null, 2);
          var outActions = JSON.stringify(actions, null, 2);

          $('#authresults').append(outData);
          $('#resultsPanel').collapse('show');
          console.log(actions);

          $scope.actions = actions;
          console.log($scope.actions);
      }

    }, '#paypal-button')
  };

  $scope.paynow = function() {
      $scope.actions.payment.execute().then(function(data, error){

        console.log(data);
        console.log(error);



        if (error) {

          $scope.$apply(function(){
                $scope.executeResults = true;
                $scope.executeFunction = 'Error'
          });
          var outError = JSON.stringify(error, null, 2);
          $('#exeresults').append(outError);

        } else {
          $scope.$apply(function(){
                $scope.executeResults = true;
                $scope.executeFunction = 'Data'
          });
          var outData = JSON.stringify(data, null, 2);
          $('#exeresults').append(outData);

        };

        $('#resultsPanel').collapse('hide');
        $('#executePanel').collapse('show');

      });

  };

})

;

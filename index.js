// To test the tinymce addon, uncomment the files above and inject 'tx-tinymce' below.
angular.module('test',['schemaForm']).controller('TestCtrl', function($scope,$http){
    $scope.selectedTest = { name: "Simple", data: 'data/testemSchema.json' };
    $scope.cases = [
        "test.js",
        "test/test.js",
        "test/case1/test.js",
        "lib/mylib.js",
        "src/main.js",
        "src/test/mainSpec.js",
        "node_modules/yourlib/yourlib.min.js",
        "bower_components/ourlib/ourlib.min.js"
    ];
    $scope.$watch('selectedTest',function(val){
        if (val) {
            $http.get(val.data).then(function(res){
                $scope.schema = res.data.schema;
                $scope.form   = res.data.form;
                $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
                $scope.formJson   = JSON.stringify($scope.form,undefined,2);
                $scope.modelData = res.data.model || {};
            });
        }
    });
    $scope.decorator = 'bootstrap-decorator';
    $scope.itParses     = true;
    $scope.itParsesForm = true;
    $scope.$watch('schemaJson',function(val,old){
        if (val && val !== old) {
            try {
                $scope.schema = JSON.parse($scope.schemaJson);
                $scope.itParses = true;
            } catch (e){
                $scope.itParses = false;
            }
        }
    });
    $scope.$watch('formJson',function(val,old){
        if (val && val !== old) {
            try {
                $scope.form = JSON.parse($scope.formJson);
                $scope.itParsesForm = true;
            } catch (e){
                $scope.itParsesForm = false;
            }
        }
    });
    $scope.pretty = function(){
        if($scope.modelData){
            var patterns = $scope.modelData.src_files;
            if(patterns && patterns.length > 0){
                var matched = _.uniq(_.flatten(
                    patterns.map(function(item){
                        var result = [];
                        try{
                            result = minimatch.match($scope.cases, item);
                        }catch(e){
                        }
                        return result;
                    })
                ));

                $scope.matchedCase = $scope.cases.map(function(item){
                    return {file: item, matched: _.contains(matched, item)};
                });

            }
        }
        return JSON.stringify($scope.modelData,undefined,2,2);
    };
    $scope.submitForm = function(form, model) {
        /*
         // First we broadcast an event so all fields validate themselves
         $scope.$broadcast('schemaFormValidate');
         // Then we check if the form is valid
         if (form.$valid) {
         alert('You did it!');
         }
         */
    }
});
app.directive("dropdown", function() {
  return {
    restrict: 'E',
    scope:{
      info: "="
    },
    templateUrl: "/directives/dropdown.html"
  }
});
define(['efb'], function (EFB) {
  var WorkspaceRouter = Backbone.Router.extend({
    routes: {
      "" : "index",
      "main": "main",
      "user/:id":   "user",
      "help": "help"
    },

    main: function () {
      $(".page").hide();
      if (isLogin) {
        EFB.render();
        $('#page-main').show();
      } else {
        $("#page-index").show();
        router.navigate("");
      }
    },

    user: function(id) {
      $(".page").hide();
      if (isLogin) {
        EFB.render_user(id);
        $("#page-user").show();
      } else {
        $("#page-index").show();
        router.navigate("");
      }
    },

    help: function () {
        $(".page").hide();
        $('#page-help').show();
    }
  }),
  router = new WorkspaceRouter;
  Backbone.history.start();
  return router;
})

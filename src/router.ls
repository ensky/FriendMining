define [\efb], (EFB) ->
  WorkspaceRouter = Backbone.Router.extend do
    isLogin: false

    routes: do
      "" : "index"
      "main": "main"
      "user/:id":   "user"
      "help": "help"

    main: ->
      $ ".page" .hide()
      if @isLogin
        EFB.render()
        $ \#page-main .show()
      else
        $ \#page-index .show()
        router.navigate ''
    user: (id) ->
      $ ".page" .hide()
      if @isLogin
        EFB.render_user id
        $ \#page-user .show()
      else
        $ \#page-index .show()
        router.navigate ''

    help: ->
        $ \.page .hide()
        $ \#page-help .show()

  Backbone.history.start()
  router = new WorkspaceRouter
define [\efb], (EFB) ->
	AppRouter = Backbone.Router.extend do
		isLogin: false

		routes: do
			"" : "index"
			"main": "main"
			"user/:id":	 "user"
			"help": "help"

	appRouter = new AppRouter
	appRouter.on 'route:main' ->
		$ ".page" .hide()
		if @isLogin
			EFB.render()
			$ \#page-main .show()
		else
			$ \#page-index .show()
			this.navigate ''

	appRouter.on 'route:user' (id) ->
		$ ".page" .hide()
		if @isLogin
			EFB.render_user id
			$ \#page-user .show()
		else
			$ \#page-index .show()
			this.navigate ''

	appRouter.on 'route:help' ->
		$ \.page .hide()
		$ \#page-help .show()

	Backbone.history.start()
	return appRouter
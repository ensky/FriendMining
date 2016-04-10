require [\efb, \router, \plugin/fbSDK, \plugin/marked] (EFB, router) !->
	$ !->
		$ \i.icon-minus .live \click, !->
			fold = $ this .attr \data-fold
			if fold and fold.length != 0
				obj = $ '#'+  fold
				obj.slideUp()
				$ this .attr \class, \icon-plus

		$ 'i.icon-plus' .live \click, !->
			fold = $ this .attr \data-fold
			if fold and fold.length != 0
				obj = $ \# + fold
				obj.slideDown()
				$ this .attr \class, \icon-minus

		$ '#login-btn' .click !->
			$ '#login-btn' .attr 'disabled', 'disabled'
			FB.login (response) !->
				$ '#login-btn' .attr 'disabled', ''
				if response.authResponse
					router.isLogin = true
					EFB.init()
					router.navigate \#/main
					$ '.display-when-login' .show()
				else
					console.log 'User cancelled login or did not fully authorize.'
			, do
				scope: 'user_posts,user_friends'
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
            FB.login (response) !->
                if response.authResponse
                    FB.api '/me?fields=id', (d) !->
                        window.wallID := d.id
                        window.myID := d.id

                    router.isLogin = true
                    EFB.init()
                    router.navigate("#/main");
                    $ '.display-when-login' .show()
                else
                    console.log 'User cancelled login or did not fully authorize.'
            , do
                scope: 'read_stream'
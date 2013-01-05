/*
 * Author: Ensky Lin(http://www.ensky.tw/)
 * Licence: http://creativecommons.org/licenses/by-nc-sa/3.0/
 */
window.isLogin = false;
    window.fbAsyncInit = function() {
      // init the FB JS SDK
      FB.init({
        appId      : '313564748761564', // App ID from the App Dashboard
        channelUrl : '//ensky.tw/FriendMining/channel.php', // Channel File for x-domain communication
        status     : true, // check the login status upon init?
        cookie     : true, // set sessions cookies to allow your server to access the session?
        xfbml      : true  // parse XFBML tags on this page?
      });
      $('#login-btn').attr('disabled', false);
    };

    // Load the SDK's source Asynchronously
    // Note that the debug version is being actively developed and might 
    // contain some type checks that are overly strict. 
    // Please report such bugs using the bugs tool.
    (function(d, debug){
       var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement('script'); js.id = id; js.async = true;
       js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
       ref.parentNode.insertBefore(js, ref);
     }(document, /*debug*/ false));

var EFB = function () {
  var until, since, until_this_round, grab_limit;
  var loadingCount, stop_loading;
  var Friends = {kid: {}, kname: {}};
  var Data = {
    msgs: {},
    users: {/*name, likes, comments*/},
    ranks: {
      like: PriorityQueue({low: true}),
      comment: PriorityQueue({low: true}),
      all: PriorityQueue({low: true})
    },
    names: [],
    name_id: {}
  };
  var T = {
    'page_user': _.template($('#t-page-user').html()),
    'user': _.template($('#t-user').html()),
    'like': _.template($('#t-like').html()),
    'comment': _.template($('#t-comment').html())
  };
  window.Data = Data;

  var init_wall = function (form_since) {
      Data = {
        msgs: {},
        users: {/*name, likes, comments*/},
        ranks: {
          like: PriorityQueue({low: true}),
          comment: PriorityQueue({low: true}),
          all: PriorityQueue({low: true})
        },
        names: [],
        name_id: {}
      };
      loadingCount=0;
      stop_loading=0;
      until = Math.floor(new Date().getTime() / 1000);
      since = new Date();
      switch (form_since) {
        case "week":
          since.setTime( since.getTime() - 60*60*24*7 * 1000 );
          grab_limit = 30;
          break;
        case "month":
          since.setDate(1);
          grab_limit = 50;
          break;
        case "year":
          since.setFullYear(since.getFullYear() - 1);
          grab_limit = 80;
          break;
        case "forever":
          since = null;
          grab_limit = 100;
          break;
      }
      until_this_round = (new Date().getTime()) / 1000;
      if ( since ) {
        since = Math.floor(since.getTime() / 1000);
      }
      // search 
      $('#search-form').submit(function () {
          // event.preventDefault();
          var query = $('#search-input').val();
          if ( typeof Data.name_id[query] !== 'undefined') {
              window.Router.navigate("#/user/" + Data.name_id[query], {trigger: true});
              $('#search-input').val('');
          }
          return false;
      });
      call();
  }

  var parseCommentLike = function (type, row) {
      var initUser = function (userid, name) {
          if (typeof Data.users[userid] === 'undefined') {
              Data.users[userid] = {
                  name: name,
                  likes: [],
                  comments: {}
              }
              // name remapping
              Data.names.push(name);
              Data.name_id[name] = userid;
              // search autocomplete
              $('#search-input').autocomplete({
                  source: Data.names
              });
          }
      };

      // since判斷
      var filterCreateTime = function (created_time) {
          var ct = (new Date(created_time.substr(0, 10))) / 1000;
          if (ct >= since) {
              if (ct < until_this_round)
                  until_this_round = ct;
              return true;
          } else {
              return false;
          }
      };
      var msg_id = row.id;
      Data.msgs[msg_id] = Data.msgs[msg_id] || {
          picture: row.picture || '',
          link: row.link || '',
          message: row.message || '',
          created_time: new Date(row.created_time)
      };

      if ( filterCreateTime(row.created_time) ) {
        datas = type == 'comment' ? row.comments.data : row.likes.data;
        rankobj = Data.ranks;
        $.each(datas, function (index, d) {
            var user_id;
            if ( type == 'comment' ) {
                user_id = d.from.id;
                if (user_id != window.wallID) {
                  initUser(user_id, d.from.name);
                  userobj = Data.users[user_id];
                  userobj['comments'][msg_id] = d.message;
                  rankobj.comment.remove(user_id);
                  rankobj.comment.push(user_id, Object.keys(userobj['comments']).length);
                }
            } else {
                user_id = d.id;
                if (user_id != window.wallID) {
                  initUser(user_id, d.name);
                  userobj = Data.users[user_id];
                  userobj['likes'].push(msg_id);
                  rankobj.like.remove(user_id);
                  rankobj.like.push(user_id, Object.keys(userobj['likes']).length);
                }
            }

            if (user_id != window.wallID) {
              rankobj.all.remove(user_id);
              rankobj.all.push(user_id, Object.keys(userobj['comments']).length + Object.keys(userobj['likes']).length);
            }
        });
      }
  }

  var joinData = function (datas) {
      $.each(datas, function (index, d) {
          if (typeof d.comments == "object" && d.comments.count != 0) {
              parseCommentLike("comment", d);
          }
          if (typeof d.likes == "object" && d.likes.count != 0) {
              parseCommentLike("like", d);
          }
      });
  }

  var render_user = function (id) {
    if ( typeof Data.users[id] === 'object' ) {
        var prepare = function (type) {
            var result = {
              msgs: Data.msgs
            };
            result.datas = Data.users[id][type];
            result.getLink = function (msg_id) {
                if (Data.msgs[msg_id].message == '' && Data.msgs[msg_id].link != '') {
                    return Data.msgs[msg_id].link;
                } else {
                    return 'http://www.facebook.com/' + msg_id;
                }
            };
            return result;
        }
        $("#page-user").html(T.page_user({id: id, name: Data.users[id].name}));
        $("#user-like").html(T.like(prepare('likes')));
        $("#user-comment").html(T.comment(prepare('comments')));
    }
  };

  var render = function () {
      var parse_result = function (results) {
          var r = [];
          _.each(results, function (result) {
              r.push({
                  id: result.object,
                  name: Data.users[result.object].name,
                  count: result.priority
              });
          });
          return r;
      };
      $("#main-like").html(T.user({users: parse_result(Data.ranks.like.result())}));
      $("#main-comment").html(T.user({users: parse_result(Data.ranks.comment.result())}));
      $("#main-all").html(T.user({users: parse_result(Data.ranks.all.result())}));
  };

  $('#stop-loading').click(function () {
      stop_loading = 1;
  });

  var call_stop = function () {
      loadingCount = 0;
      $('#loading-gif').hide();
      $('#start-loading').show();
      $('#stop-loading').hide();
  }

  var call = function () {
    if (stop_loading) {
        call_stop();
    } else {
        $('#loading-gif').show();
        $('#start-loading').hide();
        $('#stop-loading').show();
        loadingCount++;
        FB.api('/'+ window.wallID +'/posts?fields=message,likes,comments,link,picture&limit='+ grab_limit +'&until=' + until, function(d) {
            try {
              if (typeof d.paging.next !== 'undefined') {
                  until = d.paging.next.match(/until=(\d+)/)[1];
                  if ( !since || until > since ) {
                      call();
                  }
              }
              joinData(d.data);
              render();

              untilDate = new Date(until_this_round * 1000);
              untilDateString = untilDate.getFullYear() + "/" + (untilDate.getMonth()+1) + "/" + untilDate.getDate();
              $('#loading-date').text(untilDateString);
              loadingCount--;

              if (loadingCount == 0) {
                  call_stop();
              }
            } catch (e) {
                call_stop();
            }
        });
    }
  }

  var init = function () {
      FB.api('/me?fields=id,friends', function (d) {
          window.wallID = d.id;
          var f = d.friends.data;
          var $new_wall_source = $('<select id="wall-source"><option value="'+ d.id +'" selected="selected">我</option></select>');
          _.each(f, function (row) {
              Friends.kid[row.id] = row.name;
              Friends.kname[row.name] = row.id;
              $new_wall_source.append('<option value="'+ row.id+ '">'+ row.name +'</option>');
          });
          $('#wall-source').replaceWith($new_wall_source)
          $('#wall-source').chosen();
          $('#setting-form').submit(function () {
              var form_since = $(this).find('input[name="since"]:checked').val();
              window.wallID = $('#wall-source').val();
              init_wall(form_since);
              $('.display-when-render').show();
              return false;
          });
      });
  };

  return {
    init: init,
    render: render,
    render_user: render_user
  }
} ();

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
      window.Router.navigate("");
    }
  },

  user: function(id) {
    $(".page").hide();
    if (isLogin) {
      EFB.render_user(id);
      $("#page-user").show();
    } else {
      $("#page-index").show();
      window.Router.navigate("");
    }
  },

  help: function () {
      $(".page").hide();
      $('#page-help').show();
  }

});
window.Router = new WorkspaceRouter;
Backbone.history.start();

$('#login-btn').click(function () {
  FB.login(function(response) {
   if (response.authResponse) {
      FB.api('/me?fields=id', function (d) {
          window.window.wallID = d.id;
      });

      window.isLogin = true;
      EFB.init();
      window.Router.navigate("#/main");
      $('.display-when-login').show();
   } else {
      console.log('User cancelled login or did not fully authorize.');
   }
  }, {scope: 'read_stream'});
});
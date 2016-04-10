/*
 * Author: Ensky Lin(http://www.ensky.tw/)
 * Licence: http://creativecommons.org/licenses/by-nc-sa/3.0/
 */
define(['plugin/priorityQueue'], function (PriorityQueue) {
	var until, since, until_this_round, grab_limit;
	var loadingCount, stop_loading;
	var Friends = {kid: {}, kname: {}};
	var Data = {};
	var IDs = {wall: null, my: null};
	var T = {
		'page_user': _.template($('#t-page-user').html()),
		'user': _.template($('#t-user').html()),
		'like': _.template($('#t-like').html()),
		'comment': _.template($('#t-comment').html())
	};

	var parseCommentLike = function (type, row) {
		var initUser = function (userid, name) {
			if (Data.users[userid] === undefined) {
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
			if (!created_time) {
				return true;
			}

			var ct = (new Date(created_time.substr(0, 10))) / 1000;
			if (ct >= since) {
				if (ct < until_this_round)
					until_this_round = ct;
				return true;
			} else {
				return false;
			}
		};

		var parseDataWithPaging = function (type, commentOrLikeObject, isCallback) {
			$.each(commentOrLikeObject.data, function (index, d) {
				if ( type == 'comment' ) {
					var user_id = d.from.id;
					var user_name = d.from.name;
				} else {
					var user_id = d.id;
					var user_name = d.name;
				}
				if (user_id != IDs.wall) {
					var rankobj = Data.ranks;
					initUser(user_id, user_name);
					userobj = Data.users[user_id];

					if (type == 'comment')
						userobj[type + 's'][msg_id] = d.message;
					else
						userobj['likes'].push(msg_id);

					rankobj[type].remove(user_id);
					rankobj[type].push(user_id, Object.keys(userobj[type + 's']).length);

					rankobj.all.remove(user_id);
					rankobj.all.push(user_id, Object.keys(userobj['comments']).length + Object.keys(userobj['likes']).length);
				}
			});
			if (commentOrLikeObject.paging.next !== undefined) {
				loadingCount++;
				FB.api(commentOrLikeObject.paging.next, function (nextDataRow) {
					loadingCount--;
					parseDataWithPaging(type, nextDataRow, true);
					if (loadingCount == 0) {
						call_stop();
						render();
					}
				});
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
			parseDataWithPaging(type, row[type + 's']);
		}
	}

	var joinData = function (datas) {
		$.each(datas, function (index, d) {
			if (d.comments !== undefined && d.comments.count != 0) {
				parseCommentLike("comment", d);
			}
			if (d.likes !== undefined && d.likes.count != 0) {
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
		if (Data.ranks === undefined) {
			return;
		}
		var id_to_obj = function (id) {
			if (typeof Data.users[id] !== 'undefined') {
				return {
					id: id,
					name: Data.users[id].name,
					comments: _.size(Data.users[id].comments),
					likes: Data.users[id].likes.length,
					sum: (_.size(Data.users[id].comments) + Data.users[id].likes.length)
				};
			} else {
				return {
					id: id,
					name: Friends.kid[id],
					comments: 0,
					likes: 0,
					sum: 0
				};
			}
		};
		var parse_result = function (results) {
			var r = [];
			_.each(results, function (result) {
				r.push(id_to_obj(result.object));
			});
			return r;
		};
		var generate_dislike = function () {
			if (IDs.wall != IDs.my)
				return [];
			var second_part = [],
				first_part = [],
				all = {};
			_.each(Data.users, function (obj, uid) {
				all[uid] = true;
				// second_part.push(id_to_obj(obj.object));
			});
			// console.log(Friends.kid);

			_.each(Friends.kid, function (name, uid) {
				if (typeof all[uid] === 'undefined') {
					first_part.push(id_to_obj(uid));
				}
			});
			// console.log(first_part);
			return first_part.concat(second_part);
		};
		var d = {
			like: parse_result(Data.ranks.like.result()),
			comment: parse_result(Data.ranks.comment.result()),
			all: parse_result(Data.ranks.all.result()),
			dislike: generate_dislike()
		};
		$("#main-like").html(T.user({users: d.like }));
		$("#main-comment").html(T.user({users: d.comment }));
		$("#main-all").html(T.user({users: d.all }));
		$("#main-dislike").html(T.user({users: d.dislike }));

		$('#like-count').text(d.like.length);
		$('#comment-count').text(d.comment.length);
		$('#all-count').text(d.all.length);
		$('#dislike-count').text(d.dislike.length);

		if (d.dislike.length == 0) {
			$('#main-dislike').parent().hide();
		} else {
			$('#main-dislike').parent().show();
		}
	};

	var call_stop = function () {
		$('#loading-gif').hide();
		$('#start-loading').show();
		$('#stop-loading').hide();
	}

	var call = function () {
	if (stop_loading) {
		call_stop();
	} else {
		loadingCount++;
		$('#loading-gif').show();
		$('#start-loading').hide();
		$('#stop-loading').show();
		FB.api('/'+ IDs.wall +'/posts?fields=message,likes,comments,link,picture&limit='+ grab_limit +'&until=' + until, function(d) {
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
				// 等等再判斷，避免錯誤中止問題
				setTimeout(function () {
				if (loadingCount == 0) {
					call_stop();
				}
				}, 50);
			} catch (e) {
				console.error(e, e.stack);
				call_stop();
			}
		});
	}
	}

	var init = function () {
		$('#stop-loading').click(function () {
			stop_loading = 1;
		});
		FB.api('/me?fields=id,friends', function (d) {
			IDs.wall = d.id;
			IDs.my = d.id;
			var friendsOrLikedPages = d.friends.data;
			var $new_wall_source = $('<select id="wall-source"><option value="'+ d.id +'" selected="selected">我</option></select>');
			_.each(friendsOrLikedPages, function (row) {
				Friends.kid[row.id] = row.name;
				Friends.kname[row.name] = row.id;
			});
			$('#wall-source').replaceWith($new_wall_source)
			$('#wall-source').chosen();
			$('#setting-form').submit(function () {
				var form_since = $(this).find('input[name="since"]:checked').val();
				IDs.wall = $('#wall-source').val();
				startCrawling(form_since);
				$('.display-when-render').show();
				return false;
			});
		});
	};

	var startCrawling = function (form_since) {
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
				since.setTime( since.getTime() - 60*60*24*30 * 1000 );
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
			var query = $('#search-input').val();
			if ( Data.name_id[query] !== undefined ) {
				require(['router'], function (router) {
					router.navigate("#/user/" + Data.name_id[query], {trigger: true});
					$('#search-input').val('');
				});
			}
			return false;
		});
		call();
	};

	return {
		init: init,
		render: render,
		render_user: render_user
	};
});
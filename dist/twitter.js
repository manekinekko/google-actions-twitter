'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Twit = require('twit');
var df = require('dateformat');

// keys set by ./twitter-keys.sh  (not pushed to github ^^)
var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var Twitter = exports.Twitter = function () {
    function Twitter() {
        _classCallCheck(this, Twitter);
    }

    _createClass(Twitter, [{
        key: 'post',
        value: function post(status) {

            status = '\uD83C\uDFE0 ' + status + ' #GoogleHome #Im_A_Bot cc @google';

            return T.post('statuses/update', { status: status }).then(function (data) {
                data.created_at_locale = df(data.created_at, 'h:MMTT');
                return data;
            });
        }

        // WIP: coming next...

    }, {
        key: 'search',
        value: function search(q) {
            return T.get('search/tweets', { q: q, count: 4 });
        }
    }]);

    return Twitter;
}();
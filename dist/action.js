'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _twitter = require('./twitter');

var _googleActionsServer = require('@manekinekko/google-actions-server');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MyAction = function () {
    function MyAction() {
        _classCallCheck(this, MyAction);

        this.twitter = new _twitter.Twitter();

        // create a google action server
        this.agent = new _googleActionsServer.ActionServer();

        this.agent.setGreetings(['Hi, I am your Twitter assistant. What do you want to tweet?', 'Hello, tell me your message and I will published it on Twitter', 'Greetings! Your Twitter assistant here. What is your message?']);

        this.assistant = null;
    }

    // the (default) intent triggered to welcome the user


    _createClass(MyAction, [{
        key: 'welcomeIntent',
        value: function welcomeIntent(assistant) {
            this.assistant = assistant;
            this.agent.randomGreeting();
        }

        // the intent triggered on user's requests

    }, {
        key: 'textIntent',
        value: function textIntent(assistant) {
            var _this = this;

            this.assistant = assistant;

            var userResponse = assistant.getRawInput();
            var state = assistant.data;

            switch (userResponse) {

                case 'see ya':
                case 'bye':
                    assistant.tell('Goodbye!');
                    break;

                case 'nope':
                case 'no':
                case 'cancel':
                    this.agent.ask('Alright. Let\'s try another tweet.');
                    break;

                case 'yes':
                case 'send':
                case 'send it':
                    if (state.lastTweet) {
                        this.twitter.post(state.lastTweet).then(function (data) {

                            _this.agent.ask('\n                                <speak>\n                                    Your tweet was published successfully at <say-as interpret-as="time" format="hms12">' + data.created_at_locale + '</say-as>.\n                                </speak>\n                            ');
                        }, function (error) {
                            console.error(error);
                        });
                    }
                    break;

                default:

                    if (state.lastTweet && state.lastTweet.toString().length > 130) {
                        this.agent.ask('\n                        <speak>I\'m sorry, \n                            Your message does not fit in a tweet. Try something shorter.\n                        </speak>\n                    ', { lastTweet: null });
                    } else {
                        this.agent.ask('\n                        <speak>You said, <say-as>' + userResponse + '</say-as></speak>\n                        <break time="1">\n                        Do you want to send it?\n                    ', { lastTweet: userResponse });
                    }

            }
        }

        // start everything!!

    }, {
        key: 'listen',
        value: function listen() {
            // register intents and start server
            this.agent.welcome(this.welcomeIntent.bind(this));
            this.agent.intent(_googleActionsServer.ActionServer.intent.action.TEXT, this.textIntent.bind(this));
            this.agent.listen();
        }
    }]);

    return MyAction;
}();
// instantiate


new MyAction().listen();
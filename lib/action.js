import { Twitter } from './twitter';
import { ActionServer } from '@manekinekko/google-actions-server';

class MyAction {
    constructor() {

        this.twitter = new Twitter();

        // create a google action server
        this.agent = new ActionServer();

        this.agent.setGreetings([
            'Hi, I am your Twitter assistant. What do you want to tweet?',
            'Hello, tell me your message and I will publish it on Twitter',
            'Greetings! Your Twitter assistant here. What is your message?'
        ]);

        this.assistant = null;
    }

    // the (default) intent triggered to welcome the user
    welcomeIntent(assistant) {
        this.assistant = assistant;
        this.agent.randomGreeting();
    }

    // the intent triggered on user's requests
    textIntent(assistant) {
        this.assistant = assistant;

        const userResponse = assistant.getRawInput();
        const state = assistant.data;

        switch (userResponse) {

            case 'see ya':
            case 'bye':
                assistant.tell('Goodbye!');
                break;

            case 'nope':
            case 'no':
            case 'cancel':
                this.agent.ask(`Alright. Let's try another tweet.`);
                break;

            case 'yes':
            case 'send':
            case 'send it':
                if (state.lastTweet) {
                    this.twitter.post(state.lastTweet)
                        .then(data => {

                            this.agent.ask(`
                                <speak>
                                    Your tweet was published successfully at <say-as interpret-as="time" format="hms12">${data.created_at_locale}</say-as>.
                                </speak>
                            `);

                        }, error => {
                            console.error(error);
                        });
                }
                break;

            default:

                if (state.lastTweet && state.lastTweet.toString().length > 130) {
                    this.agent.ask(`
                        <speak>I'm sorry,
                            Your message does not fit in a tweet. Try something shorter.
                        </speak>
                    `, { lastTweet: null });
                } else {
                    this.agent.ask(`
                        <speak>You said, <say-as>${ userResponse }</say-as></speak>
                        <break time="1">
                        Do you want to send it?
                    `, { lastTweet: userResponse });
                }


        }
    }

    // start everything!!
    listen() {
        // register intents and start server
        this.agent.welcome(this.welcomeIntent.bind(this));
        this.agent.intent(ActionServer.intent.action.TEXT, this.textIntent.bind(this));
        this.agent.listen();
    }
}
// instantiate
(new MyAction()).listen();

const Twit = require('twit')
const df = require('dateformat');

// keys set by ./twitter-keys.sh  (not pushed to github ^^)
const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export class Twitter {
    post(status) {

        status = `🏠 ${status} #GoogleHome #Im_A_Bot cc @google`;

        return T.post('statuses/update', { status })
            .then((data) => {
                data.created_at_locale = df(data.created_at, 'h:MMTT');
                return data;
            });
    }

    // WIP: coming next...
    search(q) {
        return T.get('search/tweets', { q, count: 4 });
    }
}
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const consumerKey = '3MVG94Jqh209Cp4TM9DlknWtsJKhoXO9S6RY6nE_5fxF0i6yhm7t4u.Ck3x_8CJagzlNLkHTMwhr6C106RcKj';
const consumerSecret = 'B642B61C3C7F36AEE09FB2451466C3F7CFF4DA78B2F0C8CDBA4DA68DF8EDC447';
const username = 'amritesh@rkgit.com';
const password = 'rkgit123@5NSggu5yh2Od7rzg8PBw3snuj';

let accessToken = null;
let tokenExpiration = null;

async function getAccessToken() {
    const response = await axios.post('https://login.salesforce.com/services/oauth2/token', null, {
        params: {
            grant_type: 'password',
            client_id: consumerKey,
            client_secret: consumerSecret,
            username: username,
            password: password
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    accessToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000 - 60000; // 1 minute before actual expiration
}

async function ensureAccessToken() {
    if (!accessToken || Date.now() >= tokenExpiration) {
        await getAccessToken();
    }
}

app.post('/create-lead', async (req, res) => {
    try {
        await ensureAccessToken();

        const leadResponse = await axios.post('https://kloudcodey-e-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/lead__c/', req.body, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        });

        res.json(leadResponse.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await getAccessToken();

                const leadResponse = await axios.post('https://kloudcodey-e-dev-ed.develop.my.salesforce.com/services/data/v58.0/sobjects/lead__c/', req.body, {
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'Content-Type': 'application/json'
                    }
                });

                res.json(leadResponse.data);
            } catch (retryError) {
                console.error('Error creating lead after token refresh:', retryError.message);
                res.status(500).json({ error: 'Error creating lead after token refresh' });
            }
        } else {
            console.error('Error creating lead:', error.message);
            res.status(500).json({ error: 'Error creating lead' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

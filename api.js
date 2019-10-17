require('dotenv').config();
const axios = require('axios');
const { googleBaseURL } = require('./config.json');
const apiKey = process.env.APIKEY;
const OAuthToken = process.env.OAUTHTOKEN;

class Api{
    search(message){
        return axios.get(`${googleBaseURL}/search`, {
            params: {
                part: "snippet",
                q: message,
                key: apiKey,
                access_token: OAuthToken,
                type: "video",
                maxResults: 5
            },
            responseType: 'json'
        })
        .catch(error => {
            console.log(error);
        });
    }

    searchById(id){
        axios.get(`${googleBaseURL}/videos`, {
            params: {
                part: "snippet,contentDetails",
                id: id
            },
            responseType: 'json'
        })
        .catch(error => {
            console.log(error);
        });
    }
}

module.exports = new Api();
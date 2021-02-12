import EnvironmentModel from '../model/environment.model'
const environment = {
    prefix: ';',
    googleBaseURL: 'https://www.googleapis.com/youtube/v3',
    token: process.env.TOKEN,
    apiKey: process.env.APIKEY,
    authToken: process.env.OAUTHTOKEN,
}

export { environment }

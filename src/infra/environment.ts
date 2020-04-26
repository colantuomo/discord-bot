import EnvironmentModel from '../model/environment.model';
import * as dotenv from "dotenv";
dotenv.config();

const environment: EnvironmentModel = {
    prefix: ';',
    googleBaseURL: 'https://www.googleapis.com/youtube/v3',
    token: process.env.TOKEN,
    apiKey: process.env.APIKEY,
    authToken: process.env.OAUTHTOKEN
}

export =  environment;
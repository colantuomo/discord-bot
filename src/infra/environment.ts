import { EnvironmentModel } from '../app/models/environment.model';
import * as dotenv from "dotenv";
dotenv.config();

const environment: EnvironmentModel = {
    prefix: ';',
    googleBaseURL: 'https://www.googleapis.com/youtube/v3',
    token: process.env.TOKEN || 'NjM0MTE1NDY3NjY5NDA1NzE4.XqRq0A.AG8UaW76n5R8yzegNL9zJi9GvxA',
    apiKey: process.env.APIKEY || 'AIzaSyBoLIKCggjYcaP9PlYW4LlcyzotSiyJb5Q',
    authToken: process.env.OAUTHTOKEN || '1003473353526-d0kr7rnuj0tcc4080b1ob6dpgtlqdalv.apps.googleusercontent.com',
    showStack: process.env.SHOW_STACK || '',
}

export { environment };

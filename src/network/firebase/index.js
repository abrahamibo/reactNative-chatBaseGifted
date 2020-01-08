import { Platform } from 'react-native';
import firebase from 'react-native-firebase';

// pluck values from your `GoogleService-Info.plist` you created on the firebase console
const iosConfig = {
    clientId: 'x',
    appId: 'x',
    apiKey: 'x',
    databaseURL: 'x',
    storageBucket: 'x',
    messagingSenderId: 'x',
    projectId: 'x',

    // enable persistence by adding the below flag
    persistence: true,
};

// pluck values from your `google-services.json` file you created on the firebase console
const androidConfig = {
    clientId: '302455050686-icu4ad0qika7pmtrsvc61luik52d0jum.apps.googleusercontent.com',
    appId: '1:302455050686:android:23d5663861b1f600d769ef',
    apiKey: 'AIzaSyAu5uML9QpISzdOagkSlrXEf0liEGvX3Og',
    databaseURL: 'https://chat-c02bd.firebaseio.com/',
    storageBucket: 'chat-c02bd.appspot.com',
    messagingSenderId: 'x',
    projectId: 'chat-c02bd',

    // enable persistence by adding the below flag
    persistence: true,
};

const firebaseApp = firebase
    .initializeApp(
        // use platform-specific firebase config
        Platform.OS === 'ios' ? iosConfig : androidConfig,
        // name of this app
        'chat',
    )
    .then(app => console.log('initialized apps ->', firebase.apps));

export default firebaseApp;

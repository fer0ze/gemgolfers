// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
    production: false,
    debugging: false,
    encryptSecretKey: 'prod-gemgolfers',
    uri:'https://gemgolfers-hasura.herokuapp.com/v1/graphql',
    wssuri:'wss://gemgolfers-hasura.herokuapp.com/v1/graphql',
    apiKey: 'fercjqjjpgcngydvqoze',
    firebase: {
        apiKey: "AIzaSyB7DBphKLJephwypk0h20r3aA21YAIJsI4",
        authDomain: "gemtour-4c90a.firebaseapp.com",
        databaseURL: "https://gemtour-4c90a.firebaseio.com",
        projectId: "gemtour-4c90a",
        storageBucket: "gemtour-4c90a.appspot.com",
        messagingSenderId: "335312640323"
      },
      api:"http://localhost:18000",
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

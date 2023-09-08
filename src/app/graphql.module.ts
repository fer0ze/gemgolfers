import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Apollo, ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';

import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
    constructor(apollo: Apollo, httpLink: HttpLink) {
        //console.log('GraphQL');
        const uri = environment.apiUrl;
        //const uri = "https://gemgolfers-hasura.hasura.app/v1/graphql";
        //const uri = 'https://gemgolfers-hasura-stag.herokuapp.com/v1/graphql';
        const wssuri = environment.wsUrl;
        // const wssuri = "wss://gemgolfers-hasura.hasura.app/v1/graphql";
        //const wssuri = 'wss://gemgolfers-hasura-stag.herokuapp.com/v1/graphql';
        //const storedNames = JSON.parse(localStorage.getItem("authToken"));
        //console.log(storedNames.user.refreshToken);

        const authHeader = new HttpHeaders()
            .set(
                'X-Hasura-Admin-Secret',
                environment.apiKey
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`)
            .set('X-Hasura-Role', environment.defaultRole)
            .set('X-Hasura-Allowed-Roles', [environment.defaultRole]);
        //.set('X-Hasura-User-Id', stringify('google-oauth2|107965524172514045377'));

        //console.log(authHeader);
        //console.log(localStorage.getItem('authToken'));
        //console.log(localStorage.getItem('user_id'));
        const http = httpLink.create({ uri, headers: authHeader });

        // create Apollo
        const subscriptionLink = new WebSocketLink({
            uri: wssuri,
            options: {
                reconnect: true,
                connectionParams: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'authToken'
                        )}`,
                        'X-Hasura-Admin-Secret':
                        environment.apiKey,
                        'X-Hasura-Role': environment.defaultRole,
                        'X-Hasura-Allowed-Roles': [environment.defaultRole],
                    },
                },
            },
        });

        interface Definintion {
            kind: string;
            operation?: string;
        }

        const link = split(
            ({ query }) => {
                const { kind, operation }: Definintion =
                    getMainDefinition(query);
                return (
                    kind === 'OperationDefinition' &&
                    operation === 'subscription'
                );
            },
            subscriptionLink, // put subscriptionLink here for websocketlint
            http //httpLink.create({uri, headers: authHeader})
        );

        apollo.create({
            link: link,
            cache: new InMemoryCache(),
        });
    }
}

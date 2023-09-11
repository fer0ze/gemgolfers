import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Apollo, ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';

import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { environment } from 'environments/environment';
//import { stringify } from '@angular/compiler/src/util';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
    constructor(apollo: Apollo, httpLink: HttpLink) {
        const uri = environment.uri;
        const wssuri = environment.wssuri;

        const authHeader = new HttpHeaders()
            .set(
                'X-Hasura-Admin-Secret',
                environment.apiKey
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`)
            .set('X-Hasura-Role', 'admin')
            .set('X-Hasura-Allowed-Roles', ['admin']);
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
                        'X-Hasura-Role': 'admin',
                        'X-Hasura-Allowed-Roles': 'admin',
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

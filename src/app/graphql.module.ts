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
        const uri = environment.apiUrl;
        const wssuri = environment.wsUrl;
        const authHeader = new HttpHeaders()
            .set(
                'X-Hasura-Admin-Secret',
                environment.apiKey
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`)
            .set('X-Hasura-Role', environment.defaultRole)
            .set('X-Hasura-Allowed-Roles', [environment.defaultRole]);
        const http = httpLink.create({ uri, headers: authHeader });

        apollo.create({
            link: http,
            cache: new InMemoryCache(),
        });
    }
}

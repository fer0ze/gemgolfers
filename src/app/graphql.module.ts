import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Apollo, ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { environment } from '../environments/environment';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [HttpClientModule, ApolloModule]
})
export class GraphQLModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const uri = environment.apiUrl;
    let localToken = localStorage.getItem('accessToken') ?? '';
    const authHeader = new HttpHeaders()
      .set(
        'X-Hasura-Admin-Secret',
        environment.apiKey
      )
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${localToken}`)
      .set('X-Hasura-Role', environment.defaultRole)
      .set('X-Hasura-Allowed-Roles', [environment.defaultRole]);
    const http = httpLink.create({ uri, headers: authHeader });

    apollo.create({
      cache: new InMemoryCache(),
      link: http,
    });
  }
}

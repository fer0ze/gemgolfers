import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { HttpHeaders } from '@angular/common/http';

const uri = 'https://gemgolfers-hasura.herokuapp.com/v1alpha1/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const authHeader = new HttpHeaders()
  .set('X-Hasura-Admin-Secret', 'fercjqjjpgcngydvqoze')
  .set('Content-Type', 'application/json')
  .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`)
  .set('X-Hasura-Role', 'admin')
  .set('X-Hasura-Allowed-Roles', ["admin"]);

  return {
    link: httpLink.create({uri, headers: authHeader}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

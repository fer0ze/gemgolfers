import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Constants } from './shared/classes/general';

const uri = environment.apiUrl;

const authContext = (auth: AngularFireAuth) =>
    setContext(async () => {
        const token = await firstValueFrom(auth.idToken.pipe(take(1)));

        if (token) {
            localStorage.setItem('accessToken', token);
            return {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
        }

        return {}; // no auth header → anonymous role
    });


const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            const message = err.message || '';
            if (message.includes('Malformed Authorization header') ||
                message.includes('JWSError') ||
                message.includes('JWT')) {
                localStorage.clear()
                return;
            }
        }
    }
});

export function createApollo(httpLink: HttpLink, auth: AngularFireAuth): ApolloClientOptions<any> {
    return {
        link: ApolloLink.from([
            errorLink,
            authContext(auth),
            httpLink.create({ uri, withCredentials: true })
        ]),
        cache: new InMemoryCache(),
    };
}

@NgModule({
    exports: [ApolloModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink, AngularFireAuth],
        },
    ],
})
export class GraphQLModule { }
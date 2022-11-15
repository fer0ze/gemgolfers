import { Component, ViewEncapsulation } from '@angular/core';
import { Apollo, gql } from 'apollo-angular'

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent
{
    /**
     * Constructor
     */
    constructor(private apollo: Apollo)
    {
        this.apollo
        .watchQuery({
          query: gql`
            {
                player {
                    id
                    firstName
                    lastName
                }
            }
          `
        })
        .valueChanges.subscribe((result: any) => {
            console.log(result);
        })
    }
}

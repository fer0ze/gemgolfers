import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'players',
    templateUrl    : './players.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}

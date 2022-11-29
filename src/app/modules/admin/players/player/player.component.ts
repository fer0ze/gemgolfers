import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FacadeService } from 'app/shared/services/facade.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnInit {
    constructor(private _facadeService: FacadeService) {}
    playersDataSource: MatTableDataSource<any>;
    playersTableColumns: string[] = [
        'Sr',
        'Name',
        'Phone',
        'Email',
        'Membership',
        'Category',
        'Handicap',
        'Status',
        'Edit',
        'Delete',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    count: any = 0;
    showTable: Promise<any>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    async ngOnInit() {
        let data = await this._facadeService.getPlayersListByClub(
            localStorage.getItem('adminClubID')
        );
        this.count = data.AggregateQL.aggregate.totalCount;
        console.log(data);
        this.playersDataSource = new MatTableDataSource(data.player);
        this.playersDataSource.paginator = this.paginator;
        this.playersDataSource.sort = this.sort;
        this.showTable = Promise.resolve(true);
    }
}

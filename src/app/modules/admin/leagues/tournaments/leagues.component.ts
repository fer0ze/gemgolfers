import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { FacadeService } from 'app/shared/services/facade.service';
import { DatePipe } from '@angular/common';
import { Club } from 'app/shared/models/club.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApexOptions } from 'ng-apexcharts';
@Component({
    selector: 'app-club-report',
    templateUrl: './club-report.component.html',
    styleUrls: ['./club-report.component.scss'],
})
export class LeaguesComponent implements OnInit {
    clubs: Club[] = [];
    chartBudgetDistribution: ApexOptions = {};
    chartGithubIssues: ApexOptions = {};
    dataSource: MatTableDataSource<any>;
    displayedColumns = ['id', 'name', 'date', 'members', 'tournament', 'details'];
   

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    showdata: Promise<boolean>;
    constructor(
        private datePipe: DatePipe,
        private location: Router,
        private facadeService: FacadeService,
        private route: ActivatedRoute,
        private apollo: Apollo
    ) {}

    ngOnInit(): void {
        this.fecthData();
    }

    async fecthData() {
        let dataMembers: any[] = [];
        let clubName: any[] = [];
        let clubs = await this.facadeService.getLeagues();
        console.log(clubs);
        this.clubs = clubs.club;
        this.dataSource = new MatTableDataSource(clubs.leagues);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

   
}

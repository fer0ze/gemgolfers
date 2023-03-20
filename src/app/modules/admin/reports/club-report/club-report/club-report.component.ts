import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { FacadeService } from 'app/shared/services/facade.service';
import { DatePipe } from '@angular/common';
import { Club } from 'app/shared/models/club.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
    selector: 'app-club-report',
    templateUrl: './club-report.component.html',
    styleUrls: ['./club-report.component.scss'],
})
export class ClubReportComponent implements OnInit {
    clubs:Club[]=[];

    dataSource: MatTableDataSource<any>;
    displayedColumns = [
        'id',
        'name',
        'email',
        'phone',
        'members',
        'course',
    ];
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(
        private datePipe: DatePipe,
        private location: Router,
        private facadeService: FacadeService,
        private route: ActivatedRoute,
        private apollo: Apollo,
       
    ) {}

    ngOnInit(): void {
         this.fecthData()
    }
    

    async fecthData() {


        let clubs=await this.facadeService.getClubList();
        console.log(clubs);
        this.dataSource=new MatTableDataSource(clubs.club);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
        
    }
}

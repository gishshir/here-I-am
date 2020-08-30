import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Ami } from '../ami.type';
import { AmiService } from '../ami.service';
import { Message } from 'src/app/common/message.type';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AmisFilter } from '../amis.pipe';
import { RelationState } from '../relation/relationinfo.type';

@Component({
  selector: 'app-amis-notifier',
  templateUrl: './amis-notifier.component.html',
  styleUrls: ['./amis-notifier.component.css']
})
export class AmisNotifierComponent implements OnInit, AfterViewInit {

  // material table
  tableColumns: string[] = ['item'];
  dataSource: MatTableDataSource<Ami> = new MatTableDataSource<Ami>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() eventMessage = new EventEmitter<Message>();

  constructor(private amiService: AmiService) { }

  ngAfterViewInit(): void {
    this.chercherListAmis();

  }

  ngOnInit(): void {

  }

  doFilter(pseudoFilter: string): void {

    if (!pseudoFilter) {
      pseudoFilter = "*";
    }
    this.dataSource.filter = pseudoFilter.trim().toLowerCase();
  }
  chercherListAmis(): void {

    console.log("data: " + this.dataSource.data.length);
    if (this.dataSource.data.length == 0) {

      console.log("chercherListAmis()");
      this.amiService.getListeAmis({
        onGetList: (list: Ami[]) => {

          this.dataSource = new MatTableDataSource<Ami>(list);
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = this.amiService.createPseudoFilter(RelationState.open);
          this.dataSource.filter = "*";

        },
        onError: (e: Message) => console.log(e.msg)
      });
    }
  }

  // attention le click est déclenché avant la modification du model
  // a revoir: pas satisfaisant!!
  notifierAmi(ami: Ami) {

    ami.notifier = !ami.notifier;
    this.amiService.updateNotifierAmi(ami, {

      onMessage: (m: Message) => {
        this.eventMessage.emit(m);
        ami.notifier = !ami.notifier;
      },
      onError: (e: Message) => this.eventMessage.emit(e)

    });
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PembelianService } from './pembelian.service'; //service
import { AuthService } from '../../auth.service'; 

import { Pembelian } from './pembelian'; //class
import { PembelianPipe } from './pembelian.pipe';
import { BeliSortPipe } from './beli-sort.pipe';

@Component({
  selector: 'app-pembelian',
  templateUrl: './pembelian.component.html',
  styleUrls: ['./pembelian.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PembelianComponent implements OnInit {
  
    //class Pembelian
    //pembelianList: Pembelian[];
    pembelianList: Pembelian[] = [];
  
    //after import masukkan ke constructor
    constructor(private PembelianService: PembelianService, private AuthService: AuthService) { }
  
    p:number = 1; //utk page
    isValid:boolean = true;
  
    ngOnInit() 
    {
      //template
      //getData dipanggil untuk view list
      var x = this.PembelianService.getData();
      x.snapshotChanges().subscribe(item => 
      {
        this.pembelianList = [];
        item.forEach(element => 
        {
          var y = element.payload.toJSON();
          y["$beliKey"] = element.key;
          this.pembelianList.push(y as Pembelian);
        });
      });
    }
  
    onSubmit(form: NgForm) 
    {
      //fungsi insertEmployee dan update
      if (form.value.$beliKey == null) //jika primary key tidak ada, bikin baru
      {
        //this.PembelianService.insertPembelian(form.value);
        this.PembelianService.insertPembelian(this.PembelianService.selectedPembelian);
      }
      else //jika primary key ada update existing
      {
        //this.PembelianService.updatePembelian(form.value);
        this.PembelianService.updatePembelian(this.PembelianService.selectedPembelian);
      }
      this.resetForm(form);
    }
  
    resetForm(form?: NgForm) 
    {
      //fungsi reset
      if (form != null)
        form.reset();
      this.PembelianService.selectedPembelian = {
        $beliKey: null,
        supName: '',
        product:'',
      }
    }
  
   onDelete($beliKey: string) 
   {
      if (confirm('Are you sure to delete this record ?') == true) {
        this.PembelianService.deletePembelian($beliKey);
      }
   }
  
    onItemClick(prd : Pembelian)
    {
      this.PembelianService.selectedPembelian = Object.assign({}, prd);
    }
  
    //sorting//
    isDesc: boolean = false;
    column: string = "prdName";
    records = this.PembelianService.pembelianList
    direction: number;
    sort(property){
      this.isDesc = !this.isDesc; //change the direction    
      this.column = property;
      this.direction = this.isDesc ? 1 : -1;
      };
  };  
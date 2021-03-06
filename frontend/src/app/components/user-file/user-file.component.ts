import { Component, OnInit } from '@angular/core';
import { TransferService } from '../../services/transfer.service';
import { ViewChild } from '@angular/core';
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-user-file',
  templateUrl: './user-file.component.html',
  styleUrls: ['./user-file.component.css']
})
export class UserFileComponent implements OnInit {

  
  @ViewChild('f') form: any;
  file:File | undefined;
  multipleFilesNames : string[]=[];

  constructor(private transferService : TransferService) { }

  ngOnInit(): void {  }

  validateEmail(email:string) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  onChange(event:any){
    this.file=event.target.files[0];
  }

  onUpload():void{
    let email=this.form.controls.name.controls.email.value;
    if(this.file &&  this.validateEmail(email)){
      this.transferService.upload(this.file,email).subscribe(
      (event:any)=>{
        if (typeof (event) === 'object') { 
          this.multipleFilesNames.push(event.filename);
       }
      }
      );
    }
  }

  onDownload(path : string):void{
    this.transferService.getFile(path).subscribe(data=>{
      let downloadURL=window.URL.createObjectURL(data);
      saveAs(downloadURL, path);//to download
    });
  }
}

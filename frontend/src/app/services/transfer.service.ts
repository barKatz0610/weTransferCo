import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  baseApiUrl='http://localhost:3000/file'
  constructor(private http : HttpClient) { }

  upload(file:File,email:string):Observable<any>{
    const formData= new FormData();
    formData.append("file",file,file.name);
    const url=`${this.baseApiUrl}/${email}`;
    return this.http.post(url,formData);
  }

  getFile(path : string):Observable<any>{
    let url= `${this.baseApiUrl}/${path}`;
    return this.http.get(url,{responseType: `blob`})
  }
}

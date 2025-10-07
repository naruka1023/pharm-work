import { Injectable } from '@angular/core';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor() { }

  downloadContract(baseUrl: string){
    const storage = getStorage();
    getDownloadURL(ref(storage, 'gs://pharm-work.appspot.com/contracts/' + baseUrl))
    .then((url) => {
      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = baseUrl.replace('.pdf', '');
        link.click();
      };
      xhr.open('GET', url);
      xhr.send();
    })
    .catch((error) => {
      // Handle any errors
    })
  }
}

import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { finalize } from "rxjs/operators";

import { realpathSync } from "fs";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFireDatabase } from "@angular/fire/compat/database";
@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
})
export class NewsComponent implements OnInit {
  url: any;
  pic: null;
  upload: null;
  ready: boolean = false;
  isLoading: boolean = false;
  reader = new FileReader();
  storagePath: string = "other/home_golf_news.jpg";

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {}

  ngOnInit() {
    const ref = this.storage.ref(this.storagePath);
    this.url = ref.getDownloadURL();
  }

  onFileChange(event) {
    if (event.target.files) {
      this.upload = event.target.files[0];
      this.reader.readAsDataURL(event.target.files[0]);
      this.reader.onload = (event: any) => {
        this.pic = event.target.result;
        this.ready = true;
      };
    }
  }

  uploadBanner() {
    const file = this.upload;
    const ref = this.storage.ref(this.storagePath);
    const task = ref.put(file);
    this.isLoading = true;

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.url = this.storage.ref(this.storagePath).getDownloadURL();
          this.isLoading = false;
        })
      )
      .subscribe();
  }
}

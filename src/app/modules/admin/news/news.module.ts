import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NewsComponent } from "./news.component";
import { NewsRoutingModule } from "./news-routing.module";
import { FlexLayoutModule } from "@angular/flex-layout";

import { environment } from "../../../../environments/environment";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  imports: [
    CommonModule,
    NewsRoutingModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
  ],
  declarations: [NewsComponent],
  //providers: [{ provide: StorageBucket, useValue: "my-bucket" }],
})
export class NewsModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PicturesPage } from './pictures';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    PicturesPage,
  ],
  imports: [
    IonicPageModule.forChild(PicturesPage),
    PipesModule,
  ],
})
export class PicturesPageModule {}

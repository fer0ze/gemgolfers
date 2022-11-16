import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import {ComponentCanDeactivate} from '../services/component-can-deactivate'

@Injectable({
  providedIn: 'root'
})
export class DirtyCheckGuard implements CanDeactivate<ComponentCanDeactivate> {


  canDeactivate(
    component: ComponentCanDeactivate, 
    currentRoute: ActivatedRouteSnapshot, 
    currentState: RouterStateSnapshot,
    nextStat?: RouterStateSnapshot) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(component.canDeactivate()){
        return true;
      }
      else
      {
        return confirm('You have unsaved score.');
      }
      return component.canDeactivate();
    }
  
}

import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UtilService } from '../../service/util.service';
import { toggleAddressChange } from '../../state/actions/address.actions';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css']
})
export class LocationSelectorComponent {

  constructor(private store:Store, private utilService:UtilService){}

  @Input()parentFormGroup!: FormGroup;
  @Input()formGroupName : string = "Location";
  @Input()col: string = 'col-md-4 col-12';
  genericFormGroup!:FormGroup;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;

  ngOnInit(){
    this.genericFormGroup = this.parentFormGroup.get(this.formGroupName) as FormGroup;
    this.initializeSelector();
  }
  initializeSelector(){
    this.province$ = this.store.select((state: any)=>{
      let result = Object.keys(state.address.list);
      return result
    })
    this.district$ = this.store.select((state: any)=>{
      if(this.genericFormGroup.value.Province === '' || this.genericFormGroup.value.Province === null){
        return [];
      }
      return Object.keys(state.address.list[this.genericFormGroup.value.Province])
    })
    this.section$ = this.store.select((state: any)=>{
      if(this.genericFormGroup.value.District === '' || this.genericFormGroup.value.District === null){
        return [];
      }
      let section: string[] = state.address.list[this.genericFormGroup.value.Province][this.genericFormGroup.value.District].map((section: any)=>section.section);
      return section
    })
  }
  provinceSelected($event:any){
    this.genericFormGroup.patchValue({
        ...this.genericFormGroup.value,
        District:'',
        Section:''
    })
    this.store.dispatch(toggleAddressChange())
  }
  districtSelected($event:any){
    this.genericFormGroup.patchValue({
        ...this.genericFormGroup.value,
        Section:''
    })
    this.store.dispatch(toggleAddressChange())
  }
  sectionSelected($event:any){
    this.store.dispatch(toggleAddressChange())
  }
}

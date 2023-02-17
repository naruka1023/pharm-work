import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toggleAddressChange } from '../../state/actions/address.actions';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css']
})
export class LocationSelectorComponent {

  constructor(private store:Store){}

  @Input()parentFormGroup!: FormGroup;
  @Input()formGroupName : string = "Location";
  @Input()col: string = 'col-3';
  genericFormGroup!:FormGroup;
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;

  ngOnInit(){
    this.genericFormGroup = this.parentFormGroup.get(this.formGroupName) as FormGroup;
    this.province$ = this.store.select((state: any)=>{
      let result = Object.keys(state.address.list);
      return result
    })
    this.district$ = this.store.select((state: any)=>{
      if(this.genericFormGroup.value.Province === ''){
        return [];
      }
      return Object.keys(state.address.list[this.genericFormGroup.value.Province])
    })
    this.section$ = this.store.select((state: any)=>{
      if(this.genericFormGroup.value.District === ''){
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

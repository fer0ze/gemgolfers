import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { generateGemId, UniqueIdGenerator } from 'app/shared/classes/general';
import { Club } from 'app/shared/models/club.model';
import { PlayerCategory } from 'app/shared/models/player.model';
import { FacadeService } from 'app/shared/services/facade.service';
import {
  map,
  Observable,
  startWith,
} from 'rxjs';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {

  signUpForm: FormGroup;
  playerCategories: PlayerCategory[] = [];
  filteredClubOptions: Observable<Club[]>;
  golfClubs: Club[] = [];
  duplicatePlayers: any[] = [];
  constructor(
    private _facadeService: FacadeService,
  ) { }

  async ngOnInit() {

    this.createForm();
    this.playerCategories = this._facadeService.getPlayerCategories();
    let dataClubs = await this._facadeService.getClubList();
    this.golfClubs = dataClubs.club;

    this.filteredClubOptions = this.signUpForm
      .get('club')!
      .valueChanges.pipe(
        startWith(''),
        map((value) =>
          typeof value === 'string' ? value : value ? value.name : ''
        ),
        map((name) => (name ? this._filter(name) : this.golfClubs))
      );
    console.log(this.playerCategories);
  }
  createForm() {
    this.signUpForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      membership: new FormControl(''),
      category: new FormControl('', [Validators.required]),
      handicap: new FormControl('0', [Validators.required]),
      club: new FormControl('',
        [Validators.required]
      ),
    });

  }
  displayFn(club: Club): string {
    return typeof club === 'string' ? club : club ? club.name : '';
  }
  private _filter(value: string): Club[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.golfClubs.filter(
        (option) => option.name.toLowerCase().indexOf(filterValue) === 0
      );
    }

    return this.golfClubs;
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.signUpForm.controls[controlName].hasError(errorName);
  };
  async signUp() {
    let exist: any = [];
    let clubMember: any[] = [];
    let signUpPerson = this.signUpForm.getRawValue();
    if (signUpPerson.membership) {
      exist = await this._facadeService.getPlayerByMembershipNumber(
        signUpPerson.membershipNumber.toString()
      );
      if (exist.length > 0) {
        this.duplicatePlayers.push(signUpPerson);
        //continue;
      }
    }


    if (signUpPerson.phone && exist.length == 0) {
      // this.logger.log(signUpPerson.phone);
      console.log(signUpPerson.phone);
      let phone;
      if (signUpPerson.phone.toString().indexOf("+92") === 0) {
        phone = signUpPerson.phone.toString();
      } else if (signUpPerson.phone.toString().indexOf("0") === 0) {
        phone = signUpPerson.phone.toString().replace(0, "+92");
      } else if (signUpPerson.phone.toString().indexOf("3") === 0) {
        phone = "+92" + signUpPerson.phone.toString();
      }
      console.log(phone);

      exist = await this._facadeService.getPlayerByPhone(phone);
      // signUpPerson.phone.toString().indexOf("+") !== -1
      // ? signUpPerson.phone.toString()
      // : "+" + signUpPerson.phone.toString()
      if (exist.length > 0) {
        this.duplicatePlayers.push(signUpPerson);
        //continue;
      }
    }

    if (signUpPerson.email && exist.length == 0) {
      exist = await this._facadeService.getPlayerByEmail(signUpPerson.email.toString());

      if (exist.length > 0) {
        // this.logger.log("email yes");
        console.log("email Yes");

        this.duplicatePlayers.push(signUpPerson);
        //continue;
      }
    }
    let UniqueId: string =
      exist && exist.length > 0
        ? exist[0].id
        : UniqueIdGenerator.generate();


    let member: any = {
      clubId: signUpPerson.club.id,
      playerId: UniqueId,
    };

    clubMember.push(member);
    //}
   
    if(exist.length)
    {
      
    }
    let player: any = {
      id: UniqueId,
      adminClubId: null,
      firebaseUid: null,
      fcmToken: null,
      gemId: generateGemId.generate(UniqueId),
      firstName:signUpPerson.firstName,
      lastName:signUpPerson.lastName,
      gender:signUpPerson.gender ?signUpPerson.gender : null,
      dob:signUpPerson.dob ?signUpPerson.dob : null,
      picture:signUpPerson.picture ?signUpPerson.picture : null,
      email:signUpPerson.email ?signUpPerson.email : null,
      phone:signUpPerson.phone ?signUpPerson.phone : null,
      playerCategory:signUpPerson.category ?signUpPerson.category : null,
      handicap:signUpPerson.handicap ?signUpPerson.handicap : 0,
      online: false,
      countryCode:signUpPerson.code ?signUpPerson.code : null,
      extraData:signUpPerson.extra ?signUpPerson.extra : null,
      membershipNumber:signUpPerson.membershipNumber.toString(),
      userRole: 3,
      membership: null,
    };


  }
}

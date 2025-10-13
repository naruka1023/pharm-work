import { Component, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { Store } from '@ngrx/store';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { FirebaseService } from 'src/app/service/firebase.service';
declare var window: any;

@Component({
  selector: 'app-banner-buy',
  templateUrl: './banner-buy.component.html',
  styleUrls: ['./banner-buy.component.css'],
})
export class BannerBuyComponent {
  constructor(
    private store: Store,
    private profileService: UserServiceService,
    private firebaseService: FirebaseService
  ) {}
  private storage: FirebaseStorage = this.firebaseService.storage;
  private db: Firestore = this.firebaseService.firestore;
  currentUserUID!: string;
  bannerLimitLoadingFlag: boolean = true;
  bannerUploadFlag: boolean = false;
  uploadLoading: boolean = false;
  subscriptionFlag: any[] = [];
  dimensionFlag: boolean = true;
  bannersFlag: {
    [key: string]: boolean;
  } = {};
  placeholderImage = 'assets/emptybanner/emptyBannerBig.png';
  file: any = undefined;
  productPackage: string = '';
  priceID: string = '';
  uploadModal: any;
  packageDimensions: { [key: string]: string } = {
    A1: '1200 * 600',
    A2: '1350 * 270',
    A3: '1350 * 270',
    A4: '1350 * 270',
  };
  packageList: {
    name: string;
    description: string;
    priceID: string;
    price: number;
  }[] = [];
  breakingPoint = {
    1400: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 2.5,
    },
    992: {
      slidesPerView: 2,
    },
    625: {
      slidesPerView: 1.5,
    },
  };
  ngOnInit() {
    this.uploadModal = new window.bootstrap.Modal(
      document.getElementById('uploadModal')
    );
    this.store
      .select((state: any) => {
        return state.jobpost.BannersFlag;
      })
      .subscribe((bannersFlag) => {
        this.bannersFlag = bannersFlag;
        console.log(this.bannersFlag);
      });
    this.store
      .select((state: any) => {
        return state.user.packages;
      })
      .subscribe((packages) => {
        this.packageList = [];
        const sortAlphaNum = (a: any, b: any) =>
          a.localeCompare(b, 'en', { numeric: true });
        Object.keys(packages)
          .sort(sortAlphaNum)
          .forEach((key) => {
            this.packageList.push(packages[key]);
          });
        const b2 = this.packageList.splice(this.packageList.length - 1, 1);
        const b1 = this.packageList.splice(this.packageList.length - 1, 1);
        const a1 = this.packageList.splice(0, 1);
        this.packageList = a1.concat(b1).concat(b2).concat(this.packageList);
      });
    this.store
      .select((state: any) => {
        return state.user.subscriptions;
      })
      .subscribe((subscription) => {
        this.subscriptionFlag = subscription;
      });
    this.store
      .select((state: any) => {
        return state.user.uid;
      })
      .subscribe((uid) => {
        this.currentUserUID = uid;
      });
    this.scrollUp();
  }

  subExists(sub: string) {
    return this.subscriptionFlag.includes(sub) || this.bannersFlag[sub];
  }

  buttonName(sub: string) {
    return this.bannersFlag[sub] ? 'SOLD OUT' : 'สมัครแพ็คเกจแล้ว';
  }

  uploadImage() {
    this.bannerUploadFlag = true;
    const link = document.getElementById('imageLink') as any;
    let linkValue = link?.value;
    uploadBytes(
      ref(
        this.storage,
        'users/' + this.currentUserUID + '/banner/' + this.productPackage
      ),
      this.file
    ).then(() => {
      getDownloadURL(
        ref(
          this.storage,
          'users/' + this.currentUserUID + '/banner/' + this.productPackage
        )
      ).then((url: string) => {
        addDoc(
          collection(
            this.db,
            'users',
            this.currentUserUID,
            'checkout_sessions'
          ),
          {
            price: this.priceID,
            metadata: {
              uid: url,
              package: this.productPackage,
              priceID: this.priceID,
              link: linkValue,
            },
            allow_promotion_codes: true,
            locale: 'th',
            success_url: window.location.origin + '/success-checkout',
            cancel_url: window.location.origin + '/cancel-checkout',
          }
        ).then((value) => {
          onSnapshot(
            doc(
              this.db,
              'users',
              this.currentUserUID,
              'checkout_sessions',
              value.id
            ),
            (session) => {
              const { error, url } = session.data() as any;
              if (error) {
                // Show an error to your customer and
                // inspect your Cloud Function logs in the Firebase console.
                alert(`An error occured: ${error.message}`);
              }
              if (url) {
                // We have a Stripe Checkout URL, let's redirect.
                this.bannerUploadFlag = false;
                this.uploadModal.hide();
                window.location.assign(url);
              }
            }
          );
        });
      });
    });
  }

  get fileFlag() {
    let flag = this.file == null || this.dimensionFlag == false;
    return flag;
  }
  loadFile(event: any) {
    if (event !== undefined) {
      const myImg = document.querySelector('#innerPhoto')!;
      myImg.setAttribute('style', 'width:unset');
      var currWidth = event.srcElement.clientWidth;
      var currHeight = event.srcElement.clientHeight;
      if (currWidth !== 0 && currHeight !== 0) {
        let dimensions =
          this.packageDimensions[this.productPackage].split(' * ');
        this.dimensionFlag =
          Number(dimensions[0]) == currWidth &&
          Number(dimensions[1]) == currHeight;
      }
      myImg.setAttribute(
        'style',
        'width:-webkit-fill-available; width:-moz-available'
      );
    }
  }
  imageChosen(event: any) {
    if (event.target.files.length > 0) {
      this.placeholderImage = (window.URL ? URL : webkitURL).createObjectURL(
        event.target.files[0]
      );
      this.file = event.target.files[0];
    } else {
      this.placeholderImage = 'assets/' + this.productPackage + '.png';
    }
  }

  buyPackage(price: string, productPackage: string) {
    this.priceID = price;
    this.productPackage = productPackage;
    this.bannerLimitLoadingFlag = false;
    this.profileService.getLimitBanner().then(() => {
      this.bannerLimitLoadingFlag = true;
      if (!this.bannersFlag[productPackage]) {
        if (productPackage == 'B1' || productPackage == 'B2') {
          this.uploadLoading = true;
          addDoc(
            collection(
              this.db,
              'users',
              this.currentUserUID,
              'checkout_sessions'
            ),
            {
              price: price,
              metadata: {
                uid: this.currentUserUID,
                package: productPackage,
                priceID: price,
              },
              allow_promotion_codes: true,
              locale: 'th',
              success_url: window.location.origin + '/success-checkout',
              cancel_url: window.location.origin + '/cancel-checkout',
            }
          ).then((value) => {
            onSnapshot(
              doc(
                this.db,
                'users',
                this.currentUserUID,
                'checkout_sessions',
                value.id
              ),
              (session) => {
                const { error, url } = session.data() as any;
                if (error) {
                  // Show an error to your customer and
                  // inspect your Cloud Function logs in the Firebase console.
                  alert(`An error occured: ${error.message}`);
                }
                if (url) {
                  // We have a Stripe Checkout URL, let's redirect.
                  this.uploadLoading = false;
                  window.location.assign(url);
                }
              }
            );
          });
        } else {
          let form: any = document.getElementById('imageUploadForm');
          this.file = null;
          form.reset();
          this.dimensionFlag = true;
          this.placeholderImage = 'assets/' + productPackage + '.png';
          this.uploadModal.show();
        }
      }
    });
  }
  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }
}

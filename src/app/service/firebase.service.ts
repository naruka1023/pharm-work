// firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { SsrService } from './ssr.service';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  public app: FirebaseApp;
  public firestore: Firestore;
  public auth: Auth;
  public storage: FirebaseStorage;
  public messaging!: Messaging;

  constructor(private ssrService: SsrService) {
    // Initialize Firebase app once
    this.app = initializeApp(environment.firebase);

    // Initialize modular Firebase services
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
    // Messaging only works in browser (avoid SSR crash)
    if (this.ssrService.isBrowser()) {
      this.messaging = getMessaging(this.app);
    }
  }
}

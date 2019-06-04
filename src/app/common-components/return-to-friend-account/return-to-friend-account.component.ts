import { Component, OnInit } from '@angular/core';
import {User} from '../../profile/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UserAccountService} from '../../profile/user-account.service';
import {RegistrationService} from '../../registration/registration.service';
import {LoginService} from '../../login/login.service';
import {SendingTokensService} from '../sending-tokens/sending-tokens.service';

@Component({
  selector: 'app-return-to-friend-account',
  templateUrl: './return-to-friend-account.component.html',
  styleUrls: ['./return-to-friend-account.component.scss']
})
export class ReturnToFriendAccountComponent implements OnInit {
// RETURN TO FRIEND TOKEN
  ifUserForMatchingToken;
  retrieveDataResolver;
  isLoginError: boolean;
  returnUrl: string;

  constructor(private loginService: LoginService,
              private registrationService: RegistrationService,
              private userAccountService: UserAccountService,
              private sendingTokensService: SendingTokensService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // RETURN TO FRIEND ACCOUNT
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/match';
    this.ifUserForMatchingToken = this.userAccountService.isUserForMatchingToken();
  }

// RETURN TO FRIEND ACCOUNT
  returnToFriendAccount() {
    console.log('RETURN TO FRIEND ACCOUNT');
    this.returnToFriendAccountPromise().then(() => { this.aftereturnToFriendAccountActions(); });
  }

  private returnToFriendAccountPromise(): Promise<any> {
    return new Promise((resolve) => {
      this.retrieveDataResolver = resolve;
      this.returnToFriendAccountServer();
    });
  }

  private returnToFriendAccountServer() {
    this.loginService.returnToFriendAccount()
      .subscribe(userAccount => {
          this.loginService.logout();
          this.loginService.setUserAccount(userAccount.body);
          this.loginService.saveTokenToLocalStorage(userAccount);
          const user: User = userAccount.body.user;
          this.registrationService.setIsAnonimRegistered(user);
          this.registrationService.setIsRegistered(user);
          this.loginService.setIsValueCompatibilityTestPassed(userAccount.body);
          this.sendingTokensService.setFriendsTokens(userAccount.body.inviteTokens);
          this.retrieveDataResolver();
        },
        error => {
          this.isLoginError = true;
          // login failed so display error

        });
  }

  private aftereturnToFriendAccountActions() {
    this.router.navigateByUrl(this.returnUrl);
    location.reload();
  }

}

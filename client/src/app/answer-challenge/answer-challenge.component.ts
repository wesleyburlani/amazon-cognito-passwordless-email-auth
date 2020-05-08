// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Component, OnInit, OnDestroy, AfterContentInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-answer-challenge',
  templateUrl: './answer-challenge.component.html',
  styleUrls: ['./answer-challenge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerChallengeComponent implements OnInit, OnDestroy, AfterContentInit {

  oam_token = new FormControl('');
  @ViewChild('digit1el') digit1element: ElementRef;

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();

  private busy_ = new BehaviorSubject(false);
  public busy = this.busy_.asObservable();

  private allSubscriptions = new Subscription();

  private email_ = new BehaviorSubject('');
  public email = this.email_.asObservable();

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {

    // Get e-mail address the code was sent to
    // It is a public challenge parameter so let's try it that way
    this.auth.getPublicChallengeParameters()
      .then(param => this.email_.next(param.email));

  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

  ngAfterContentInit() {
    this.digit1element.nativeElement.focus();
  }

  public async submit() {
    try {
      this.errorMessage_.next('');
      this.busy_.next(true);
      const answer = (this[`oam_token`] as FormControl).value
      const loginSucceeded = await this.auth.answerCustomChallenge(answer);
      if (loginSucceeded) {
        this.router.navigate(['/private']);
      } else {
        this.errorMessage_.next('That\'s not the right code');
      }
    } catch (err) {
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }
}

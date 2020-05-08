"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');

exports.handler = (event, context, callback) => {
    console.log('Validating OAM Token on OAM');
    console.log(event.request.challengeAnswer);
      var headers = {
        'Cookie': event.request.challengeAnswer,
      };
      var options = {
        url: 'https://consultoria-stg1.natura.com.br/statuslogincogn/index.html',
        method: 'GET',
        headers: headers,
        strictSSL: false,
        insecure: true,
        followRedirect: false,
        followAllRedirects: false
      };
    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        event.response.answerCorrect = true;
        console.log('OAM Token validated');
        callback(null, event);
      } else {
        event.response.answerCorrect = false;
        console.log('OAM Token invalid');
        callback(null, event);
      }
    });
};

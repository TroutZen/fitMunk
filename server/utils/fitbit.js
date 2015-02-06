var FitbitStrategy = require('passport-fitbit').Strategy;
var FitbitApiClient = require('fitbit-node');
var passport = require('passport');
var Users =require('../users/controller.js');

module.exports = exports = {
  fitbitStrategy: new FitbitStrategy({
      consumerKey: process.env.CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
      callbackURL: '/auth/fitbit/callback',
      userAuthorizationURL: 'https://www.fitbit.com/oauth/authorize'
    }, function (token, tokenSecret, profile, done) {

      console.log('Devins Profile Id', profile.id);
       
      //after oath login call this success handler
          //add user to db
          Users.addUser(token, tokenSecret, profile, function(d){
            //this line waits for 26 to finish
            exports.getStats(token, tokenSecret).then(function(){
              done(null, d);
            }); 
            // exports.getStats(profile.id, token, tokenSecret).then(function() { 
            //   //done tells the program you are done and want to go to the next step
            //   console.log(d)
            //   done(null, d); 
            // });
          })

        }),

  getStats: function (token, tokenSecret) {
    console.log('Attempting to get fitbit stats');
    var client = new FitbitApiClient(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);
    var DevinsUserId = '36SQBB';
    //creates the request to get activites json from fitbit
    // '/activities/steps/date/2015-02-01/2015-02-05/.json'
    return client.requestResource('/activities/steps/date/2015-02-01/2015-02-05.json', 'GET', token, tokenSecret, DevinsUserId).then(function (data) {  
        //success handler for req, return the promise
        console.log('fitbit data', data);
        // Users.addUserStats(userID,data[0]);
      }, function (err) {
        console.log('[Error] Attempting to fetch steps data from fitbit API', err);
      });
  }

  // Currently migrating the API request to the client side
  // getStepsBetweenDates: function(req, res, token, secret, startDate, endDate) {
  //   var client = new FitbitApiClient(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);
  //   // the request body should contain an array of users with their userID
  //   // need to confirm this is being sent on the client side (will it be a post or a get??)
  //   var users = req.body.users; // this will be an array of userIds [ASHJDGJH, 123AUSDJ, etc]

  //   var getUserData = function(userId) {
  //     // this might not be the correct way of doing it...might have to pass userId as a parameter: https://www.npmjs.com/package/fitbit-node
  //     client.requestResource('/1/user/' + userId + '/activities/steps/date/' + startDate + '/' + endDate + '.json', 'GET', token, secret).
  //       then(function(data){
  //         res.send(data);
  //       }).
  //       catch(function(error){
  //         res.send(new Error('[Error] Getting Fitbit Data for Users'));
  //       });
  //   }
  // }
};

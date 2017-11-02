var APP_ID = undefined; // replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var CLIENT_ID     = '3MVG9M6Iz6p_Vt2wn4hwnXnRv.1XpOb._mn0cBUGMnOlcbInybYdbBu4XKxwwt8HTp8ixv0hHa0u28zp1hoHE';
var CLIENT_SECRET = '4609070234326421070';
var USERNAME      = 'salesforceoperations@paylinkdirect.com';
var PASSWORD      = 'Paylink321!!!tXLnJXCMDo0nDWr7CQ5ZjdFPD';
var CALLBACK_URL  = 'http://localhost:3000j/oauth/_callback';
var ENVIRONMENT   = 'sandbox';

var AlexaSkill = require('./AlexaSkill');
var nforce     = require('nforce');
var _          = require('lodash');
var moment     = require('moment-timezone');
var pluralize  = require('pluralize');
var codeParser = require('./CodeParser');

var Salesforce = function(){
  AlexaSkill.call(this, APP_ID);
};

var org = nforce.createConnection({
  clientId:     CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri:  CALLBACK_URL,
  mode:         'single',
  environment:  ENVIRONMENT
});

// Extend AlexaSkill
Salesforce.prototype = Object.create(AlexaSkill.prototype);
Salesforce.prototype.constructor = Salesforce;

Salesforce.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Salesforce onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Salesforce.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Salesforce onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Salesforce.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Salesforce onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Salesforce.prototype.intentHandlers = {
  SearchAccountIntent: function(intent, session, response){
    handleSearchAccountIntent(response);
  },
  ParseCodeIntent: function(intent, session, response){
    handleParseCodeIntent(intent, session, response);
  }
};

function handleSearchAccountIntent(response){
  var query = 'SELECT name, id FROM Account LIMIT 1';

  org.authenticate({ username: USERNAME, password: PASSWORD }).then(function(){
    return org.query({ query: query })
  }).then(function(results) {
    var speechOutput = "Sorry, There are no Accounts in your system.";
    if (results.records.length > 0) {
      var acc = results.records[0];
      speechOutput = "I found an Account named: " + acc.get('Name');
      //speechOutput = "I found an Account named: " + acc.get('Name');
    }
    response.tellWithCard(speechOutput, "Salesforce", speechOutput);
  }).error(function(err) {
    var errorOutput = "Darn, there was a Salesforce problem, sorry";
    response.tell(errorOutput, "Salesforce", errorOutput);
  });
}

function handleParseCodeIntent(intent, session, response){
  var speechOutput = "The Code Snipit record was created successfully!";
  var codeString = codeParser.parseString(intent.slots.codeString.value);
  response.tellWithCard(speechOutput, "Salesforce", speechOutput);

  var obj = nforce.createSObject('Code_Snipit__c');
  obj.set('Code__c', codeString);

  org.authenticate({username: USERNAME, password: PASSWORD}).then(function(){
    return org.insert({sobject: obj})
  }).then(function(results){
    if(results.success){
      response.tellWithCard(speechOutput, "Salesforce", speechOutput);
    } else{
      speechOutput = "Darn, there was an issue with salesforce.";
      response.tellWithCard(speechOutput, "Salesforce", speechOutput);
    }
  }).error(function(err){
    var errorOutput = 'Darn, there was a Salesforce problem, sorry';
    response.tell(errorOutput, "Salesforce", errorOutput);
  });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Salesforce skill.
    var salesforce = new Salesforce();
    salesforce.execute(event, context);
};

/*
  This class is used to parse the the spoken string that is sent to
  it by Amazon Echo. It will take the spoken words and turn them
  into code for the salesforce system.
*/

module.exports.parseString = function(stringSpoken) {

  var codeSnipit = "Could not parse";
  var Spoken = stringSpoken.toString();

  if(Spoken.indexOf("if") > -1){
    codeSnipit = if_method(Spoken);
  }
  else if(Spoken.indexOf("for") > -1){
    codeSnipit = for_method(Spoken);
  }
  else if(Spoken.indexOf("while") > -1){
    codeSnipit = "while(){}";
  }
  else if(Spoken.indexOf("do") > -1){
    codeSnipit = "do{}while()";
  }

  return codeSnipit;
}

function if_method(spokenString){
  var stringArray = spokenString.split(" ");
  var returnString = "if(";

  for(var x = 1; x < stringArray.length; x++ ){
    returnString += symbolParse(stringArray[x]);
  }

  returnString += "){}";

  if(returnString.indexOf("!=") == -1){
    returnString = returnString.replace("=", "==");
  }

  return returnString;
}

function for_method(spokenString){

}

function while_method(spokenString){

}

function do_method(spokenString){

}

function symbolParse(symbol){
  if(symbol == "greater"){
    return ">";
  }
  else if(symbol == "lesser"){
    return "<";
  }
  else if(symbol == "equal"){
    return "=";
  }
  else if(symbol == "and"){
    return "&&";
  }
  else if(symbol == "or"){
    return "||";
  }
  else if(symbol == "dot"){
    return ".";
  }
  else if(symbol == "not"){
    return "!";
  }
  else if(symbol == "in"){
    return ":";
  }
  else if(symbol == "is"){
    return "";
  }
  else if(symbol == "than"){
    return "";
  }
  else if(symbol == "where"){
    return "";
  }
  else if(symbol == "to"){
    return "";
  }
  else{
    return symbol;
  }
}

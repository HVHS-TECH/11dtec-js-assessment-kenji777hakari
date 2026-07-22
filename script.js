 /*********************************************************
variable
  **************************************************/

var userName;
var age;
var locations;
var food;

/***************************arrays*************************************/

let food = ["Food 1","Food 2, Food 3"]

/**********************************************************
 MAIN CODE
 ********************************************/
 userName = prompt("Welcome to Tungs Tacos and Sahurs Salsas  please enter your name?");
alert("your name is " + userName);

age = prompt("Before continuing to Triple T's Pizza Palza please type in your age");
 locations = prompt("Before continuing further please type in your location");
alert("Hi " + userName +  ", you are "+ age +". You are currently at "+ locations +". welcome to Triple T's Pizza Plaza.");
alert("What would you like to order?")
food = prompt ("Menu: Brr Brr PataBurrito, Sahur Pizza 2, Tralalaro TralaTacos 3, . type the number of the food you want to order  ")
alert("you have ordered + food +" )
 /*********************************************************
variable
  **************************************************/

var userName;
var age;
var locations;
var food;

/***************************arrays*************************************/

/***************************ifs*******************************/

if (food == 1){"this cost $5"}

/********************************************************* */
let Menu = ["Brr Brr PataBurrito 1","Sahur Pizza 2, Tralalaro TralaTacos 3"]

/**********************************************************
 MAIN CODE
 ********************************************/
 userName = prompt("Welcome to Tungs Tacos and Sahurs Salsas  please enter your name?");
alert("your name is " + userName);

age = prompt("Before continuing to Triple T's Pizza Palza please type in your age");
 locations = prompt("Before continuing further please type in your location");
alert("Hi " + userName +  ", you are "+ age +". You are currently at "+ locations +". welcome to Triple T's Pizza Plaza.");
alert("What would you like to order?")
food = prompt ("Menu:" + Menu) 
alert("you have ordered" + food );
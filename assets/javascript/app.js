$(document).ready(function(){


  var config = {
    apiKey: "AIzaSyAt3zdnAnpGFGM1ayyI7IKGp16PJbpOJOY",
    authDomain: "trainscheduler-cb6b8.firebaseapp.com",
    databaseURL: "https://trainscheduler-cb6b8.firebaseio.com",
    projectId: "trainscheduler-cb6b8",
    storageBucket: "trainscheduler-cb6b8.appspot.com",
    messagingSenderId: "510084220310"
  };
 
  firebase.initializeApp(config);

    var trainData = firebase.database();

    //button to add trains
    $("#addTrainBtn").on("click", function(){

        //grabs user input and assigns variables

        var trainName = $('#nameInput').val().trim();
        var destination = $('#destinationInput').val().trim();
        var  trainTimeInput= $('#timeInput').val().trim();
        var frequencyInput = $('#frequencyInput').val().trim();

        

        //test
        console.log(trainName)

        var newTrain = {
            name: trainName,
            destination: destination,
            trainTime: trainTimeInput,
            frequency: frequencyInput,

        }

        //pushing to Firebase
        trainData.ref("/train").push(newTrain);

       


        //clear text boxes
        $('#nameInput').val("");
        $('#destinationInput').val("");
        $('#timeInput').val("");
        $('#frequencyInput').val("");

        return false;

});

trainData.ref("/train").on("child_added", function(childSnapshot, prevChildKey){

    var firebaseName = childSnapshot.val().name;
    var firebaseDestination = childSnapshot.val().destination;
    var firebaseTimeInput = childSnapshot.val().trainTime;
    var firebaseFrequency = childSnapshot.val().frequency;
    var timeArray = firebaseTimeInput.split(":");

    var hours = timeArray[0];
    var mins = timeArray[1];

    console.log(hours)
    console.log(mins)

    var trainTime = moment().hours(hours).minutes(mins);

    var maxMoment = moment.max(moment(), trainTime);

    var tArrival;
    var tMinutes;

    if(maxMoment === trainTime){
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    }
    else{
        var timeDifference = moment().diff(trainTime, "minutes");
        var remainingMinutes = timeDifference % firebaseFrequency;

        tMinutes = firebaseFrequency - remainingMinutes;

        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }



var diffTime = moment().diff(moment.unix(firebaseTimeInput), "minutes");
var timeLeft = moment().diff(moment.unix(firebaseTimeInput), "minutes") % firebaseFrequency ;

var minutes = firebaseFrequency - timeLeft;

var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A")
 
//test


    //append info to table
    $("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseDestination + "</td><td>"+ firebaseFrequency + "</td><td>"
     + tArrival  + "</td><td>" + tMinutes + "</td></tr>");
})





trainData.ref("/newTrain").on("child_added", function(childSnapshot){
    console.log(childSnapshot.val())
})



    
})

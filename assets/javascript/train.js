$(document).ready(function(){

var database; 
var trainCount=0;
// Config needed to initialize Firebase
var config = {
        apiKey: "AIzaSyCbmHrPPhiCuTuKBcLkWJcarLZKapvWNPU",
        authDomain: "traintime-8a034.firebaseapp.com",
        databaseURL: "https://traintime-8a034.firebaseio.com",
        projectId: "traintime-8a034",
        storageBucket: "traintime-8a034.appspot.com",
        messagingSenderId: "315737940391"
    };

//And initialize the database
firebase.initializeApp(config);
database = firebase.database();
// foo = database.getInstance().getReference().child("config.projectId");
    
    
    $("#addTrain").on("click", function(event) {

      // When user adds a train, store the train info in the database and display it in the trainSchedule

      event.preventDefault(); // Don't reset the page!

      // Get the train info from the form
      var trainName        = $("#trainName").val().trim();
      var trainDestination = $("#trainDestination").val().trim();
      var firstTrain       = $("#firstTrain").val().trim();
      var trainFrequency   = $("#trainFrequency").val().trim();

      // Push that train info!
      // The dateAdded value gives us a way to retrieve the entries by the time/date they were entered.
      database.ref().push({
        trainName:        trainName,
        trainDestination: trainDestination,
        firstTrain:       firstTrain,
        trainFrequency:   trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      }, function(error)
      {
        var firstTrainConverted = moment(firstTrain,"hh:mm").subtract(1,"years");
        console.log("firstTrainConverted time "+firstTrainConverted);
        var currentTime = moment();
        console.log("currentTime "+currentTime);
        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("diff time is "+diffTime);
        var tRemainder = diffTime%trainFrequency;
        var minutesAway = trainFrequency-tRemainder;
        var nextTrain = moment().add(minutesAway,"minutes");
        var arrivalTime= moment(nextTrain).format("hh:mm");

      });
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();
      trainCount++;

      // Console.loging the last train's data
      console.log(sv.trainName);
      console.log(sv.trainDestination);
      console.log(sv.firstTrain);
      console.log(sv.trainFrequency);
      console.log(trainCount);

      // Build a new train schedule table row
      var trainNum = "trainNum"+trainCount; 
    
      var tName   = "<td>"+sv.trainName+"</td>";
      var tDest   = "<td>"+sv.trainDestination+"</td>";
      var tFirst  = "<td>"+sv.firstTrain+"</td>";
      var tFreq   = "<td>"+sv.trainFrequency+"</td>";
     
      var tRow    = $("<tr>"+tName+tDest+tFirst+tFreq+"</tr>");
      tRow.attr("id",trainNum);
      
      // And write it out!
      $("#trains").append(tRow);
      
      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    
});
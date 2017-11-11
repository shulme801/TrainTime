$(document).ready(function(){

var database; 
var trainCount=0;
var trainSchedule = [];

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

function convertTrainTime (firstTrain,trainFrequency) {
  var firstTrainConverted;
  var currentTime;
  var diffTime;
  var tRemainder;
  var minutesAway;
  var nextTrain;
  var arrivalTime;
  var convertedTimes=[];
  var today = moment().isoWeekday();

  


  firstTrainConverted = moment(firstTrain,"hh:mm").subtract(1,"years");
  // console.log("firstTrainConverted time "+firstTrainConverted);
  
  console.log("currentTime "+currentTime);
  diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  // console.log("diff time is "+diffTime);
  tRemainder = diffTime%trainFrequency;
  minutesAway = trainFrequency-tRemainder;
  nextTrain = moment().add(minutesAway,"minutes");
  arrivalTime= moment(nextTrain).format("hh:mm A");
  convertedTimes.push(arrivalTime);
  convertedTimes.push(minutesAway);
  console.log("convertedTimes is "+convertedTimes);
  return(convertedTimes);
}



function outputOneRow(row) {

      var trainNum;
      var tName;
      var tDest;
      var tFreq;
      var tRow;
      var convertedTimes = [];
      var nextArrival;
      var minutesAway;
      var tMins;
      var tNext;

      convertedTimes = convertTrainTime(row.firstTrain,row.trainFrequency); //Get next arrival and minutes away
      minutesAway = convertedTimes.pop();
      nextArrival = convertedTimes.pop();

      console.log("For "+row.trainName+" next arrival is "+nextArrival);
      console.log("For "+row.trainName+" minutes away is "+minutesAway);

      // Build a new train schedule table row
      trainNum = "trainNum"+trainCount; 
    
      tName   = "<td>"+row.trainName+"</td>";
      tDest   = "<td>"+row.trainDestination+"</td>";
      tFreq   = "<td>"+row.trainFrequency+"</td>";
      tNext   = "<td>"+nextArrival+"</td>";
      tMins   = "<td>"+minutesAway+"</td>";
      
     
      var tRow    = $("<tr>"+tName+tDest+tFreq+tNext+tMins+"</tr>");
      tRow.attr("id",trainNum);
      
      // And write it out!
      $("#trains").append(tRow);
    }


    $("#resetTrain").on("click", function(event){
      console.log("resetting form");
      document.getElementById("trainForm").reset();

    })
    
    
    $("#addTrain").on("click", function(event) {

      // When user adds a train, store the train info in the database 
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
        document.getElementById("trainForm").reset();
      });
    });


    
    database.ref().on('value', function(snapshot) {
        console.log("I got here");
        trainSchedule = [];
        $("#trains").empty();
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          trainSchedule.push(
                    {trainName: childData.trainName,
                     trainDestination: childData.trainDestination,
                     firstTrain: childData.firstTrain,
                     trainFrequency: childData.trainFrequency
                    }
          );
        });

        trainSchedule.forEach(outputOneRow);
    });

    

    
});
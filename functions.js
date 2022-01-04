const fs = require("fs");

function currentDate() {
  var month = " ";

  var date = new Date().getDate();
  var year = new Date().getFullYear();

  switch (new Date().getMonth()) {
    case 0:
      month = "January";
      break;

    case 1:
      month = "February";
      break;

    case 2:
      month = "March";
      break;

    case 3:
      month = "April";
      break;

    case 4:
      month = "May";
      break;

    case 5:
      month = "June";
      break;

    case 6:
      month = "July";
      break;

    case 7:
      month = "August";
      break;

    case 8:
      month = "September";
      break;

    case 9:
      month = "October";
      break;

    case 10:
      month = "November";
      break;

    case 11:
      month = "December";
      break;
  }
  var fullDate = `${date} - ${month} - ${year}`;
  return fullDate;
}

function readKey() {
  var obj = JSON.parse(fs.readFileSync("keys.json"));
  var key = obj.user.secretKey;

  if (obj.user.date != currentDate()) {
    obj.user.date = currentDate();
    obj.user.usage = 0;
  }

  obj.user.usage++;

  if (obj.user.usage > 50) {
    return "Maximum Limit Reached";
  }

  fs.writeFile("keys.json", JSON.stringify(obj), (err) => {
    if (err) {
      console.log(err);
    }
  });

  return key;
}

function jsonWrite(id, firstName, lastName) {
  var obj = readData();
  obj.data.push({
    id,
    firstName,
    lastName,
  });
  fs.writeFile("secretFile.json", JSON.stringify(obj), (err) => {
    if (err) {
      return err;
    }
  });
  return obj;
}

// Export Functions

function readData() {
  var obj = JSON.parse(fs.readFileSync("secretFile.json"));
  return obj;
}

function writeData(apiKey, firstName, lastName) {
  var obj = readData();
  var count = obj.data.length;
  var id = 1;

  // Validation Code Starts

  if (typeof firstName != "string") {
    var message = {
      status: 200,
      message: "Incorrect Type First Name",
    };
    return message;
  }

  if (typeof lastName != "string") {
    var message = {
      status: 200,
      message: "Incorrect Type Last Name",
    };
    return message;
  }

  if (readKey() == "Maximum Limit Reached") {
    var message = {
      status: 200,
      message: "Maximum Limit Reached",
    };
    return message;
  }

  if (apiKey != readKey()) {
    var message = {
      status: 200,
      message: "Incorrect API Key",
    };
    return message;
  }

  // Validation Code Ends

  switch (count) {
    case 0:
      var message = jsonWrite(id, firstName, lastName);
      return message;
      break;

    default:
      count--;
      id = obj.data[count].id;
      id++;
      var message = jsonWrite(id, firstName, lastName);
      return message;
      break;
  }
}

function deleteData(id) {
  var obj = readData();
  delete obj.data[id];

  return obj;
  // for (let index = 0; index < obj.data.length; index++) {
  //   const element = obj.data[index];

  //   if (element.id == id) {
  //     delete obj.data[id].id;
  //   }

  // }
}

function updateData(id, field, data) {
  var obj = readData();
  for (let index = 0; index < obj.data.length; index++) {
    const element = obj.data[index];

    if (element.id == id) {
      switch (field) {
        case "firstName":
          element.firstName = data;
          break;

        case "lastName":
          element.lastName = data;
          break;
      }
      fs.writeFileSync("secretFile.json", JSON.stringify(obj), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}

function oneField() {
  var obj = readData();
  var i = 0;
  obj.data.forEach( function() {
  console.log(obj.data[i].firstName);
  i++;
  });
}

module.exports = { readData, writeData, deleteData, updateData, oneField };

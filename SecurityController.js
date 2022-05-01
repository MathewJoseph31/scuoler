const ipRequests = {};
const suspiciousIPs = [];
const checkWindow = 60 * 1000; //duration in secs converted to milliseconds
const requestLimit = 60; //Max requests that can be made in the checkWindow duration
const resetTime = 60 * 60 * 1000; //duration to clear the suscpicious IPs list in milliseconds

//################################### DOS ATTACK MEASURES ###########################################

exports.securityController = (req, res, next) => {
  let err = new Error(`Dos Attach suspected from IP ${req.ip}`);
  if (!suspiciousIPs.includes(req.ip)) {
    if (ipRequests.hasOwnProperty(req.ip)) {
      // Check if the incoming IP exists in ipRequests Object
      //If it already exists,Check if the end time is greater than current time
      if (ipRequests[req.ip].endTime < Date.now()) {
        delete ipRequests[req.ip]; //If yes, remove from the ipRequests Object
        // console.log("Timer over!Deleting...");

        //and add fresh entry to ipRequests
        ipRequests[req.ip] = {
          startTime: Date.now(),
          endTime: Date.now() + checkWindow,
          count: 1,
        };
        // console.log("ipRequests: ", ipRequests);
        next();
      }
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ELSE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      else {
        //Check if the count is more the max permissible limit
        if (ipRequests[req.ip].count > requestLimit) {
          console.log(
            "Count is" + ipRequests[req.ip].count + ". Count Exceeded!"
          );
          suspiciousIPs.push(req.ip); //log suspicious IPs
          console.log(
            "You have exceeded the max requests in a give time period! Please try after sometime", //Send suitable response
            req.ip,
            ipRequests[req.ip].count
          );
          next(err);
          // next();
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ELSE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        else {
          ipRequests[req.ip].count = ipRequests[req.ip].count + 1; //if no,then increment the count
          //console.log("ipRequests: ", ipRequests);
          next();
        }
      }
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ELSE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    else {
      ipRequests[req.ip] = {
        //if the incoming IP does not exist in ipRequests Object, add it
        startTime: Date.now(),
        endTime: Date.now() + checkWindow,
        count: 1,
      };
      // console.log("ipRequests: ", ipRequests);
      next();
    }
  } else {
    next(err);
  }
};

function checkEndTime() {
  // console.log("Checking End Time");
  let currentTime = Date.now();
  Object.keys(ipRequests).map(function (key, index) {
    if (ipRequests[key].endTime < currentTime) {
      console.log("Timer over for" + key + "!Deleting...");
      delete ipRequests[key];
      // console.log("ipRequests: ", ipRequests);
    }
  });
}
let interval1 = setInterval(checkEndTime, checkWindow);
console.log(parseInt(interval1));

//#####################################################################
function clearSuspiciousIPs() {
  console.log("Clearing Suspicious IPs arrays");
  suspiciousIPs = [];
}

let interval2 = setInterval(clearSuspiciousIPs, resetTime);
console.log(parseInt(interval2));
//###########################################################################################################

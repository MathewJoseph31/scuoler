exports.getIpDetailsForIp = async function (ip) {
  let ipDetailsUrl = `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`;

  let resObj = await fetch(ipDetailsUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!resObj?.ok) {
    try {
      let jsonStr = await resObj.json();
      let err = new Error(jsonStr);
      err.jsonified = true;
      throw err;
    } catch (err) {
      if (err.jsonified) {
        throw err;
      } else {
        throw Error("Network or server fetch error", {
          cause: err,
        });
      }
    }
  }
  let jsonObj = await resObj.json();
  return jsonObj;
};

/*
note: For http://ip-api.com/batch (https://ip-api.com/docs/api:batch), 
 Max length of ipArray param allowed is 100
 */
exports.getIpDetailsForIpArray = async function (ipArray) {
  let ipDetailsUrl = `http://ip-api.com/batch?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`;

  let resObj = await fetch(ipDetailsUrl, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(ipArray),
  });

  if (!resObj?.ok) {
    console.log(resObj);
    try {
      let jsonStr = await resObj.json();
      let err = new Error(jsonStr);
      err.jsonified = true;
      throw err;
    } catch (err) {
      if (err.jsonified) {
        throw err;
      } else {
        throw Error("Network or server fetch error", {
          cause: err,
        });
      }
    }
  }
  let jsonArray = await resObj.json();
  return jsonArray;
};

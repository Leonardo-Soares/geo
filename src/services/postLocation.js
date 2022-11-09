export function postLocation(location) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    location: location,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://api-temp.vercel.app/api/ifred-location/delivery-location",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

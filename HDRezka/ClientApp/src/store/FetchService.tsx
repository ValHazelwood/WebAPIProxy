
const FetchService = {
  search: function (input: string) {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(input);

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch("http://192.168.1.252:5000/api/search", requestOptions);
  },
  media: function (input: string) {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(input);

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch("http://192.168.1.252:5000/api/media", requestOptions);
  }
};

export default FetchService;

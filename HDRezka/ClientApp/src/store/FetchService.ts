const API_URL: string = "/api/";

const FetchService = {
  post: function (url: string, requestBody: string) {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: requestBody,
      redirect: "follow",
    };

    return fetch(API_URL + url, requestOptions);
  },
};

export default FetchService;

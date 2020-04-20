import FetchService from "./FetchService";
import { SearchResult, Media } from "./types";

const ActionService = {
  search: function (input: string, dispatch: React.Dispatch<any>) {
    console.log("search: " + input);
    dispatch({
      type: "SEARCH_REQUEST",
    });

    FetchService.post("search", JSON.stringify(input))
      .then((response) => response.json() as Promise<SearchResult[]>)
      .then((result) => {
        dispatch({
          type: "SEARCH_SUCCESS",
          results: result,
        });
      })
      .catch((error) => {
        dispatch({
          type: "SEARCH_FAILURE",
          error: error,
        });
      });
  },
  selectHandler: function (
    selectedItemUrl: string,
    results: SearchResult[],
    dispatch: React.Dispatch<any>
  ) {
    let selectedItem = results.find((x) => x.url === selectedItemUrl);

    if (selectedItem) {
      dispatch({
        type: "MEDIA_REQUEST",
      });

      FetchService.post("media", JSON.stringify(selectedItemUrl))
        .then((response) => response.json() as Promise<Media>)
        .then((result) => {
          if (selectedItem) {
            dispatch({
              type: "MEDIA_SUCCESS",
              media: {
                searchResult: selectedItem,
                media: result,
              },
            });
          }
        })
        .catch((error) => {
          dispatch({
            type: "MEDIA_FAILURE",
            error: error,
          });
        });
    }
  },
};

export default ActionService;

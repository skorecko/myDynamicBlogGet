import { render } from "mustache";

//an array, defining the routes
export default [
  {
    //the part after '#' in the url (so-called fragment):
    hash: "welcome",
    ///id of the target html element:
    target: "router-view",
    //the function that returns content to be rendered to the target html element:
    getTemplate: targetElm =>
      (document.getElementById(targetElm).innerHTML = document.getElementById(
        "template-welcome"
      ).innerHTML)
  },

  {
    hash: "articles",
    target: "router-view",
    getTemplate: fetchAndDisplayArticles
  },

  {
    hash: "opinions",
    target: "router-view",
    getTemplate: createHtml4opinions
  },

  {
    hash: "addOpinion",
    target: "router-view",
    getTemplate: targetElm =>
      (document.getElementById(targetElm).innerHTML = document.getElementById(
        "template-addOpinion"
      ).innerHTML)
  }
];

function createHtml4opinions(targetElm) {
  const opinionsFromStorage = localStorage.myTreesComments;
  let opinions = [];

  if (opinionsFromStorage) {
    opinions = JSON.parse(opinionsFromStorage);
    opinions.forEach(opinion => {
      opinion.created = new Date(opinion.created).toDateString();
      opinion.willReturn = opinion.willReturn
        ? "I will return to this page."
        : "Sorry, one visit was enough.";
    });
  }

  document.getElementById(targetElm).innerHTML = render(
    document.getElementById("template-opinions").innerHTML,
    opinions
  );
}

function fetchAndDisplayArticles(targetElm) {
  const url = "http://wt.kpi.fei.tuke.sk/api/article";

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        //if we get server error
        return Promise.reject(
          new Error(
            `Server answered with ${response.status}: ${response.statusText}.`
          )
        );
      }
    })
    .then(responseJSON => {
      document.getElementById(targetElm).innerHTML = render(
        document.getElementById("template-articles").innerHTML,
        responseJSON
      );
    })
    .catch(error => {
      ////here we process all the failed promises
      const errMsgObj = { errMessage: error };
      document.getElementById(targetElm).innerHTML = render(
        document.getElementById("template-articles-error").innerHTML,
        errMsgObj
      );
    });
}

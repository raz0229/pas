<script>
  import { db } from "../firebase.js";

  let counter = 0;
  let selected = "";
  let arr = [];
  let answers = [];
  let name = "";
  let loading = false;
  let quiz_id;

  // function creates 20 distinct random numbers
  const numbersPicker = (min, max, total) => {
    var numbers = []; // new empty array

    var n, p;

    for (let i = 0; i < total; i++) {
      do {
        n = Math.floor(Math.random() * (max - min + 1)) + min;
        p = numbers.includes(n);
        if (!p) {
          numbers.push(n);
        }
      } while (p);
    }
    return numbers;
  };

  arr = numbersPicker(0, 59, 20); // creates 20 distinct random numbers between 0 to 59

  const nextHandler = () => {
    // adds given question's ID and selected answer to answers array
    answers.push({
      question_id: questions[arr[counter]].id,
      choice: getChecked(),
    });

    counter++;
    let x = document.querySelector(".container");
    x.style.display = "none";

    sleep(500).then(() => {
      x.style.display = "block";
    });

    if (counter > 18) {
      let next = document.querySelector("#next");
      next.textContent = "SUBMIT";
    }
    // counter > 19
    if (counter > 19) {
      let next = document.querySelector("#next");
      next.classList.add("modal-trigger");
      next.style.display = "none";

      waitForElm(".modal-overlay").then((elem) => {
        elem.style.pointerEvents = "none";
      });
    }
  };

  const submitHandler = () => {
    loading = true; // starts spinner
    document.querySelector(".p-one").style.display = "none"; //hides p-one
    document.querySelector(".create").classList.add("disabled"); //disables modal button
    quiz_id = makeid();

    if (!window.navigator.onLine) {
      loading = false; // internet connection error
      document.querySelector(".p-four").style.display = "block";
    }

    db.collection("quiz")
      .doc(quiz_id)
      .set({
        quiz_id: quiz_id,
        creator: capitalize(name.trim()),
        date_created: new Date().toString().substring(0, 25),
        answers: answers,
      })
      .then(() => {
        loading = false;
        storeLocally(quiz_id);
        M.toast({
          html: `Quiz Created with ID: '${quiz_id}'`,
          displayLength: 5000,
        });
        document.querySelector(".p-four").style.display = "none";
        document.querySelector(".p-three").style.display = "block";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //helper functions
  function onChange(event) {
    selected = event.currentTarget.value;

    let but = document.querySelector("#next");
    but.classList.remove("disabled");
  }

  //capitalizes first letter
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //timeout function
  function sleep(ms) {
    return new Promise((resolver) => setTimeout(resolver, ms));
  }

  //returns true is any radio is checked
  function getChecked() {
    let y = document.querySelectorAll("input");
    for (let i = 0; i < y.length; i++) {
      if (y[i].checked) {
        return y[i].value;
      }
    }
  }

  //creates a 5-digit random ID
  function makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  // stores quiz_id and date in local storage
  function storeLocally(id) {
    id = quiz_id.trim();
    let date = new Date().toString().substring(0, 25).concat(id);

    let ar = [date.replace("\\", "")];

    if (localStorage.getItem("storedCreate") != null) {
      let storedCreate = JSON.parse(localStorage.getItem("storedCreate")); //get string
      storedCreate.push(ar);
      localStorage.setItem("storedCreate", JSON.stringify(storedCreate)); //store string
    } else {
      localStorage.setItem("storedCreate", JSON.stringify(ar)); //store string
    }
  }

  // waits for a specific element to appear
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  //copies the given text to clipboard
  function copyToClip(txt) {
    txt = document.createTextNode(txt);
    var m = document;
    var w = window;
    var b = m.body;
    b.appendChild(txt);
    if (b.createTextRange) {
      var d = b.createTextRange();
      d.moveToElementText(txt);
      d.select();
      m.execCommand("copy");
    } else {
      var d = m.createRange();
      var g = w.getSelection;
      d.selectNodeContents(txt);
      g().removeAllRanges();
      g().addRange(d);
      m.execCommand("copy");
      g().removeAllRanges();
    }
    txt.remove();

    //redirects to homepage
    window.location.href = "/";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems);
  });
</script>

<nav>
  <div class="nav-wrapper">
    <span class="brand-logo">Create Quiz</span>
  </div>
</nav>

<div class="container">
  {#if counter != 20}
    <h5 class="question ">
      {counter + 1}<span class="twenty">/20</span>. {questions[arr[counter]]
        .question}
    </h5>
    <div class="imgstack">
      <img
        alt=""
        src={images[arr[counter]].a}
        style="width: 35%; height: auto"
      />
      <img
        alt=""
        src={images[arr[counter]].b}
        style="width: 35%; height: auto;"
      />
      <img
        alt=""
        src={images[arr[counter]].c}
        style="width: 35%; height: auto"
      />
      <img
        alt=""
        src={images[arr[counter]].d}
        style="width: 35%; height: auto;"
      />
    </div>
    <p>
      <label>
        <input
          checked={selected === "a"}
          on:change={onChange}
          class="with-gap "
          name="group3"
          type="radio"
          value="a"
        />
        <span class="radio ">{choices[arr[counter]].a}</span>
      </label>
    </p>
    <p>
      <label>
        <input
          checked={selected === "b"}
          on:change={onChange}
          class="with-gap "
          name="group3"
          type="radio"
          value="b"
        />
        <span class="radio ">{choices[arr[counter]].b}</span>
      </label>
    </p>
    <p>
      <label>
        <input
          checked={selected === "c"}
          on:change={onChange}
          class="with-gap "
          name="group3"
          type="radio"
          value="c"
        />
        <span class="radio ">{choices[arr[counter]].c}</span>
      </label>
    </p>
    <p>
      <label>
        <input
          checked={selected === "d"}
          on:change={onChange}
          class="with-gap "
          name="group3"
          type="radio"
          value="d"
        />
        <span class="radio ">{choices[arr[counter]].d}</span>
      </label>
    </p>
  {/if}
  <!-- Modal Trigger -->
  <button
    id="next"
    data-target="modal1"
    class="waves-effect waves-light btn-large but disabled"
    on:click={() => {
      nextHandler();
    }}><i class="material-icons left">arrow_forward_ios</i>Next</button
  >
</div>

<!-- Modal Structure -->
<div id="modal1" class="modal">
  <div class="modal-content">
    <div class="p-one">
      <h4>Create Quiz</h4>
      <div class="input-field col s6">
        <input
          placeholder="Type here"
          id="first_name"
          type="text"
          class="validate"
          bind:value={name}
        />
        <label class="label" for="first_name">Your Name</label>
      </div>
    </div>
    {#if loading}
      <div class="p-two">
        <div class="loader">Loading...</div>
      </div>
    {/if}
    <div class="p-three" style="display: none;">
      <h3>Quiz ID:</h3>
      <h2
        style="border: dashed 6px #26a69a; text-align: center; padding: 15px 0 15px 0;"
      >
        {quiz_id}
      </h2>
      <p>
        Your friends can join this quiz by using this Quiz ID. Copy it! You can
        use the History button in homepage in case you forget this ID.
      </p>
      <button
        on:click={copyToClip(quiz_id)}
        class="waves-effect waves-light btn-large but2"
        ><i class="material-icons left">content_copy</i>Copy Quiz ID</button
      >
    </div>
    <div class="p-four" style="display: none;">
      <h3>Connection Timeout</h3>
      <span style="font-size: larger; color: crimson; text-align: center;"
        ><i class="material-icons left">error_outline</i></span
      >
      <p>Make sure you are connected to the internet</p>
      <p
        style="text-align: center; border: solid 1px crimson; padding: 8px 0 8px 0;"
      >
        Program will automatically reconnect once the connection is established
      </p>
      <a href="/" class="waves-effect waves-light btn-large but2"
        ><i class="material-icons left">replay</i>Reload Page</a
      >
    </div>
  </div>
  <div class="modal-footer">
    <!-- Length of name should not exceeds 23 characters or should not be left blank -->
    <button
      on:click={submitHandler}
      class:disabled={name.length == 0 ||
        name.length > 23 ||
        !name.replace(/\s/g, "").length}
      class="create waves-effect waves-green btn-flat"
      ><i class="material-icons left">create</i>Create</button
    >
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@600&display=swap");

  :root {
    background-color: #f3f3f3fa;
    height: 100%;
  }
  .but2 {
    background: #26a69a;
    margin: 15px 0 15px 0;
    width: 100%;
  }
  #next {
    text-decoration: none;
    font-family: "Nunito", sans-serif;
  }
  a {
    text-decoration: none;
  }
  a:visited {
    color: #fff;
  }

  nav {
    background-color: #2e2e2e !important;
  }

  .container {
    display: block;
  }

  .question {
    margin: 50px auto;
  }

  .radio {
    font-size: 1.5rem !important;
    margin-top: 10px;
  }
  .but {
    background-color: #2e2e2e !important;
    width: 50%;
    margin-top: 15px;
  }

  .disabled {
    background-color: #dfdfdf !important;
  }

  .imgstack img {
    height: 175px !important;
  }
  .twenty {
    font-size: smaller;
  }
  .create {
    background-color: #26a69a;
    color: #fff;
  }
  .input-field {
    margin-top: 30px;
  }
  .label {
    font-size: larger;
  }
  .input-field label,
  .input-field input {
    pointer-events: all !important;
  }
  @media only screen and (max-width: 600px) {
    .imgstack img {
      height: 90px !important;
    }
  }

  /* Loader spinner */
  .loader,
  .loader:after {
    border-radius: 50%;
    width: 10em;
    height: 10em;
  }
  .loader {
    margin: 60px auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border-top: 1.1em solid rgba(38, 166, 154, 0.2);
    border-right: 1.1em solid rgba(38, 166, 154, 0.2);
    border-bottom: 1.1em solid rgba(38, 166, 154, 0.2);
    border-left: 1.1em solid #26a69a;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
  }
  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>

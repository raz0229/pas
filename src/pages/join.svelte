<script>
  import { db, fv } from "../firebase.js";

  export let quiz_id = "";
  export let answers = [];
  export let quizJoined = false;
  export let creator = "";
  let counter = 0;
  let selected = "";
  let loading = false;
  let selections = [];
  let wrongAnswers = [];
  let name = "";
  let score = 20;

  const nextHandler = () => {
    // adds given question's ID and selected answer to answers array
    selections.push({
      question_id: answers[counter].question_id,
      choice: getChecked(),
    });

    counter++;

    let x = document.querySelector(".container");
    x.style.display = "none";

    if (counter > 18) {
      let next = document.querySelector("#next");
      next.textContent = "SUBMIT";
    }
    // counter > 19
    if (counter > 19) {
      wrongAnswers = comArrays(selections, answers);

      let bd = document.querySelector(".back-drop");
      bd.style.display = "block";
      x.style.display = "none";
    } else {
      sleep(500).then(() => {
        x.style.display = "block";
      });
    }
  };

  const submitHandler = () => {
    let proceed = true;

    loading = true; // starts spinner
    document.querySelector(".p-one").style.display = "none"; //hides p-one
    document.querySelector(".join").classList.add("disabled"); //disables modal button

    const userRef = db.collection("quiz").doc(quiz_id.trim());
    userRef.get().then((snap) => {
      //check if player already exists in array
      if (snap.data().players) {
        for (let i = 0; i < snap.data().players.length; i++) {
          let player = snap.data().players[i];
          if (player.name == name || player.name == name.trim().toLowerCase()) {
            M.toast({
              html: `Player: '${capitalize(
                player.name.trim().toLowerCase()
              )}' already exists in Quiz: '${quiz_id}'`,
              displayLength: 5000,
            });
            loading = false;
            proceed = false;
            document.querySelector(".p-one").style.display = "block"; //shows p-one
            document.querySelector(".join").classList.remove("disabled");
          }
        }
      }

      // if player's name does not exist, add new player
      if (proceed) {
        userRef
          .update({
            players: fv.arrayUnion({
              name: name.trim().toLowerCase(),
              attempted: new Date().toString().substring(0, 25),
              score: score,
            }),
          })
          .then(() => {
            M.toast({
              html: "You can see how others are doing in this quiz by 'Scoreboard' button on homepage",
              displayLength: 5000,
            });
            loading = false;
            document.querySelector(".p-three").style.display = "block"; //shows p-three
            loadProgress(score, "#9575cd");
          });
      }
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

  // stores quiz_id and date in local storage
  function storeLocally(id) {
    id = quiz_id.trim();
    let date = new Date().toString().substring(0, 25).concat(id);

    let ar = [date.replace("\\", "")];

    if (localStorage.getItem("storedJoin") != null) {
      let storedJoin = JSON.parse(localStorage.getItem("storedJoin"));
      storedJoin.push(ar);
      localStorage.setItem("storedJoin", JSON.stringify(storedJoin)); //store string
    } else {
      localStorage.setItem("storedJoin", JSON.stringify(ar)); //store string
    }
  }

  //compares the choice between two arrays and returns wrong answers array
  // keeps selections as arr1 and answers as arr2
  function comArrays(arr1, arr2) {
    let wrongAnswers = [];

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].choice != arr2[i].choice) {
        score--; // subtracts 1 from total score i.e 20
        wrongAnswers.push({
          question_id: arr1[i].question_id, // incorrect questions's ID
          selection: arr1[i].choice, // your choice
          answer: arr2[i].choice, // creator's choice
        });
      }
    }
    return wrongAnswers;
  }

  // function takes in a color parameter and loads progress bar
  function loadProgress(sc, color) {
    let progress = (sc / 20) * 100;
    var can = document.getElementById("canvas"),
      spanProcent = document.getElementById("procent"),
      c = can.getContext("2d");

    var posX = can.width / 2,
      posY = can.height / 2,
      fps = 1000 / 200,
      procent = 0,
      oneProcent = 360 / 100,
      result = oneProcent * progress;

    c.lineCap = "round";
    arcMove();

    function arcMove() {
      var deegres = 0;
      var acrInterval = setInterval(function () {
        deegres += 1;
        c.clearRect(0, 0, can.width, can.height);
        procent = deegres / oneProcent;

        //spanProcent.innerHTML = procent.toFixed();
        spanProcent.innerHTML =
          sc + '<span style="font-size: 25px;">/20</span>';

        c.beginPath();
        c.arc(
          posX,
          posY,
          70,
          (Math.PI / 180) * 270,
          (Math.PI / 180) * (270 + 360)
        );
        c.strokeStyle = "#b1b1b1";
        c.lineWidth = "10";
        c.stroke();

        c.beginPath();
        c.strokeStyle = color;
        c.lineWidth = "10";
        c.arc(
          posX,
          posY,
          70,
          (Math.PI / 180) * 270,
          (Math.PI / 180) * (270 + deegres)
        );
        c.stroke();
        if (deegres >= result) clearInterval(acrInterval);
      }, fps);
    }
  }

  storeLocally(quiz_id); // stores quiz id in local storage storedJoin array
</script>

{#if quizJoined}
  <nav>
    <div class="nav-wrapper">
      <span class="brand-logo">Join Quiz</span>
    </div>
  </nav>

  <div class="container">
    {#if counter != 20}
      <h5 class="question ">
        {counter + 1}<span class="twenty">/20</span>. {questions2[
          answers[counter].question_id
        ].question.replace("xxx", creator.split(" ")[0])}
      </h5>
      <div class="imgstack">
        <img
          alt=""
          src={images[answers[counter].question_id].a}
          style="width: 35%; height: auto"
        />
        <img
          alt=""
          src={images[answers[counter].question_id].b}
          style="width: 35%; height: auto;"
        />
        <img
          alt=""
          src={images[answers[counter].question_id].c}
          style="width: 35%; height: auto"
        />
        <img
          alt=""
          src={images[answers[counter].question_id].d}
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
          <span class="radio ">{choices[answers[counter].question_id].a}</span>
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
          <span class="radio ">{choices[answers[counter].question_id].b}</span>
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
          <span class="radio ">{choices[answers[counter].question_id].c}</span>
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
          <span class="radio ">{choices[answers[counter].question_id].d}</span>
        </label>
      </p>
    {/if}
    <!-- Modal Trigger -->
    <button
      id="next"
      class="waves-effect waves-light btn-large but disabled"
      on:click={nextHandler}
      ><i class="material-icons left">arrow_forward_ios</i>Next</button
    >
  </div>

  <div class="back-drop" style="display: none;">
    <div class="model">
      <div class="p-one">
        <h4>Quiz Attempted</h4>
        <div class="input-field col s6">
          <input
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
        <div class="canvas-wrap" style="margin: 0 auto;">
          <canvas id="canvas" width="300" height="300" />
          <span id="procent" />
        </div>
        <ul class="collection">
          {#each wrongAnswers as { question_id, selection, answer }, i}
            <li class="collection-item avatar">
              <i class="material-icons circle blue">insert_chart</i>
              <span class="title"
                >{i + 1}. {questions2[question_id].question.replace(
                  "xxx",
                  creator.split(" ")[0]
                )}</span
              >
              <div style="display: grid;">
                <span class="new badge red" data-badge-caption=""
                  >Your answer: {choices[question_id][selection]}</span
                >
                <span class="new badge green" data-badge-caption=""
                  >Correct answer: {choices[question_id][answer]}</span
                >
              </div>
            </li>
          {/each}
          {#if wrongAnswers.length == 0}
            <p style="text-align: center; margin-top: 5rem; color: crimson;">
              <em>No wrong answers to display.</em>
            </p>
          {/if}
        </ul>
        <a href="/" class="waves-effect waves-light btn-large but2"
          ><i class="material-icons left">home</i>Take me Home</a
        >
      </div>
      <div class="footer">
        <button
          on:click={submitHandler}
          class:disabled={name.length == 0 ||
            name.length > 23 ||
            !name.replace(/\s/g, "").length}
          class="join waves-effect waves-green but2 btn-flat"
          ><i class="material-icons left">check</i>Submit Result</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  @import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@500;600&display=swap");

  .but2 {
    background: #9575cd;
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
    background-color: #9575cd !important;
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
  .join {
    background-color: #9575cd;
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
  .back-drop {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    margin: -88px 0 0 -8px;
    overflow: auto;
  }

  .model {
    padding: 10px;
    border-radius: 10px;
    width: 90%;
    margin: 10% auto;
    background: white;
  }
  .collection {
    height: 170px !important;
    overflow: scroll;
  }
  /* Loading spinner */
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
    border-top: 1.1em solid rgba(149, 117, 205, 0.2);
    border-right: 1.1em solid rgba(149, 117, 205, 0.2);
    border-bottom: 1.1em solid rgba(149, 117, 205, 0.2);
    border-left: 1.1em solid #9575cd;
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

  /* circular progress bar */
  #procent {
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 50px;
    transform: translate(-50%, -50%);
    color: #2e2e2e;
  }

  .canvas-wrap {
    position: relative;
    width: 300px;
    height: 300px;
  }
</style>

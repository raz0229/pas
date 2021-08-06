<script>
  import { db } from "../firebase.js";
  import Join from "./join.svelte";

  let year = new Date().getFullYear();
  let quiz_id = "";
  let creator = "";
  let answers = [];
  let loading = false;
  let quizJoined = false;

  //searches for quiz_id in cloud database
  const joinHandler = () => {
    loading = true; // starts spinner
    document.querySelector(".p-one").style.display = "none"; //hides p-one
    document.querySelector(".join").classList.add("disabled"); //disables modal button

    if (!window.navigator.onLine) {
      loading = false; // internet connection error
      document.querySelector(".p-four").style.display = "block";
    }

    var docRef = db.collection("quiz").doc(quiz_id.trim());

    docRef
      .get()
      .then((doc) => {
        // if quiz_id is correct
        if (doc.exists) {
          M.toast({
            html: `Joined Quiz: '${quiz_id.trim()}'`,
            displayLength: 5000,
          });
          loading = false;
          answers = doc.data().answers;
          creator = doc.data().creator;
          quizJoined = true;
        } else {
          // if quiz_id is wrong
          loading = false;
          document.querySelector(".p-three").style.display = "block";
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  // clears all data from localStorage
  const clearHistory = () => {
    localStorage.removeItem("storedCreate");
    localStorage.removeItem("storedJoin");
    window.location.href = "/";
  };

  document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems);
  });

  // load history from localStorage
  let storedCreate = JSON.parse(localStorage.getItem("storedCreate")); //get string
  let storedJoin = JSON.parse(localStorage.getItem("storedJoin")); //get string
</script>

{#if quizJoined}
  <Join bind:quiz_id bind:answers bind:creator bind:quizJoined />
{/if}

{#if !quizJoined}
  <nav>
    <div class="nav-wrapper">
      <a href="/" class="brand-logo">Put at stake</a>
    </div>
  </nav>
  <div class="container">
    <a class="waves-effect waves-light btn-large but but1" href="create"
      ><i class="material-icons left">add_circle</i>Create a Quiz</a
    >
    <button
      data-target="modal1"
      class="waves-effect waves-light btn-large modal-trigger but but2"
      ><i class="material-icons left">extension</i>Join a Quiz</button
    >
    <a class="waves-effect waves-light btn-large but but3" href="scoreboard"
      ><i class="material-icons left">sports_score</i>Scoreboard</a
    >
    <button
      data-target="modal-history"
      class="waves-effect waves-light btn-large modal-trigger but but5"
      ><i class="material-icons left">history</i>View History</button
    >
    <a class="waves-effect waves-light btn-large but but4" href="about"
      ><i class="material-icons left">alternate_email</i>About P<span id="c-a"
        >a</span
      >S</a
    >
  </div>

  <!-- Modal Structure -->
  <div id="modal1" class="modal">
    <div class="modal-content">
      <div class="p-one">
        <h4>Join Quiz</h4>
        <div class="input-field col s6">
          <input
            placeholder="Enter Quiz ID"
            id="quiz_id"
            type="text"
            class="validate"
            bind:value={quiz_id}
          />
          <label class="label" for="quiz_id">Quiz ID</label>
        </div>
      </div>
      {#if loading}
        <div class="p-two">
          <div class="loader">Loading...</div>
        </div>
      {/if}
      <div class="p-three" style="display: none;">
        <h3>Not Found</h3>
        <span style="font-size: larger; color: crimson; text-align: center;"
          ><i class="material-icons left">error_outline</i></span
        >
        <p>
          No such Quiz with ID: <strong><span>{quiz_id.trim()}</span></strong> found.
        </p>
        <p
          style="text-align: center; border: solid 1px crimson; padding: 8px 0 8px 0;"
        >
          Make sure you have entered the right ID
        </p>
        <a href="/" class="waves-effect waves-light btn-large but but2"
          ><i class="material-icons left">replay</i>Retry</a
        >
      </div>
      <div class="p-four" style="display: none;">
        <h3>Connection Timeout</h3>
        <span style="color: crimson;"
          ><i class="material-icons left">error_outline</i></span
        >
        <p>Make sure you are connected to the internet</p>
        <p
          style="text-align: center; border: solid 1px crimson; padding: 8px 0 8px 0;"
        >
          Program will automatically reconnect once the connection is
          established
        </p>
        <a href="/" class="waves-effect waves-light btn-large but but2"
          ><i class="material-icons left">replay</i>Reload Page</a
        >
      </div>
    </div>
    <div class="modal-footer">
      <button
        on:click={joinHandler}
        class:disabled={quiz_id.length == 0 ||
          quiz_id.trim().length > 6 ||
          !quiz_id.replace(/\s/g, "").length}
        class="join waves-effect waves-green btn-flat"
        ><i class="material-icons left">meeting_room</i>Join</button
      >
    </div>
  </div>

  <!--  History Modal -->
  <div id="modal-history" class="modal">
    <div class="modal-content">
      <div class="h-one">
        <h4>History</h4>

        <ul class="collection with-header cquiz">
          <li class="collection-header"><h5>Created Quizes</h5></li>
          {#if storedCreate}
            {#each storedCreate as data}
              <li class="collection-item">
                Quiz ID: <strong>{data.toString().split(" ")[5]}</strong><br
                />Created at: <em>{data.toString().substring(0, 24)}</em>
              </li>
            {/each}
          {:else}
            <li class="collection-item" style="color: crimson;">
              <em>No data to display</em>
            </li>
          {/if}
        </ul>
        <ul class="collection with-header jquiz">
          <li class="collection-header"><h5>Joined Quizes</h5></li>
          {#if storedJoin}
            {#each storedJoin as data}
              <li class="collection-item">
                Quiz ID: <strong>{data.toString().split(" ")[5]}</strong><br
                />Joined at: <em>{data.toString().substring(0, 24)}</em>
              </li>
            {/each}
          {:else}
            <li class="collection-item" style="color: crimson;">
              <em>No data to display</em>
            </li>
          {/if}
        </ul>
      </div>
    </div>
    <div class="modal-footer">
      <button
        on:click={clearHistory}
        class="waves-effect waves-green btn-flat but delbut"
        ><i class="material-icons left">delete</i>Clear History</button
      >
    </div>
  </div>

  <p
    style="font-family: cabin; text-align: center; padding:5%; color: #bbb9b9;"
  >
    Copyright &copy; Put at Stake {year}.
  </p>
{/if}

<style>
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@600&display=swap");

  a {
    text-decoration: none;
    font-family: "Nunito", sans-serif;
  }
  a:visited {
    color: #fff;
  }
  #c-a {
    text-transform: lowercase !important;
  }
  .container {
    width: 100%;
    margin: 30px 0 0 0;
  }
  .but {
    margin: 15px 0 15px 0;
    width: 100%;
  }
  .but1 {
    background: #9575cd;
  }
  .but2 {
    background: #ff5252;
  }
  .but3 {
    background: #42a5f5;
  }
  .but4 {
    background: #0e0e0e;
  }
  .but5 {
    background: #00bf9a;
  }
  .delbut {
    background: #0e0e0e;
    color: #fff;
    margin: 5px 0 5px 0;
  }
  :root {
    height: 100%;
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ffffff+0,f1f1f1+50,e1e1e1+51,f6f6f6+100;White+Gloss+%231 */

    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1) 0%,
      rgba(241, 241, 241, 1) 50%,
      rgba(225, 225, 225, 1) 51%,
      rgba(246, 246, 246, 1) 100%
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  }
  .join {
    background-color: #ff5252;
    color: #fff;
  }
  .disabled {
    background-color: #dfdfdf !important;
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
    border-top: 1.1em solid rgba(255, 82, 82, 0.2);
    border-right: 1.1em solid rgba(255, 82, 82, 0.2);
    border-bottom: 1.1em solid rgba(255, 82, 82, 0.2);
    border-left: 1.1em solid #ff5252;
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

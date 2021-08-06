<script>
  import { db, fv } from "../firebase.js";

  let quiz_id = "";
  let notJoined = true;
  let loading = false;
  let players = [];
  let creator;
  let date_created;

  const joinHandler = () => {
    loading = true; // starts spinner
    notJoined = false;
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
          players = doc.data().players;
          creator = doc.data().creator;
          date_created = doc.data().date_created;

          M.toast({
            html: `Quiz found on ID: '${quiz_id.trim()}'`,
            displayLength: 5000,
          });
          loading = false;
          document.querySelector(".card-action").style.display = "none";
          document.querySelector(".p-five").style.display = "block";
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

  //capitalizes first letter
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
</script>

<nav>
  <div class="nav-wrapper">
    <a href="/" class="brand-logo">Put at Stake</a>
  </div>
</nav>

<div class="container">
  <div class="row">
    <div class="col s12">
      <div class="card white darken-1">
        <div class="card-content black-text">
          {#if notJoined}
            <div class="p-one">
              <span class="card-title">Scoreboard</span>
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
          {/if}

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
              No such Quiz with ID: <strong
                ><span>{quiz_id.trim()}</span></strong
              > found.
            </p>
            <p
              style="text-align: center; border: solid 1px crimson; padding: 8px 0 8px 0; margin: 15px 0 15px 0;"
            >
              Make sure you have entered the right ID
            </p>
            <a
              href="/scoreboard"
              class="red waves-effect waves-light btn-large but but2"
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
              style="text-align: center; border: solid 1px crimson; padding: 8px 0 8px 0; margin: 15px 0 15px 0;"
            >
              Program will automatically reconnect once the connection is
              established
            </p>
            <a
              href="/scoreboard"
              class="red waves-effect waves-light btn-large but but2"
              ><i class="material-icons left">replay</i>Reload Page</a
            >
          </div>

          <div class="p-five" style="display: none;">
            <h3>ID: {quiz_id}</h3>
            <ul>
              <li>Created By: <em>{creator}</em></li>
              <li>Created At: <em>{date_created}</em></li>

              <div class="players">
                <ul class="collection">
                  {#if players}
                    {#each players as { name, attempted, score }, i}
                      <li class="collection-item avatar">
                        <i class="blue material-icons circle">face</i>
                        <div class="progress">
                          <div
                            class:red={score < 10}
                            class:orange={score > 10 && score < 15}
                            class:green={score >= 15}
                            class="determinate"
                            style="width: {(score / 20) * 100}%"
                          />
                        </div>
                        <span class="title"
                          ><strong>{capitalize(name)}</strong></span
                        >
                        <p>
                          Attempted on: {attempted}<br />
                          <span
                            style="border: inset 1px #f44336;border-radius: 6px;padding: 2px 8px 2px 8px;"
                            >Score: <b>{score}/20</b></span
                          >
                        </p>
                      </li>
                    {/each}
                  {:else}
                    <p
                      style="text-align: center; padding: 5rem 0 5rem 0; color: crimson;"
                    >
                      <em>No one has played this quiz yet.</em>
                    </p>
                  {/if}
                </ul>
              </div>
            </ul>
            <a
              href="/"
              style="text-align: center;"
              class="blue but waves-effect waves-green btn-flat"
              ><i class="material-icons left">home</i>Take me Home</a
            >
          </div>
        </div>
        <div class="card-action">
          <button
            on:click={joinHandler}
            class:disabled={quiz_id.length == 0 ||
              quiz_id.trim().length > 6 ||
              !quiz_id.replace(/\s/g, "").length}
            class="but join waves-effect waves-green btn-flat"
            ><i class="material-icons left">meeting_room</i>View</button
          >
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  nav {
    background-color: #1e88e5 !important;
  }
  a {
    text-decoration: none;
  }
  a:visited {
    color: #fff;
  }
  .input-field {
    margin-top: 30px;
    width: 100%;
  }
  .label {
    font-size: larger;
  }
  .input-field label,
  .input-field input {
    pointer-events: all !important;
  }
  .but {
    width: 100%;
    margin-top: 15px;
  }

  .disabled {
    background-color: #dfdfdf !important;
  }
  .join {
    background-color: #1e88e5;
    color: #fff;
  }
  .card .card-action {
    margin: 70px 0 70px 0;
  }
  .container {
    margin-top: 1rem;
  }
  .row .col.s12 {
    width: 100% !important;
  }
  .players {
    max-height: 320px;
    overflow: scroll;
  }
  /* Spinner loader */
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
    border-top: 1.1em solid rgba(66, 165, 245, 0.2);
    border-right: 1.1em solid rgba(66, 165, 245, 0.2);
    border-bottom: 1.1em solid rgba(66, 165, 245, 0.2);
    border-left: 1.1em solid #42a5f5;
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

<script>
  let year = new Date().getFullYear();

  document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems);
  });
</script>

<div class="about-section">
  <div class="headContainer">
    <a href="/" style="text-decoration: none">
      <span class="login-text">PaS Trivia<span class="dot">.</span></span><span
        class="beta">Beta</span
      >
    </a>
  </div>
  <p>A fun little side project</p>
  <p>
    PaS (Put at Stake Trivia) is a simple trivia app which lets you create your
    own quiz and then share it with your friends to put your friendship at
    stake.
  </p>

  <ul class="collapsible">
    <li>
      <div class="collapsible-header">
        <i class="material-icons">create</i>Create Quiz
      </div>
      <div class="collapsible-body">
        <span
          >Lets you create a new quiz from 20 out of 60 randomly selected
          questions and generates a private Quiz ID which can be copied and
          shared with your friends at any time you want</span
        >
      </div>
    </li>
    <li>
      <div class="collapsible-header">
        <i class="material-icons">login</i>Join Quiz
      </div>
      <div class="collapsible-body">
        <span
          >Requires you to enter the Quiz ID given to you by the creator and
          then asks the same twenty questions and compares them with the
          answers. After submitting your score to the Scoreboard, it lets you
          see your score and wrong answers.
        </span>
      </div>
    </li>
    <li>
      <div class="collapsible-header">
        <i class="material-icons">sports_score</i>Scoreboard
      </div>
      <div class="collapsible-body">
        <span
          >Requires you to enter the specific Quiz ID and displays the score of
          each individual participant on the Scoreboard. Your score is saved in
          cloud database and requires internet access to retrieve it.
        </span>
      </div>
    </li>
    <li>
      <div class="collapsible-header">
        <i class="material-icons">history</i>View History
      </div>
      <div class="collapsible-body">
        <span
          >You can see your activity on this app in case you forget the given or
          generated Quiz ID. This data is stored in device's local storage and
          is removed permanantly as soon as you click on the 'Clear History'
          button.
        </span>
      </div>
    </li>
    <li>
      <div class="collapsible-header">
        <i class="material-icons">alternate_email</i>About P<span id="c-a"
          >a</span
        >S
      </div>
      <div class="collapsible-body">
        <span>Redirects you to this about page.</span>
      </div>
    </li>
  </ul>
</div>

<h4 style="text-align:center">Contact the developer</h4>

<div class="row">
  <div class="col s6 offset-s3">
    <div class="card">
      <div class="card-image">
        <img
          src="https://i.ibb.co/qjMY3ky/raz0229.png"
          style="width: 50%; padding: 10px 0 10px 0;
          margin: 0 auto;"
        />
        <span class="card-title">RAZ0229</span>
      </div>
      <div class="card-content">
        <p>A Full-stack developer and ethical hacker. I have no life!</p>
      </div>
      <div class="card-action">
        <a href="https://raz0229.github.io">Get in touch</a>
      </div>
    </div>
  </div>
</div>

<p style="font-family: cabin; text-align: center; padding:5%; color: #bbb9b9;">
  Copyright &copy; Put at Stake {year}.
</p>

<style>
  .headContainer {
    position: relative;
  }

  .login-text {
    display: table-caption;
    margin-top: 5px;
    font-size: 30px;
    font-family: "Ubuntu";
    color: #2e2e2e;
    line-height: 1.2;
    text-transform: uppercase;
    width: 100%;
    /*display: block; text-align: center; */
  }

  .dot {
    color: #827ffe;
  }

  .beta {
    border: solid 1px #68d391;
    border-radius: 5px;
    position: absolute;
    margin-left: 10px;
    top: 20%;
    padding: 2px 5px 2px 5px;
    font-size: 12px;
    background-color: #f7f7f7;
  }

  p {
    font-family: sans-serif;
  }

  .row {
    text-align: center;
  }

  .about-section {
    padding: 50px;
    text-align: center;
    background-color: #f7f7f7;
    color: #2e2e2e;
  }
  #c-a {
    text-transform: lowercase !important;
  }
  .collapsible-body {
    pointer-events: all;
  }
  .card-title {
    color: #2e2e2e !important;
    position: inherit !important;
  }
</style>

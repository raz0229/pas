<script>
	import { Router, Route } from "svelte-routing";
	import Home from "./pages/home.svelte";
	import Create from "./pages/create.svelte";
	import Scoreboard from "./pages/scoreboard.svelte";
	import Join from "./pages/join.svelte";
	import About from "./pages/about.svelte";
	import NotFound from "./pages/404.svelte";
</script>

<Router>
	<div>
		<Route path="create"><Create /></Route>
		<Route path="scoreboard" component={Scoreboard} />
		<Route path="/"><Home /></Route>
		<Route path="join" component={Join} />
		<Route path="about" component={About} />
		<Route component={NotFound} />
	</div>
</Router>

<style>
</style>

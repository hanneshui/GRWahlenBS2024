<script lang="ts">
	import { tweened } from "svelte/motion";
	import { cubicInOut } from "svelte/easing";
	import { getContext } from "svelte";
	import * as Math from "mathjs";

	export let result: { party: string; color: string; seats: number };
	let max_percent = getContext<number>("max_percent");
	$: max_percent = getContext<number>("max_percent");
	

	const tween_options = {
		duration: 1200,
		easing: cubicInOut,
	};

	const percent_store = tweened(result.seats, tween_options);

	$: {
		$percent_store = result.seats;
	}
</script>

<div
	class="bar"
	style:--color={result.color}
	style:--percent={$percent_store * (100 / max_percent)}
>
	<span
		class="label"
		class:small={result.seats < 5}
		aria-describedby="percent{result.party}"
		>{result.party}</span
	>
</div>

<span class="percent" id="percent{result.party}">
	{Math.round($percent_store)}%
</span>

<style>
	.bar {
		grid-column: 2;
		background-color: var(--color);
		width: calc(var(--percent) * 1%);
		height: 3rem;
		display: flex;
		align-items: center;
		border-radius: 0.2rem;
		position: relative;
	}

	.label {
		position: absolute;
		color: white;
		font-weight: bold;
		transition: color 1000ms ease-in-out, left 500ms ease-in-out,
			bottom 500ms ease-in-out;
		left: 0;
		padding: 0.25rem 0.5rem;
	}

	.label.small {
		color: black;
		left: 100%;
	}

	.percent {
		grid-column: 1;
		font-size: 1.25rem;
	}

	@media (min-width: 36rem) {
		.bar {
			grid-column: initial;
			align-self: end;
			height: calc(var(--percent) * 1%);
			width: 100%;
			justify-content: center;
		}

		.percent {
			grid-column: initial;
			align-self: start;
			justify-self: center;
		}

		.label {
			left: initial;
			bottom: 0;
		}

		.label.small {
			left: initial;
			bottom: 100%;
		}
	}
</style>
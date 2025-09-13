<script lang="ts">
	import ProjectButtons from "./projectbuttons.svelte";
</script>

<main>
	<article>
		<h1>Select Project</h1>
		<svelte:boundary>
			{#snippet pending()}
				<p>loading...</p>
			{/snippet}
			<ProjectButtons />
		</svelte:boundary>
	</article>
</main>

<style>
	article {
		background-color: var(--light);
		padding: 1em;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2em;
	}
	main {
		background-color: var(--dark);
		height: 100vh;
		width: 100%;
		margin: 0;
		padding: 1em;
	}
	h1 {
		font-size: 3em;
		font-weight: bold;
	}
</style>

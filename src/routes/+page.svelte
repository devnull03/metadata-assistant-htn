<main>
	<article>
		<section>
			<h1>qrate</h1>
			<h2>Your <b>reliable</b> assistant for <b>streamlining</b> digital asset indexing</h2>
			<button><a href="./dashboard/new">Create Project</a></button>
		</section>
	</article>
</main>

<style>
	main {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: var(--dark);
	}
	button {
		color: var(--light);
		background-color: var(--dark);
		padding: 0.4em 0.8em;
		border-radius: 0.5em;
		margin: 2em;
		font-weight: 400;
	}
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	article {
		border-radius: 2em;
		background-color: #ffffff;
		--gap: 2em;
		font-family: "Poppins", sans-serif;
		display: flex;
		width: calc(100% - var(--gap) * 2);
		min-height: calc(100vh - var(--gap) * 2);
		color: var(--dark);
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
		gap: 2em;
	}
	h1 {
		font-size: 12em;
		font-weight: 700;
	}
	h2 {
		font-size: 2em;
		line-height: 1em;
	}
</style>

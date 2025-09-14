<script lang="ts">
	import ProjectButtons from "./projectbuttons.svelte";
</script>

<main>
	<article>
		<h1>Select Project</h1>
		<svelte:boundary>
			{#snippet pending()}
				<p>Loading...</p>
			{/snippet}
			<ProjectButtons />
		</svelte:boundary>
	</article>
</main>

<style>
:root {
  --primary: #8b1c24;   /* deep maroon */
  --secondary: #b33a40; /* lighter accent red */
  --background: #f7f4ed; /* cream */
  --text: #2b2b2b;
  --white: #ffffff;
  --radius: 12px;
  --transition: 0.25s ease-in-out;
}

/* Layout */
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 2rem;
  background-color: var(--background);
  font-family: system-ui, sans-serif;
  color: var(--text);
}

/* Card */
article {
  background: var(--white);
  padding: 3rem 4rem;
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
  border-top: 6px solid var(--primary);
  max-width: 600px;
  width: 100%;
}

/* Title */
h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: var(--primary);
}

/* Loading state */
p {
  font-size: 1.2rem;
  color: var(--secondary);
}
</style>

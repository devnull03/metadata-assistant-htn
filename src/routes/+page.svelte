<main>
	<article>
		<section>
			<img src="/src/lib/assets/favicon.png" alt="Qrate Logo" class="logo" />
			<h1>Qrate</h1>
			<h2>
				<span>Your reliable assistant</span><br>
				for <b>streamlining</b> digital asset indexing
			</h2>
			<p>
				Qrate helps archivists and digital librarians efficiently describe, organize, and manage collections. Powered by AI, it guides you through metadata extraction, clarifies uncertainties, and ensures your assets are discoverable and well-documented.
			</p>
			<div class="button-group">
				<a href="./new" class="cta">Go to Projects</a>
				<a href="https://archivescanada.ca/wp-content/uploads/2022/08/RADComplete_July2008.pdf" target="_blank" class="secondary">CANADIAN ARCHIVAL STANDARD</a>
			</div>
		</section>
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
  min-height: 100vh;
  background: var(--background);
  padding: 2rem;
  font-family: system-ui, sans-serif;
  color: var(--text);
}

article {
  background: var(--white);
  padding: 3rem 4rem;
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 900px;
  width: 100%;
  border-top: 6px solid var(--primary);
}

/* Logo */
.logo {
  width: 6em;
  margin-bottom: 1em;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Typography */
h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0.2em 0;
  color: var(--primary);
}

h2 {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0.5em 0 1.5em;
  line-height: 1.4;
  color: var(--secondary);
}


p {
  line-height: 1.6;
  margin: 2em auto;
  font-size: 1.2rem;
  max-width: 32em;
  color: #444;
  text-align: center;
}

/* Buttons */
.button-group {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-top: 2em;
}

.cta, .secondary {
  display: inline-block;
  padding: 0.9em 1.6em;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: var(--radius);
  transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
}

/* Primary button */
.cta {
  background: var(--primary);
  color: var(--white);
  box-shadow: 0 4px 12px rgba(139, 28, 36, 0.3);
}
.cta:hover {
  background: #6e151b;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 28, 36, 0.4);
}

/* Secondary button */
.secondary {
  background: var(--background);
  color: var(--primary);
  border: 2px solid var(--primary);
}
.secondary:hover {
  background: var(--primary);
  color: var(--white);
  transform: translateY(-2px);
}
</style>

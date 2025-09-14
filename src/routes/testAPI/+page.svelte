<script lang="ts">
	import { getUploadedFiles } from "$lib/utils/files";
	import * as kv from "idb-keyval";
	let folder = $state<[string, FileSystemFileHandle][]>([]);
	folder = (await getUploadedFiles()) ?? [];
	const selectFolder = async () => {
		const dir = await showDirectoryPicker();
		await kv.set("images", dir);
		location.assign("./dashboard");
	};
</script>

<article>
	{#if folder.length}
		<button
			onclick={() => {
				location.assign("./dashboard");
			}}
		>
			<h2>Existing Project</h2>
			<p>{folder.length} images</p></button
		>{/if}
	<button onclick={selectFolder}
		><h2>New Project</h2>
		<p>
			{folder.length ? "WARNING: This will delete your current project." : "Creates a new project."}
		</p></button
	>
</article>

<style>
	article {
		display: flex;
		gap: 1em;
	}
	h2 {
		font-weight: bold;
	}

	button {
		background-color: var(--dark);
		color: var(--light);
		border: var(--dark) 2px solid;
		padding: 0.5em 1em;
		cursor: pointer;
		&:hover {
			background-color: var(--light);
			color: var(--dark);
		}
	}
</style>

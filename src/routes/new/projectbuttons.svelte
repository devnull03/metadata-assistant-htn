<script lang="ts">
	import { queryCohereRemote } from "./data.remote";
	import { getUploadedFiles } from "$lib/utils/files";
	import * as kv from "idb-keyval";
	import { goto } from "$app/navigation";
	let folder = $state<[string, FileSystemFileHandle][]>([]);
	folder = (await getUploadedFiles()) ?? [];
	const selectFolder = async () => {
		const dir = await showDirectoryPicker();
		await dir.requestPermission();
		const entries = [];
		for await (const entry of dir.entries()) {
			if (entry[1].kind !== "file") continue;
			entries.push(entry);
		}
		// TODO
		await batchQuery(entries);
		await kv.set("images", dir);
		goto("./dashboard");
	};

	async function batchQuery(entries: [string, FileSystemFileHandle | FileSystemDirectoryHandle][]) {
		for (const entry of entries) {
			const handle = entry[1];
			if (handle.kind === "file") {
				const file = await handle.getFile();
				const arrayBuffer = await file.arrayBuffer();
				const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
				await queryCohereRemote({ image: imageBase64 });
			}
		}
	}
</script>

<article>
	{#if folder.length}
		<button
			onclick={() => {
				goto("./dashboard");
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

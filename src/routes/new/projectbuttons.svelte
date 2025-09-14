<script lang="ts">
	import { queryCohereRemote } from "./data.remote";
	import { getImageRes } from "$lib/utils/files";

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
		let results = await batchQuery(entries);
		await kv.set("images", dir);
		goto("./dashboard");
	};

	async function batchQuery(entries: [string, FileSystemFileHandle | FileSystemDirectoryHandle][]) {
		const results = entries.map(async (entry) => {
			const handle = entry[1];
			if (handle.kind === "file") {
				const file = await handle.getFile();
				const base64 = await blobToBase64(file);
				return getImageRes(entry[0], base64);
			}
		});

		return await Promise.all(results);
	}

	const blobToBase64 = async (blob: Blob): Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				resolve(result.replace(/^data:image\/[a-z]+;base64,/, ""));
			};
			reader.onerror = (err) => reject(err);
			reader.readAsDataURL(blob);
		});
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

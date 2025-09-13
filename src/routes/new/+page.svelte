<script lang="ts">
	import { showDirectoryPicker } from "native-file-system-adapter";
	import * as kv from "idb-keyval";
	const selectFolder = async () => {
		const dir = await showDirectoryPicker();
		console.log(dir);
		await kv.set("test1", dir);
		console.log(await kv.get("test1"));
	};
	let files = $state<FileList | null | undefined>();

	$effect(() => {
		if (files) {
			// Note that `files` is of type `FileList`, not an Array:
			// https://developer.mozilla.org/en-US/docs/Web/API/FileList
			console.log(files);

			for (const file of files) {
				console.log(`${file.name}: ${file.size} bytes`);
			}
		}
	});
</script>

<input bind:files type="file" webkitdirectory/>

<script lang="ts">
	import { getUploadedFiles } from "$lib/utils/files";
	import * as kv from "idb-keyval";
	const folder = await getUploadedFiles();
	const selectFolder = async () => {
		const dir = await showDirectoryPicker();
		console.log(dir);
		await kv.set("test1", dir);
		console.log(await kv.get("test1"));
	};
	const files = 
</script>

<button onclick={selectFolder}>select folder</button>


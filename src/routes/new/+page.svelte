<script lang="ts">
	import { showDirectoryPicker } from "native-file-system-adapter";

	const selectFolder = async () => {
		const dir = await showDirectoryPicker();
		console.log(dir);
	};
</script>

<button onclick={selectFolder}>select folder</button>

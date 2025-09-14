<script lang="ts">
	import type { Sheet } from "$lib/interfaces/sheet.interface";

	interface Props {
		items: Sheet;
	}

	let { items = $bindable() }: Props = $props();

	$inspect(items.images);
</script>

<div class="w-full">
	{#if items.images && items.images.length > 0}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each items.images as imageRecord, index}
				{#await imageRecord[1].getFile()}
					<div class="text-center py-8 text-muted-foreground">
						<p>Loading image...</p>
					</div>
				{:then file}
					<div class="flex flex-col items-center bg-card p-2 rounded-lg border border-border">
						<img
							src={URL.createObjectURL(file)}
							alt={file.name}
							class="w-full h-48 object-cover rounded-md mb-2"
						/>
						<p class="text-sm text-center break-all">{file.name}</p>
					</div>
				{:catch error}
					<div class="text-red-500">Error loading image</div>
				{/await}
			{/each}
		</div>
	{:else}
		<div class="text-center py-8 text-muted-foreground">
			<p>No images to display</p>
		</div>
	{/if}
</div>

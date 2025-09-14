<script lang="ts">
	import type { Sheet } from "$lib/interfaces/sheet.interface";
	import { Skeleton } from "$lib/components/ui/skeleton";

	interface Props {
		items: Sheet;
		imagesLoading: boolean;
		onViewItemClick?: (img: string, itemFields: Record<string, any> | null) => void;
	}

	let {
		items = $bindable(),
		imagesLoading = true,
		onViewItemClick: onItemClick = $bindable()
	}: Props = $props();

	async function handleItemClick(imageRecord: any) {
		if (onItemClick) {
			const file = await imageRecord[1].getFile();
			if (file) {
				const img = URL.createObjectURL(file);
				const itemFields = items.rows.find((row) => row.file === imageRecord[0]) || null;
				onItemClick(img, itemFields);
			}
		}
	}
</script>

<div class="w-full">
	{#if items.images && items.images.length > 0}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
			{#each items.images as imageRecord, index}
				{#await imageRecord[1].getFile() then file}
					<button
						type="button"
						class="flex flex-col items-center bg-card p-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
						onclick={() => handleItemClick(imageRecord)}
						onkeydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleItemClick(imageRecord);
							}
						}}
						aria-label={`View image ${file.name}`}
					>
						<img
							src={URL.createObjectURL(file)}
							alt={file.name}
							class="w-full h-48 object-cover rounded-md mb-2"
						/>
						<p class="text-sm text-center break-all">{file.name}</p>
					</button>
				{:catch error}
					<div class="text-red-500">Error loading image</div>
				{/await}
			{/each}
		</div>
	{:else if imagesLoading}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
			{#each Array(5) as _}
				<div
					class="flex flex-col items-center bg-card p-2 rounded-lg border border-border *:bg-gray-300"
				>
					<Skeleton class="w-full h-48 rounded-md mb-2" />
					<Skeleton class="h-4 w-3/4" />
				</div>
			{/each}
		</div>
	{:else}
		<div class="text-center py-8 text-muted-foreground">
			<p>No images to display</p>
		</div>
	{/if}
</div>

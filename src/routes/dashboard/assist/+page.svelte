<script lang="ts">
	import * as Collapsible from "$lib/components/ui/collapsible";
	import DataView from "$lib/components/data-view/data-view.svelte";
	import { ChevronDown, ChevronRight, GripHorizontal } from "@lucide/svelte";
	import { type Sheet } from "$lib/interfaces/sheet.interface";
	import { getImageRes, getUploadedFiles } from "$lib/utils/files";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import ImageViewModal from "$lib/components/item-view-modal/item-view-modal.svelte";

	let data: PageData = $props();

	let todoDisplayMode = $state<"spreadsheet" | "grid">(data.data.todoDisplayMode ?? "grid");
	let doneDisplayMode = $state<"spreadsheet" | "grid">(data.data.doneDisplayMode ?? "spreadsheet");

	$inspect(data);

	let sheet_data: Sheet = $state({
		fields: [
			{ title: "Task" },
			{ title: "Description" },
			{ title: "Due Date" },
			{ title: "Priority" }
		],
		rows: [
			{
				Task: "Design Homepage",
				Description: "Create wireframes and mockups for the new homepage.",
				"Due Date": "2024-10-01",
				Priority: "High"
			},
			{
				Task: "Develop API",
				Description: "Build the RESTful API for the mobile app.",
				"Due Date": "2024-10-05",
				Priority: "Medium"
			},
			{
				Task: "Write Documentation",
				Description: "Document the new features and API endpoints.",
				"Due Date": "2024-10-07",
				Priority: "Low"
			},
			{
				Task: "Test Application",
				Description: "Perform unit and integration testing.",
				"Due Date": "2024-10-10",
				Priority: "High"
			},
			{
				Task: "Deploy to Production",
				Description: "Deploy the latest version to the production environment.",
				"Due Date": "2024-10-12",
				Priority: "Medium"
			}
		],
		images: []
	});

	let todoRows: number[] = $state(Array.from({ length: sheet_data.rows.length }, (_, i) => i));
	let doneRows: number[] = $state([]);

	let todoData: Sheet = $derived({
		fields: sheet_data.fields,
		rows: sheet_data.rows?.filter((_, i) => todoRows.includes(i)) || [],
		images: sheet_data.images?.filter((_, i) => todoRows.includes(i)) || []
	});

	let doneData: Sheet = $derived({
		fields: sheet_data.fields,
		rows: sheet_data.rows?.filter((_, i) => doneRows.includes(i)) || [],
		images: sheet_data.images?.filter((_, i) => doneRows.includes(i)) || []
	});

	let todoOpen = $state(true);
	let doneOpen = $state(true);

	$inspect(sheet_data);

	let imagesLoading = $state(true);
	onMount(async () => {
		sheet_data.images = (await getUploadedFiles()) || [];
		imagesLoading = false;
	});

	// $effect(() => {
	// 	const searchParams = new URLSearchParams($page.url.searchParams);

	// 	// Update search params based on display modes
	// 	if (data.todoDisplayMode) {
	// 		searchParams.set("todoMode", data.todoDisplayMode);
	// 	}
	// 	if (data.doneDisplayMode) {
	// 		searchParams.set("doneMode", data.doneDisplayMode);
	// 	}

	// 	// Navigate to the new URL with updated search params
	// 	const newUrl = `${$page.url.pathname}?${searchParams.toString()}`;
	// 	goto(newUrl, { replaceState: true, noScroll: true });
	// });

	let todoHeight = $state(400);
	let doneHeight = $state(400);

	function createResizeHandler(
		heightSetter: (height: number) => void,
		currentHeight: () => number
	) {
		return function (event: MouseEvent) {
			event.preventDefault();
			const startY = event.clientY;
			const startHeight = currentHeight();

			function onMouseMove(e: MouseEvent) {
				const delta = e.clientY - startY;
				const newHeight = Math.max(200, Math.min(800, startHeight + delta));
				heightSetter(newHeight);
			}

			function onMouseUp() {
				document.removeEventListener("mousemove", onMouseMove);
				document.removeEventListener("mouseup", onMouseUp);
			}

			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
		};
	}

	let onItemClick = async (item: any) => {
		const file = await item[1].getFile();
		if (file) {
			imageViewModalData = { img: URL.createObjectURL(file), itemFields: item[1].metadata || null };
			isImageViewModalOpen = true;
		}
	};

	let isImageViewModalOpen = $state(false);
	let imageViewModalData = $state<{ img: string; itemFields: Record<string, any> | null } | null>(
		null
	);
</script>

{#if imageViewModalData}
	<ImageViewModal bind:isOpen={isImageViewModalOpen} {...imageViewModalData} />
{/if}

<div class="p-4 max-w-full">
	<div class="flex flex-col gap-6 w-full">
		<!-- Todo Section -->
		<div class="bg-card border border-border rounded-lg overflow-hidden w-full">
			<Collapsible.Root bind:open={todoOpen}>
				<Collapsible.Trigger class="w-full p-4 bg-muted border-l-4 border-l-destructive">
					<div class="flex items-center gap-2">
						{#if todoOpen}
							<ChevronDown class="h-4 w-4" />
						{:else}
							<ChevronRight class="h-4 w-4" />
						{/if}
						<h2 class="text-lg font-semibold">To Do</h2>
						<span
							class="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium"
							>{todoData.rows.length}</span
						>
					</div>
				</Collapsible.Trigger>
				<Collapsible.Content>
					<div class="relative">
						<div class="py-4 overflow-y-auto" style={`height: ${todoHeight}px`}>
							<DataView
								bind:mode={todoDisplayMode}
								bind:items={todoData}
								{imagesLoading}
								{onItemClick}
							/>
						</div>
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="flex items-center justify-center h-3 bg-muted/50 cursor-row-resize hover:bg-muted transition-colors"
							onmousedown={createResizeHandler(
								(h) => (todoHeight = h),
								() => todoHeight
							)}
						>
							<GripHorizontal class="h-3 w-3 text-muted-foreground" />
						</div>
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>

		<!-- Done Section -->
		<div class="bg-card border border-border rounded-lg overflow-hidden w-full">
			<Collapsible.Root bind:open={doneOpen}>
				<Collapsible.Trigger class="w-full p-4 bg-muted border-l-4 border-l-green-500">
					<div class="flex items-center gap-2">
						{#if doneOpen}
							<ChevronDown class="h-4 w-4" />
						{:else}
							<ChevronRight class="h-4 w-4" />
						{/if}
						<h2 class="text-lg font-semibold">Done</h2>
						<span
							class="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium"
							>{doneData.rows.length}</span
						>
					</div>
				</Collapsible.Trigger>
				<Collapsible.Content>
					<div class="relative">
						<div class="p-4 overflow-y-auto" style={`height: ${doneHeight}px`}>
							<DataView
								bind:mode={doneDisplayMode}
								bind:items={doneData}
								{imagesLoading}
								{onItemClick}
							/>
						</div>
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="flex items-center justify-center h-3 bg-muted/50 cursor-row-resize hover:bg-muted transition-colors"
							onmousedown={createResizeHandler(
								(h) => (doneHeight = h),
								() => doneHeight
							)}
						>
							<GripHorizontal class="h-3 w-3 text-muted-foreground" />
						</div>
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
	</div>
</div>

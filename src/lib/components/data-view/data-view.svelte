<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import { LayoutGrid, AlignJustify } from "@lucide/svelte";
	import Grid from "./grid.svelte";
	import Spreadsheet from "./spreadsheet.svelte";
	import type { ComponentProps } from "svelte";
	import { type Sheet } from "$lib/interfaces/sheet.interface";

	interface DataViewProps extends ComponentProps<typeof Tabs.Root> {
		items: Sheet;
		imagesLoading?: boolean;
		mode?: "grid" | "spreadsheet";
		onItemClick?: (img: string, itemFields: Record<string, any> | null,filename: string) => void;
		questions?: Array<{ label: string; value: string }>;
	}
	let {
		ref = $bindable(null),
		items = $bindable(),
		imagesLoading = false,
		mode = $bindable("grid"),
		onItemClick = $bindable(() => {}),
		questions,
		...restProps
	}: DataViewProps = $props();
</script>

<div>
	<Tabs.Root bind:value={mode} {...restProps}>
		<Tabs.List>
			<Tabs.Trigger value="grid"><LayoutGrid /></Tabs.Trigger>
			<Tabs.Trigger value="spreadsheet"><AlignJustify /></Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="grid">
			<Grid bind:items {imagesLoading} onViewItemClick={onItemClick} />
		</Tabs.Content>
		<Tabs.Content value="spreadsheet">
			<Spreadsheet bind:items onViewItemClick={onItemClick} />
		</Tabs.Content>
	</Tabs.Root>
</div>

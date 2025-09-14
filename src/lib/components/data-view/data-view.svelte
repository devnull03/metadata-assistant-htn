<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import { LayoutGrid, AlignJustify } from "@lucide/svelte";
    import Grid from "./grid.svelte";
    import Spreadsheet from "./spreadsheet.svelte";
    import type { ComponentProps } from "svelte";
    import { type Sheet } from "$lib/interfaces/sheet.interface";

    interface DataViewProps extends ComponentProps<typeof Tabs.Root> {
        items: Sheet;
        
    }
    let { ref = $bindable(null), items, ...restProps }: DataViewProps = $props();

    let defaultView: "grid" | "spreadsheet" = "grid";
</script>

<div>
    <Tabs.Root value={defaultView} {...restProps}>
        <Tabs.List>
            <Tabs.Trigger value="grid"><LayoutGrid /></Tabs.Trigger>
            <Tabs.Trigger value="spreadsheet"><AlignJustify /></Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="grid">
            <Grid bind:items />
        </Tabs.Content>
        <Tabs.Content value="spreadsheet">
            <Spreadsheet bind:items />
        </Tabs.Content>
    </Tabs.Root>
</div>

<script lang="ts">
    import * as Collapsible from "$lib/components/ui/collapsible";
    import DataView from "$lib/components/data-view/data-view.svelte";
    import { ChevronDown, ChevronRight } from "@lucide/svelte";
    import type { Sheet } from "$lib/interfaces/sheet.interface";
    import { getUploadedFiles } from "$lib/utils/files";
    import { onMount } from "svelte";
    import ItemViewModalProps from "$lib/components/item-view-modal/item-view-modal.svelte";

    let mockdata: Sheet = $state({
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

    let todoRows: number[] = $state(Array.from({ length: mockdata.rows.length }, (_, i) => i));
    let inProgressRows: number[] = $state([]);
    let doneRows: number[] = $state([]);

    let todoData: Sheet = $derived({
        fields: mockdata.fields,
        rows: mockdata.rows?.filter((_, i) => todoRows.includes(i)) || [],
        images: mockdata.images?.filter((_, i) => todoRows.includes(i)) || []
    });

    let inProgressData: Sheet = $derived({
        fields: mockdata.fields,
        rows: mockdata.rows?.filter((_, i) => inProgressRows.includes(i)) || [],
        images: mockdata.images?.filter((_, i) => inProgressRows.includes(i)) || []
    });

    let doneData: Sheet = $derived({
        fields: mockdata.fields,
        rows: mockdata.rows?.filter((_, i) => doneRows.includes(i)) || [],
        images: mockdata.images?.filter((_, i) => doneRows.includes(i)) || []
    });

    let todoOpen = $state(true);
    let inProgressOpen = $state(true);
    let doneOpen = $state(true);

    $inspect(mockdata);

    onMount(async () => {
        mockdata.images = (await getUploadedFiles()) || [];
        mockdata = mockdata;
        // console.log(mockdata.images);
    });

    let isOpen = true;
    let img = "/sample/photos/1.jpg";
    let item = { title: "Sample Photo", description: "This is a sample." };
    
</script>

<ItemViewModalProps {isOpen} {img} {item}></ItemViewModalProps>

<div class="p-4 max-w-full">
    <h1 class="text-2xl font-bold mb-6">Task Management Board</h1>

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
                <Collapsible.Content class="max-h-96 overflow-y-auto">
                    <div class="p-4">
                        <DataView bind:items={todoData} />
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>

        <!-- In Progress Section -->
        <div class="bg-card border border-border rounded-lg overflow-hidden w-full">
            <Collapsible.Root bind:open={inProgressOpen}>
                <Collapsible.Trigger class="w-full p-4 bg-muted border-l-4 border-l-yellow-500">
                    <div class="flex items-center gap-2">
                        {#if inProgressOpen}
                            <ChevronDown class="h-4 w-4" />
                        {:else}
                            <ChevronRight class="h-4 w-4" />
                        {/if}
                        <h2 class="text-lg font-semibold">In Progress</h2>
                        <span
                            class="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium"
                            >{inProgressData.rows.length}</span
                        >
                    </div>
                </Collapsible.Trigger>
                <Collapsible.Content class="max-h-96 overflow-y-auto">
                    <div class="p-4">
                        <DataView bind:items={inProgressData} />
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
                <Collapsible.Content class="max-h-96 overflow-y-auto">
                    <div class="p-4">
                        <DataView bind:items={doneData} />
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    </div>
</div>

<script lang="ts">
    import * as Collapsible from "$lib/components/ui/collapsible";
    import DataView from "$lib/components/data-view/data-view.svelte";
    import { ChevronDown, ChevronRight } from "@lucide/svelte";
    import type { Sheet } from "$lib/interfaces/sheet.interface";
    import ItemViewModal from "$lib/components/item-view-modal/item-view-modal.svelte";

    // Sample data for each section - replace with your actual data
    let todoData: Sheet = {
        fields: [
            { title: "Task", instructions: "Task description" },
            { title: "Priority", instructions: "Task priority" },
            { title: "Assignee", instructions: "Person assigned" }
        ],
        rows: [
            { Task: "Review metadata schema", Priority: "High", Assignee: "John" },
            { Task: "Update documentation", Priority: "Medium", Assignee: "Jane" }
        ]
    };

    let inProgressData: Sheet = {
        fields: [
            { title: "Task", instructions: "Task description" },
            { title: "Priority", instructions: "Task priority" },
            { title: "Assignee", instructions: "Person assigned" }
        ],
        rows: [{ Task: "Implementing AI assistant", Priority: "High", Assignee: "Mike" }]
    };

    let doneData: Sheet = {
        fields: [
            { title: "Task", instructions: "Task description" },
            { title: "Priority", instructions: "Task priority" },
            { title: "Assignee", instructions: "Person assigned" }
        ],
        rows: [
            { Task: "Setup project structure", Priority: "High", Assignee: "Sarah" },
            { Task: "Design UI mockups", Priority: "Medium", Assignee: "Alex" }
        ]
    };

    // Collapsible states
    let todoOpen = $state(true);
    let inProgressOpen = $state(true);
    let doneOpen = $state(true);

    let itemViewModalOpen = $state(false);
   let currentModalData = $state({
    img: "",
    item: null,
 }) 
</script>

<ItemViewModal bind:isOpen={itemViewModalOpen} {...currentModalData} />

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
                        <DataView items={todoData} />
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
                        <DataView items={inProgressData} />
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
                        <DataView items={doneData} />
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    </div>
</div>

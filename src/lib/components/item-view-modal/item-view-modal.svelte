<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    
    // Props interface for type safety
    interface ItemViewModalProps {
        isOpen: boolean;
        img: string;
        item: Record<string, any> | null;
    }

    // Get props in legacy mode
    let { isOpen = $bindable(false), img, item }: ItemViewModalProps = $props();
</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Trigger></Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>{item?.title ?? "Item Preview"}</Dialog.Title>
            <Dialog.Description>
                {item?.description ?? "No description available."}
            </Dialog.Description>
        </Dialog.Header>

        {#if img}
            <img src={img} alt={item?.title ?? "Preview"} />
        {/if}
    </Dialog.Content>
</Dialog.Root>

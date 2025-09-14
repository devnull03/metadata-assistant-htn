<script lang="ts">

     import * as Dialog from "$lib/components/ui/dialog/index.js";

    
interface ItemViewModalProps {
    isOpen: boolean;
    onClose?: () => void;

    img: string;
    item: Record<string, any> | null;

}

let { isOpen = $bindable(), onClose, img, item}: ItemViewModalProps = $props()

</script>
 
<Dialog.Root bind:open={isOpen}>
 <Dialog.Trigger></Dialog.Trigger>
 <Dialog.Content>
  <Dialog.Header>
   <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
   <Dialog.Description>
    This action cannot be undone. This will permanently delete your account
    and remove your data from our servers.
   </Dialog.Description>
  </Dialog.Header>
 </Dialog.Content>
</Dialog.Root>

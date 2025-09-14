<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	// Props interface for type safety
	interface ItemViewModalProps {
		isOpen: boolean;
		img?: string;
		itemFields: Record<string, any> | null;
	}

	// Get props in legacy mode
	let { isOpen = $bindable(false), img, itemFields }: ItemViewModalProps = $props();
	let questions = [
		{ label: "Name", value: "Pedro Duarte" },
		{ label: "Username", value: "@peduarte" }
	];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger></Dialog.Trigger>
	<Dialog.Content class="flex">
		<div class="gap-10">
			<div>
				{#if img}
					<img src={img} alt={itemFields?.title ?? "Preview"} />
				{/if}
			</div>
			<div class="grid gap-4 py-4">
				{#each Object.entries(itemFields ?? {}) as [key, value]}
					<div class="flex gap-2">
						<span class="font-semibold">{key}:</span>
						<span>{value}</span>
					</div>
				{/each}
			</div>
		</div>
		<div>
			<Dialog.Header>
				<Dialog.Title>Questions:</Dialog.Title>
				<Dialog.Description>
					Please answer the following questions regarding the image:
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				{#each questions as q}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label class="text-right">{q.label}</Label>
						<Input value={q.value} class="col-span-3" />
					</div>
				{/each}
			</div>
			<Dialog.Footer>
				<Button type="submit">Save changes</Button>
			</Dialog.Footer>
		</div>
	</Dialog.Content>
</Dialog.Root>

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
		questions?: Array<{ label: string; value: string }>;
	}

	// Get props in legacy mode
	let {
		isOpen = $bindable(false),
		img,
		itemFields,
		questions: propsQuestions
	}: ItemViewModalProps = $props();

	$inspect(itemFields);

	// Use props questions if provided, otherwise fallback to default
	let questions = propsQuestions ?? [
		{ label: "Name", value: "Pedro Duarte" },
		{ label: "Username", value: "@peduarte" }
	];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="max-w-none! w-[80vw] h-[90vh] p-0 flex">
		<!-- Left side - Image and Fields (70%) -->
		<div class="flex-[0.7] flex flex-col p-6 border-r overflow-y-auto">
			<!-- Image section -->
			<div class="flex-shrink-0 mb-6">
				{#if img}
					<img
						src={img}
						alt={itemFields?.title ?? "Preview"}
						class="max-w-full w-full max-h-[40vh] object-contain rounded-lg shadow-sm"
					/>
				{/if}
			</div>

			<!-- Fields section -->
			<div class="flex-1">
				<h3 class="text-lg font-semibold mb-4">Item Details</h3>
				<div class="grid gap-3">
					{#each Object.entries(itemFields ?? {}) as [key, value]}
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium text-muted-foreground">{key}</span>
							<span class="text-sm bg-muted rounded-md p-2">{value}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Right side - Chat Interface (30%) -->
		<div class="flex-[0.3] flex flex-col">
			<Dialog.Header class="p-6 pb-4 border-b">
				<Dialog.Title>AI Assistant</Dialog.Title>
				<Dialog.Description>
					Ask questions about this image or get help with metadata
				</Dialog.Description>
			</Dialog.Header>

			<!-- Chat messages area -->
			<div class="flex-1 overflow-y-auto p-6 space-y-4">
				{#each questions as q}
					<!-- AI Question -->
					<div class="flex gap-3">
						<div
							class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground"
						>
							AI
						</div>
						<div class="flex-1">
							<div class="bg-muted rounded-lg p-3 text-sm">
								{q.label}?
							</div>
						</div>
					</div>

					<!-- User Response -->
					<div class="flex gap-3 justify-end">
						<div class="flex-1 max-w-[80%]">
							<div class="bg-primary text-primary-foreground rounded-lg p-3 text-sm">
								{q.value}
							</div>
						</div>
						<div
							class="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold"
						>
							U
						</div>
					</div>
				{/each}
			</div>

			<!-- Chat input area -->
			<div class="p-6 pt-4 border-t">
				<div class="flex gap-2">
					<Input placeholder="Ask a question about this image..." class="flex-1" />
					<Button size="sm">Send</Button>
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

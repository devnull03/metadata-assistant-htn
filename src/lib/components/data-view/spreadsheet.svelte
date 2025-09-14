<script lang="ts">
	import type { Sheet, SpreadsheetData } from "$lib/interfaces/sheet.interface";
	import {
		encodeCell,
		decodeCell,
		encodeCol,
		getBorder,
		clearSelection,
		pasteSelection,
		computeStyles,
		getColumnWidth,
		getRowHeight,
		handleKeyboardNavigation,
		normalizeSpreadsheetData,
		defaultConfig,
		type SpreadsheetConfig
	} from "$lib/utils/spreadsheet";
	import { cn } from "$lib/utils";

	interface Props {
		items: Sheet;
		config?: Partial<SpreadsheetConfig>;
		class?: string;
	}

	let { items = $bindable(), config = {}, class: className }: Props = $props();

	// Focus action for better accessibility
	function focus(node: HTMLElement) {
		node.focus();
		return {
			destroy() {
				// cleanup if needed
			}
		};
	}

	// Convert Sheet to SpreadsheetData format
	let spreadsheetData = $derived.by(() => {
		if (!items) return null;

		// Create columns from fields
		const columns = items.fields.map((field) => ({
			title: field.title,
			width: "150px",
			type: "text" as const,
			readOnly: false,
			align: "left" as const
		}));

		// Convert rows to 2D array
		const data = items.rows.map((row) => items.fields.map((field) => row[field.title] || ""));

		return {
			data: normalizeSpreadsheetData(data, 15, Math.max(columns.length, 6)),
			columns,
			rows: data.map(() => ({ height: "28px" })),
			mergeCells: {},
			style: {},
			selected: null as [string, string] | null,
			currentValue: ""
		};
	});

	// Spreadsheet state
	let selected = $state<[string, string] | null>(null);
	let clipboard = $state<[string, string] | null>(null);
	let currentValue = $state<string>("");
	let editing = $state<[number, number] | null>(null);
	let shiftPressed = $state(false);
	let ctrlPressed = $state(false);

	// Configuration
	const finalConfig = $derived({ ...defaultConfig, ...config });

	// Get current cell value when selection changes
	$effect(() => {
		if (selected && spreadsheetData) {
			const [start] = selected;
			const { c, r } = decodeCell(start);
			currentValue = spreadsheetData.data[r]?.[c] || "";
		}
	});

	// Sync changes back to items
	$effect(() => {
		if (spreadsheetData && items) {
			// Convert back to Sheet format
			const updatedRows = spreadsheetData.data
				.map((row) => {
					const rowObject: Record<string, any> = {};
					row.forEach((value, index) => {
						const fieldTitle = items.fields[index]?.title;
						if (fieldTitle && value !== "") {
							rowObject[fieldTitle] = value;
						}
					});
					return rowObject;
				})
				.filter((row) => Object.keys(row).length > 0);

			if (JSON.stringify(updatedRows) !== JSON.stringify(items.rows)) {
				items.rows = updatedRows;
			}
		}
	});

	// Event handlers
	function handleCellClick(colIndex: number, rowIndex: number, event: MouseEvent) {
		const cellAddress = encodeCell({ c: colIndex, r: rowIndex });

		if (shiftPressed && selected) {
			selected = [selected[0], cellAddress];
		} else {
			selected = [cellAddress, cellAddress];
		}

		editing = null; // Stop editing when clicking
	}

	function handleCellDoubleClick(colIndex: number, rowIndex: number) {
		editing = [colIndex, rowIndex];
		const cellAddress = encodeCell({ c: colIndex, r: rowIndex });
		selected = [cellAddress, cellAddress];
	}

	function handleInputChange(value: string, colIndex: number, rowIndex: number) {
		if (!spreadsheetData) return;

		// Update the data
		if (!spreadsheetData.data[rowIndex]) {
			spreadsheetData.data[rowIndex] = [];
		}
		spreadsheetData.data[rowIndex][colIndex] = value;

		// Trigger reactivity
		spreadsheetData.data = [...spreadsheetData.data];
	}

	function handleInputBlur() {
		editing = null;
	}

	function handleKeyDown(event: KeyboardEvent) {
		// Track modifier keys
		shiftPressed = event.shiftKey;
		ctrlPressed = event.ctrlKey || event.metaKey;

		// Handle keyboard navigation
		if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Tab"].includes(event.key)) {
			event.preventDefault();
			const newSelection = handleKeyboardNavigation(
				event,
				selected,
				spreadsheetData?.data || [],
				shiftPressed
			);
			if (newSelection) {
				selected = newSelection;
			}
			editing = null;
		}

		// Handle copy/paste
		if (ctrlPressed) {
			switch (event.key.toLowerCase()) {
				case "c":
					event.preventDefault();
					clipboard = selected;
					break;
				case "v":
					event.preventDefault();
					if (clipboard && selected && spreadsheetData) {
						spreadsheetData.data = pasteSelection(spreadsheetData.data, clipboard, selected);
					}
					break;
				case "x":
					event.preventDefault();
					clipboard = selected;
					if (selected && spreadsheetData) {
						spreadsheetData.data = clearSelection(spreadsheetData.data, selected);
					}
					break;
			}
		}

		// Handle delete
		if (event.key === "Delete" && selected && spreadsheetData) {
			event.preventDefault();
			spreadsheetData.data = clearSelection(spreadsheetData.data, selected);
		}

		// Handle escape
		if (event.key === "Escape") {
			editing = null;
			selected = null;
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		shiftPressed = event.shiftKey;
		ctrlPressed = event.ctrlKey || event.metaKey;
	}

	function handleColumnHeaderClick(colIndex: number) {
		const start = encodeCell({ c: colIndex, r: 0 });
		const end = encodeCell({ c: colIndex, r: (spreadsheetData?.data.length || 10) - 1 });
		selected = [start, end];
		editing = null;
	}

	function handleRowHeaderClick(rowIndex: number) {
		const start = encodeCell({ c: 0, r: rowIndex });
		const end = encodeCell({ c: (spreadsheetData?.columns.length || 6) - 1, r: rowIndex });
		selected = [start, end];
		editing = null;
	}

	// Get selection boundaries for styling
	const selectionBounds = $derived.by(() => {
		if (!selected) return null;
		return getBorder(selected);
	});

	function isCellSelected(colIndex: number, rowIndex: number): boolean {
		if (!selectionBounds) return false;
		return (
			colIndex >= selectionBounds.tl.c &&
			colIndex <= selectionBounds.br.c &&
			rowIndex >= selectionBounds.tl.r &&
			rowIndex <= selectionBounds.br.r
		);
	}

	function isColumnSelected(colIndex: number): boolean {
		if (!selectionBounds) return false;
		return colIndex >= selectionBounds.tl.c && colIndex <= selectionBounds.br.c;
	}

	function isRowSelected(rowIndex: number): boolean {
		if (!selectionBounds) return false;
		return rowIndex >= selectionBounds.tl.r && rowIndex <= selectionBounds.br.r;
	}
</script>

<svelte:window onkeydown={handleKeyDown} onkeyup={handleKeyUp} />

{#if spreadsheetData}
	<div
		class={cn("spreadsheet-container border rounded-lg overflow-hidden bg-background", className)}
		tabindex="0"
		role="grid"
		aria-label="Spreadsheet"
	>
		<!-- Formula bar -->
		<div class="formula-bar flex items-center gap-2 p-2 border-b bg-muted/30">
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium text-muted-foreground">Cell:</span>
				<div class="px-2 py-1 text-sm bg-background border rounded min-w-[60px] text-center">
					{selected ? selected[0] : ""}
				</div>
			</div>
			<div class="flex items-center gap-2 flex-1">
				<span class="text-sm font-medium text-muted-foreground">Value:</span>
				<input
					type="text"
					value={currentValue}
					placeholder="Enter value..."
					class="flex-1 px-3 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
					readonly={!selected}
					onchange={(e) => {
						if (selected) {
							const { c, r } = decodeCell(selected[0]);
							handleInputChange(e.currentTarget.value, c, r);
						}
					}}
				/>
			</div>
		</div>

		<!-- Spreadsheet table -->
		<div
			class="spreadsheet-table overflow-auto"
			style={`max-height: ${finalConfig.tableHeight || "400px"}`}
		>
			<table class="w-full border-collapse">
				<!-- Column headers -->
				<thead class="sticky top-0 bg-muted/50 border-b">
					<tr>
						<!-- Top-left corner cell -->
						<th class="w-10 h-8 border-r border-b bg-muted text-center"></th>

						<!-- Column headers -->
						{#each spreadsheetData.columns as column, colIndex}
							<th
								class={cn(
									"h-8 px-2 border-r border-b bg-muted text-center text-sm font-medium cursor-pointer hover:bg-muted/80 min-w-[100px]",
									isColumnSelected(colIndex) && "bg-primary/20"
								)}
								style={`width: ${getColumnWidth(colIndex, spreadsheetData.columns)}px`}
								onclick={() => handleColumnHeaderClick(colIndex)}
								role="columnheader"
							>
								{column.title || encodeCol(colIndex)}
							</th>
						{/each}
					</tr>
				</thead>

				<!-- Table body -->
				<tbody>
					{#each spreadsheetData.data as row, rowIndex}
						<tr>
							<!-- Row header -->
							<td
								class={cn(
									"w-10 h-7 border-r border-b bg-muted text-center text-sm font-medium cursor-pointer hover:bg-muted/80 sticky left-0",
									isRowSelected(rowIndex) && "bg-primary/20"
								)}
								onclick={() => handleRowHeaderClick(rowIndex)}
								role="rowheader"
							>
								{rowIndex + 1}
							</td>

							<!-- Data cells -->
							{#each spreadsheetData.columns as column, colIndex}
								<td
									class={cn(
										"h-7 border-r border-b p-0 relative min-w-[100px]",
										isCellSelected(colIndex, rowIndex) && "bg-primary/10",
										editing?.[0] === colIndex && editing?.[1] === rowIndex && "bg-primary/20"
									)}
									style={`width: ${getColumnWidth(colIndex, spreadsheetData.columns)}px; ${computeStyles(colIndex, rowIndex, row, spreadsheetData.style, finalConfig, row[colIndex], row[colIndex + 1])}`}
									onclick={(e) => handleCellClick(colIndex, rowIndex, e)}
									ondblclick={() => handleCellDoubleClick(colIndex, rowIndex)}
									role="gridcell"
									tabindex="-1"
								>
									{#if editing?.[0] === colIndex && editing?.[1] === rowIndex}
										<input
											type="text"
											value={row[colIndex] || ""}
											class="w-full h-full px-2 text-sm border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
											style={`width: ${getColumnWidth(colIndex, spreadsheetData.columns)}px`}
											oninput={(e) => handleInputChange(e.currentTarget.value, colIndex, rowIndex)}
											onblur={handleInputBlur}
											use:focus
										/>
									{:else}
										<div class="px-2 py-1 text-sm truncate">
											{row[colIndex] || ""}
										</div>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Status bar -->
		<div
			class="status-bar flex items-center justify-between p-2 border-t bg-muted/30 text-sm text-muted-foreground"
		>
			<div class="flex items-center gap-4">
				<span>
					{spreadsheetData.data.length} rows × {spreadsheetData.columns.length} columns
				</span>
				{#if selected}
					<span>
						Selected: {selected[0]}{selected[1] && selected[1] !== selected[0]
							? `:${selected[1]}`
							: ""}
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-2 text-xs">
				<span>Ctrl+C: Copy</span>
				<span>Ctrl+V: Paste</span>
				<span>Del: Clear</span>
				<span>F2/Double-click: Edit</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.spreadsheet-container {
		--cell-height: 28px;
		--header-height: 32px;
	}

	.spreadsheet-table {
		/* Enable smooth scrolling */
		scroll-behavior: smooth;
	}

	/* Improve table rendering performance */
	.spreadsheet-table table {
		table-layout: fixed;
	}

	/* Selection styling */
	.spreadsheet-container:focus-within {
		outline: 2px solid hsl(var(--primary));
		outline-offset: -2px;
	}

	/* Cell border styling for better visual separation */
	td,
	th {
		border-color: hsl(var(--border));
	}

	/* Ensure text doesn't wrap in cells */
	td div {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>

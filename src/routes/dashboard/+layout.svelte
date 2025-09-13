<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import SiteHeader from "$lib/components/site-header.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import type { LayoutProps } from "./$types";
	import { curMode } from "$lib/stores";

	let props: LayoutProps = $props();
</script>

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col">
		<SiteHeader sub={[$curMode]} />
		<div class="flex flex-1">
			<AppSidebar />
			<Sidebar.Inset>
				{@render props.children?.()}
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>

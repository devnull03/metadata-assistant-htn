<script lang="ts">
    import { queryCohere } from '../lib/server/server';
    import { onMount } from "svelte";
    onMount(async () => {
        await queryCohere();
    });
</script>

<h1>Recent posts</h1>

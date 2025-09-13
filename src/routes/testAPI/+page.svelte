<script lang="ts">
    import { onMount } from "svelte";
    import { getPosts } from './data.remote'

    onMount(async () => {
        await getPosts();
    })

</script>

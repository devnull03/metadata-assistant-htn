<script lang="ts">
    import { onMount } from "svelte";
    import { getPosts } from './data.remote'

    onMount(async () => {
        await getPosts([{
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the logo!' },
          {
            type: 'image_url',
            imageUrl: {
              url: 'https://bpb-us-w2.wpmucdn.com/sites.uwm.edu/dist/4/404/files/2016/12/ad000001-yaguxo-e1499062679869.jpg',
              detail: 'auto',
            },
          },
        ],
      }]);
    })

</script>

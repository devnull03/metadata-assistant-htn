<script lang="ts">

    import { CohereClientV2 } from 'cohere-ai';
    const cohere = new CohereClientV2({
        token: "COHERE_API_KEY",
    });
    export async function queryCohere() {
        const response = await cohere.chat({
            model: 'command-a-vision-07-2025',
            messages: [
            {
                role: 'user',
                content: [
                { type: 'text', text: 'Describe the logo!' },
                {
                    type: 'image_url',
                    imageUrl: {
                    url: 'https://cohere.com/favicon-32x32.png',
                    detail: 'auto',
                    },
                },
                ],
            },
            ],
        });

        console.log(response.message.content);
        return response.message.content;
}
    import { onMount } from "svelte";
    onMount(async () => {
        await queryCohere();
    });
</script>

<h1>Recent posts</h1>

<script lang="ts">
  let result = '';

  async function callEndpoint() {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Describe the logo!' })
    });
    const data = await res.json();
    result = JSON.stringify(data, null, 2);
  }
</script>

<button on:click={callEndpoint}>Call Assistant</button>
<pre>{result}</pre>
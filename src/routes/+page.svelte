<script>
	import SvelteMarkdown from 'svelte-markdown';
	import { fly } from 'svelte/transition';

	let resp = '';
	let query = '';
	let isLoading = false;
	$: chatLog = [];

	async function queryModel() {
		chatLog = [...chatLog, { role: 'human', chat: query }];
		smoothScrollToBottom();
		isLoading = true;
		const response = await fetch(`/resp?message=${query + "((((to continue, here is the conversation so far: " + JSON.stringify(chatLog) + "))))"}`);
		let rawResp = await response.json();
		isLoading = false;
		// set resp to the response from the server 5-10 characters at a time
		resp = '';
		chatLog = [...chatLog, { role: 'bot', chat: "" }];
		for (let i = 0; i < rawResp.message.length; i += 5) {
			resp += rawResp.message.slice(i, i + 5);
			chatLog[chatLog.length - 1].chat = resp;
			await new Promise((r) => setTimeout(r, 2));
		}
		console.log(resp);
		smoothScrollToBottom();
		console.log(chatLog);
	}

	async function clearChat() {
		const response = await fetch(`/resp?message=${"!clear"}`);
		chatLog = [];
	}

	function smoothScrollToBottom() {
		// target html tag
		const chatLog = document.getElementsByTagName('html')[0];
		chatLog.scrollTop = chatLog.scrollHeight;
	}
</script>

<div class="flex items-end justify-center bg-base-300">
	<div class="container mx-auto flex flex-col items-stretch h-[100%]">
		<div class="noscrollbar h-full">
				{#each chatLog as chat}
					{#if chat.role == 'human'}
						<div in:fly={{ y: 30, duration: 100 }} class="chat chat-end">
							<div class="chat-bubble">{chat.chat}</div>
						</div>
					{:else}
						<div in:fly={{ y: 30, duration: 100 }} class="chat chat-start">
							<div class="chat-bubble prose prose-invert">
								<SvelteMarkdown source={chat.chat} />
							</div>
						</div>
					{/if}
				{/each}
		</div>
		<!-- input text field -->
		<div class="flex items-center m-3">
			<input type="text" class="input rounded-l-full input-bordered w-full" bind:value={query} />
			<button class="btn btn-primary rounded-r-full" on:click={queryModel}>Send</button>
			<button class="btn btn-secondary ml-2 rounded-full" on:click={clearChat}>New</button>
		</div>
	</div>
</div>

<style>
	.noscrollbar::-webkit-scrollbar {
		display: none;
	}
</style>

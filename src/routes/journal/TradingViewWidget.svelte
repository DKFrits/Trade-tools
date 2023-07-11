<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	export let options = {};
	const SCRIPT_ID = 'tradingview-widget-script';
	let CONTAINER_ID = '';

	onMount(() => {
		CONTAINER_ID =
			options && options.container_id ? options.container_id : 'svelte-tradingview-widget;';
		appendScript(initWidget);
	});

	function initWidget() {
		if (typeof TradingView !== 'undefined') {
			new window.TradingView.widget(Object.assign({ container_id: CONTAINER_ID }, options));
			drawLine();
		}
	}

	function drawLine() {}

	function appendScript(onload) {
		const script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.type = 'text/javascript';
		script.async = true;
		script.src = 'https://s3.tradingview.com/tv.js';
		script.onload = onload;
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	$: autosize = options.autosize;
</script>

<div id={CONTAINER_ID} class:autosize />

<style>
	.autosize {
		width: 100%;
		height: 100%;
	}
</style>

<script>
	import TradingViewWidget from './TradingViewWidget.svelte';

	let options = {
		symbol: 'BINANCE:BTCUSDT',
		theme: 'dark',
		locale: 'fr',
		hide_side_toolbar: false
	};
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1 text-center">Trade Journal</h1>
		<TradingViewWidget {options} />
	</div>
</div>

<style lang="postcss">
</style>

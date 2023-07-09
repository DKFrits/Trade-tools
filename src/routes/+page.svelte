<script lang="ts">
	let equity: number;
	let positionType: string = 'Long';
	let risk: number = 1;
	let entry: number;
	let takeProfit: number;
	let stopLoss: number;

	let positionSize: number;
	let contracts: number;
	let stopCost: number;
	let profit: number;
	let riskRewardRatio: number;

	export const calculateLong = () => {
		positionSize = (equity * (risk / 100)) / (entry - stopLoss);
		contracts = entry * positionSize;
		stopCost = positionSize * entry - positionSize * stopLoss;
		profit = positionSize * takeProfit - positionSize * entry;
		riskRewardRatio = profit / stopCost;
	};

	export const calculateShort = () => {
		positionSize = (equity * (risk / 100)) / (stopLoss - entry);
		contracts = entry * positionSize;
		stopCost = positionSize * stopLoss - positionSize * entry;
		profit = positionSize * entry - positionSize * takeProfit;
		riskRewardRatio = profit / stopCost;
	};
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1 text-center">Stock/Crypto Position Calculator</h1>
		<div class="flex flex-row gap-x-12 gap-y-6 justify-center max-w-screen-md flex-wrap pt-4">
			<label class="label text-lg">
				<span>Equity</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={equity} type="search" placeholder="" />
				</div>
			</label>
			<label class="label">
				<span>Position Type</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class={positionType == 'Long' ? 'bg-green-500' : 'bg-primary-500'} />
					<select bind:value={positionType} class="select border-none px-[5.45rem]">
						<option value="Long">Long</option>
						<option value="Short">Short</option>
					</select>
				</div>
			</label>
			<label class="label text-lg">
				<span>Risk</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">%</div>
					<input bind:value={risk} type="search" placeholder="" />
				</div>
			</label>
			<label class="label text-lg">
				<span>Entry</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={entry} type="search" placeholder="" />
				</div>
			</label>
			<label class="label text-lg">
				<span>Take profit</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={takeProfit} type="search" placeholder="" />
				</div>
			</label>
			<label class="label text-lg">
				<span>Stop Loss</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={stopLoss} type="search" placeholder="" />
				</div>
			</label>
		</div>
		<div class="flex justify-center pt-4">
			<button
				on:click={positionType == 'Long' ? calculateLong : calculateShort}
				type="button"
				class="btn variant-filled-primary">Calculate</button
			>
		</div>
		{#if positionSize}
			<div class="pt-4 px-16">
				<div class="card">
					<section class="p-4">
						<div class="flex flex-col px-2 gap-y-3">
							<div class="flex flex-row gap-x-3">
								<span class="badge variant-filled-primary text-base w-24">Position</span>
								<p class="my-auto text-lg">{positionSize ? positionSize.toFixed(3) : ''}</p>
							</div>
							<div class="flex flex-row gap-x-3">
								<span class="badge variant-filled-primary text-base w-24">Contracts</span>
								<p class="my-auto text-lg">{contracts ? contracts.toFixed(2) : ''}</p>
							</div>
							<div class="flex flex-row gap-x-3">
								<span class="badge variant-filled-primary text-base w-24">Stop Cost</span>
								<p class="my-auto text-lg">{stopCost ? '$ ' + stopCost.toFixed(3) : ''}</p>
							</div>
							<div class="flex flex-row gap-x-3">
								<span class="badge variant-filled-primary text-base w-24">Profit</span>
								<p class="my-auto text-lg">{profit ? '$ ' + profit.toFixed(2) : ''}</p>
							</div>
							<div class="flex flex-row gap-x-3">
								<span class="badge variant-filled-primary text-base w-24">RRR</span>
								<p class="my-auto text-lg">{riskRewardRatio ? riskRewardRatio.toFixed(2) : ''}</p>
							</div>
						</div>
					</section>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	::selection {
		@apply bg-primary-500/30;
	}

	.input-group div {
		width: 3.5rem;
	}
</style>

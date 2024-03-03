<script lang="ts">
	import { toastStore, type ToastSettings, Toast } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let equity: number;
	let positionType: string = 'Long';
	let risk: number = 1;
	let entry: number;
	let stopLoss: number;
	let pairing: string = 'BTCUSDT';

	let tp1: number;
	let tp2: number;
	let tp3: number;
	let tp4: number;

	let positionSize: number;
	let contracts: number;
	let stopCost: number;
	let profit: number;
	let riskRewardRatio: number;

	export const calculateLong = () => {
		positionSize = (equity * (risk / 100)) / (entry - stopLoss);
		contracts = entry * positionSize;
		stopCost = positionSize * entry - positionSize * stopLoss;
		profit = positionSize * tp1 - positionSize * entry;
		riskRewardRatio = profit / stopCost;
		saveValues();
	};

	export const calculateShort = () => {
		positionSize = (equity * (risk / 100)) / (stopLoss - entry);
		contracts = entry * positionSize;
		stopCost = positionSize * stopLoss - positionSize * entry;
		profit = positionSize * entry - positionSize * tp1;
		riskRewardRatio = profit / stopCost;
		saveValues();
	};

	export const placeOrder = async () => {
		fetch('http://localhost:3333/place-order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				positionType,
				positionSize: positionSize.toFixed(3),
				entry,
				stopLoss,
				takeProfit: tp1
			})
		})
			.then((res) => {
				if (res.status == 200) {
					const toast: ToastSettings = {
						message: 'Succesfully placed order',
						timeout: 3000,
						background: 'bg-green-500'
					};
					toastStore.trigger(toast);
				}
			})
			.catch((error) => {
				const toast: ToastSettings = {
					message: 'Could not place order',
					timeout: 3000,
					background: 'bg-red-500'
				};
				toastStore.trigger(toast);
			});
		await getAvailableBalance();
	};

	export const getAvailableBalance = async () => {
		await fetch(`http://localhost:3333/balance`, {
			method: 'GET'
		})
			.then(async (res) => {
				await res.json().then((x) => {
					equity = Number.parseFloat(x.balance);
				});
			})
			.catch((error) => {
				const toast: ToastSettings = {
					message: 'Could not get balance',
					timeout: 3000,
					background: 'bg-red-500'
				};
				toastStore.trigger(toast);
			});
	};

	const saveValues = () => {
		entry && localStorage.setItem('entry', entry.toString());
		stopLoss && localStorage.setItem('stoploss', stopLoss.toString());
		tp1 && localStorage.setItem('tp1', tp1.toString());
		tp2 && localStorage.setItem('tp2', tp2.toString());
		tp3 && localStorage.setItem('tp3', tp3.toString());
		tp4 && localStorage.setItem('tp4', tp4.toString());
	};

	const setSavedValues = () => {
		if (localStorage.getItem('entry')) entry = Number.parseFloat(localStorage.getItem('entry')!);
		if (localStorage.getItem('stoploss'))
			stopLoss = Number.parseFloat(localStorage.getItem('stoploss')!);
		if (localStorage.getItem('tp1')) tp1 = Number.parseFloat(localStorage.getItem('tp1')!);
		if (localStorage.getItem('tp2')) tp2 = Number.parseFloat(localStorage.getItem('tp2')!);
		if (localStorage.getItem('tp3')) tp3 = Number.parseFloat(localStorage.getItem('tp3')!);
		if (localStorage.getItem('tp4')) tp4 = Number.parseFloat(localStorage.getItem('tp4')!);
	};

	onMount(async () => {
		setSavedValues();
		await getAvailableBalance();
	});
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1 text-center">Stock/Crypto Position Calculator</h1>
		<div class="flex flex-row gap-x-12 gap-y-6 justify-center max-w-screen-md flex-wrap pt-4">
			<label class="label text-lg">
				<span>Pairing</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim bg-amber-400 !text-neutral-700 !font-bold">₿</div>
					<input bind:value={pairing} type="search" placeholder="" />
				</div>
			</label>
			<label class="label text-lg">
				<span>Equity</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={equity} type="search" placeholder="" />
				</div>
			</label>
			<label class="label text-lg">
				<span>Position Type</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class={positionType == 'Long' ? 'bg-green-500' : 'bg-primary-500'} />
					<select bind:value={positionType} class="select border-none pl-[0.8rem] pr-[10.1rem]">
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
				<span>Stop Loss</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={stopLoss} type="search" placeholder="" />
				</div>
			</label>
		</div>

		<div class="flex flex-row gap-x-12 gap-y-6 justify-center max-w-screen-md flex-wrap">
			<label class="label text-lg">
				<span>Take profit 1</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={tp1} type="search" placeholder="" />
				</div>
			</label>
			<label class="label text-lg">
				<span>Take profit 2</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={tp2} type="search" placeholder="" />
				</div>
			</label>
			<label class="label text-lg">
				<span>Take profit 3</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={tp3} type="search" placeholder="" />
				</div>
			</label>
			<label class="label text-lg">
				<span>Take profit 4</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">$</div>
					<input bind:value={tp4} type="search" placeholder="" />
				</div>
			</label>
		</div>

		<div class="flex flex-row justify-center gap-8">
			<div class="flex justify-center pt-4">
				<button
					on:click={positionType == 'Long' ? calculateLong : calculateShort}
					type="button"
					class="btn variant-filled-primary">Calculate</button
				>
			</div>
			{#if positionSize}
				<div class="flex justify-center pt-4">
					<button on:click={placeOrder} type="button" class="btn bg-yellow-500 text-black"
						>Place Order</button
					>
				</div>
			{/if}
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
	<Toast />
</div>

<style lang="postcss">
	::selection {
		@apply bg-primary-500/30;
	}

	.input-group div {
		width: 2.65rem;
	}
</style>

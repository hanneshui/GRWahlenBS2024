<script lang="ts">
	import { getDistrictVotes, getDefaultFixedParties } from './districtVotes.ts';
	import { calculateSeatsTotal, calculateSeatsDistricts } from './calculateSeats.ts';
	import {
		getProportionalVotes,
		getParticipationRatio,
		getDefaultGrueneToBastaRatiosLocal,
		changeParticipationRatioChange,
		changePercentageChanges,
		changeGrueneBastaSplitDistricts,
		changeGrueneBastaSplitProportion,
		changeGrueneBastaFuseDistricts,
		changeGrueneBastaFuseProportion
	} from './importantFunctions.ts';
	import {
		getVotesforExtraSeatsTotal,
		getVotesforExtraSeatsTotalAllDistricts,
		getVotesforMinusSeatsTotalAllDistricts,
		getVotesforMinusSeatsTotal
	} from './statistics.ts';
	import * as Math from 'mathjs';
	import { get } from 'svelte/store';
	import { Select, Checkbox, Label, Switch, Slider, Button } from 'bits-ui';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	interface VoteCounts {
		[party: string]: number;
	}
	interface DistrictVotes {
		[key: string]: {
			votes: VoteCounts;
			total_seats: number;
		};
	}

	let districts: DistrictVotes = getDistrictVotes();
	let selectedDistrict: string = Object.keys(districts)[0]; // Standardmäßig der erste Wahlkreis ausgewählt
	let seatDistribution: { [district: string]: { [party: string]: number } };
	let seatDistributionTotal: { [party: string]: number };
	let sliderValuePercentMode: boolean = true;
	let switchValueGBBasta: boolean = false;
	let participationRatio: { [district: string]: number } = getParticipationRatio(districts);
	let proportionalVotes: { [district: string]: { [party: string]: number } } =
		getProportionalVotes(districts);
	let fixedParties: { [district: string]: { [party: string]: boolean } } = getDefaultFixedParties();
	let RatioGrueneToGrueneAndBastaLocal: { [district: string]: number } =
		getDefaultGrueneToBastaRatiosLocal();
	let extraSeatsTotal: { [districts: string]: { [party: string]: number } } =
		getVotesforExtraSeatsTotalAllDistricts(districts);
	let minusSeatsTotal: { [districts: string]: { [party: string]: number } } =
		getVotesforMinusSeatsTotalAllDistricts(districts);
	//let extraSeatsTotal: {[districts:string]:{ [party: string]: number }} = {Grossbasel_Ost: {FDP: 0,LDP: 0,EVP: 0,SP: 0,CVP: 0,GLP: 0,SVP: 0,KL: 0,GB: 0,GP: 0,BA: 0},Grossbasel_West: {FDP: 0,LDP: 0,EVP: 0,SP: 0,CVP: 0,GLP: 0,SVP: 0,GB: 0,GP: 0,BA: 0},Kleinbasel: {FDP: 0,LDP: 0,EVP: 0,SP: 0,CVP: 0,GLP: 0,SVP: 0,FUK: 0,VA: 0,KL: 0,Andere: 0,GB: 0,GP: 0,BA: 0},Riehen: {FDP: 0,LDP: 0,EVP: 0,SP: 0,CVP: 0,GLP: 0,SVP: 0,GB: 0,GP: 0,BA: 0},Bettingen: {BDV: 0,AB: 0}};

	// Berechnung der Sitze
	$: seatDistribution = calculateSeatsDistricts(districts);
	$: seatDistributionTotal = calculateSeatsTotal(seatDistribution);
	$: extraSeatsTotal[selectedDistrict] = getVotesforExtraSeatsTotal(districts[selectedDistrict]);
	$: minusSeatsTotal[selectedDistrict] = getVotesforMinusSeatsTotal(districts[selectedDistrict]);

	// Funktion, um den ausgewählten Wahlkreis zurückzusetzen
	function resetDistrictVotes() {
		// Annahme: getDistrictVotes() gibt die ursprünglichen Werte zurück
		districts = getDistrictVotes();
		proportionalVotes = getProportionalVotes(districts);
		participationRatio = getParticipationRatio(districts);
		RatioGrueneToGrueneAndBastaLocal = getDefaultGrueneToBastaRatiosLocal();
		handleGrueneBastaSplit(switchValueGBBasta);
	}

	// Logik für den Slider, um zwischen Prozent- und Absolutmodus zu wechseln
	function handleAbsolutVoteChange() {
		participationRatio = getParticipationRatio(districts);
		proportionalVotes = getProportionalVotes(districts);
		handleVoteChangeForGrueneBastaRatio();
	}

	function handlePercentageChanges(
		proportionalVoteDistricts: { [party: string]: number },
		party: string,
		fixedParties: { [party: string]: boolean }
	) {
		proportionalVoteDistricts = changePercentageChanges(
			proportionalVoteDistricts,
			party,
			fixedParties
		);
		districts[selectedDistrict].votes = changeParticipationRatioChange(
			proportionalVoteDistricts,
			participationRatio[selectedDistrict],
			selectedDistrict
		);
		handleVoteChangeForGrueneBastaRatio();
	}

	function handleVoteChangeForGrueneBastaRatio() {
		if (switchValueGBBasta) {
			let absoluteGruene: number;
			let absoluteBasta: number;
			if (!sliderValuePercentMode) {
				absoluteGruene = districts[selectedDistrict].votes.GP;
				absoluteBasta = districts[selectedDistrict].votes.BA;
			} else {
				absoluteGruene = proportionalVotes[selectedDistrict].GP;
				absoluteBasta = proportionalVotes[selectedDistrict].BA;
			}
			RatioGrueneToGrueneAndBastaLocal[selectedDistrict] =
				absoluteGruene / (absoluteGruene + absoluteBasta);
		}
	}

	function handleParticipationRatioChange(selectedDistrict: string) {
		districts[selectedDistrict].votes = changeParticipationRatioChange(
			proportionalVotes[selectedDistrict],
			participationRatio[selectedDistrict],
			selectedDistrict
		);
	}

	function handleGrueneBastaSplit(switchValueGBBasta: boolean) {
		if (switchValueGBBasta) {
			districts = changeGrueneBastaSplitDistricts(districts, RatioGrueneToGrueneAndBastaLocal);
			proportionalVotes = changeGrueneBastaSplitProportion(
				proportionalVotes,
				RatioGrueneToGrueneAndBastaLocal
			);
		} else {
			districts = changeGrueneBastaFuseDistricts(districts);
			proportionalVotes = changeGrueneBastaFuseProportion(proportionalVotes);
		}
	}
	function handleGrueneToBastaRatioChange() {
		if (switchValueGBBasta) {
			districts = changeGrueneBastaFuseDistricts(districts);
			districts = changeGrueneBastaSplitDistricts(districts, RatioGrueneToGrueneAndBastaLocal);
			proportionalVotes = changeGrueneBastaFuseProportion(proportionalVotes);
			proportionalVotes = changeGrueneBastaSplitProportion(
				proportionalVotes,
				RatioGrueneToGrueneAndBastaLocal
			);
		}
	}
	function handleGrüneToBastaRatioTransmitChange() {
		Object.keys(RatioGrueneToGrueneAndBastaLocal).forEach((district) => {
			RatioGrueneToGrueneAndBastaLocal[district] =
				RatioGrueneToGrueneAndBastaLocal[selectedDistrict];
		});
		handleGrueneToBastaRatioChange();
	}
</script>

<h1 class="bg-slate-800 px-4 py-4 text-center text-2xl font-bold text-white md:text-4xl">
	Grossratswahlen 2024 Simulation Sitzzuteilung Basel-Stadt
</h1>
<hr />
<h2 class="bg-slate-600 px-4 py-4 text-center text-lg font-bold text-white md:text-xl">
	Ausgewählter Wahlkreis: {selectedDistrict}
</h2>
<div class="mx-auto grid max-w-screen-2xl gap-10 px-4 py-8 lg:grid-cols-2">
	<div>
		<!-- Beispiel, um die Stimmen des ausgewählten Wahlkreiss anzuzeigen -->

		{#if selectedDistrict}
			<div class="mb-4 grid gap-4 rounded-md bg-slate-200 px-4 py-2 sm:grid-cols-3 sm:gap-4">
				<div>
					<Select.Root
						selected={{ label: selectedDistrict, value: selectedDistrict }}
						onSelectedChange={(selectedValue) => {
							/* Logik, falls benötigt */
							selectedValue && (selectedDistrict = selectedValue?.value);
						}}
					>
						<Select.Trigger
							class="inline-flex h-10 w-full items-center justify-between rounded-md border bg-slate-700 px-3 text-sm text-white transition-colors placeholder:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
							aria-label="Select a district"
						>
							<Select.Value class="text-sm" placeholder="Select a district" />
							<ChevronsUpDown size={16} />
						</Select.Trigger>
						<Select.Content
							class="w-full rounded-md border border-slate-300 bg-slate-700 p-1 text-slate-200 shadow-sm outline-none"
							sideOffset={8}
						>
							<div transition:slide={{ duration: 250 }}>
								{#each Object.keys(districts) as district}
									<Select.Item
										class="rounded-button data-[highlighted]:bg-muted flex h-10 w-full cursor-pointer select-none items-center py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75 hover:text-white"
										value={district}
									>
										{district}
										<Select.ItemIndicator class="ml-auto" asChild={false}>
											<Check size={16} />
										</Select.ItemIndicator>
									</Select.Item>
								{/each}
							</div>
						</Select.Content>
						<Select.Input name="districts" />
					</Select.Root>
				</div>

				<div class="place-self-center">
					<div class="flex items-center space-x-2">
						<Label.Root for="prozent-modus" class="text-sm font-medium">Prozent Modus</Label.Root>
						<Switch.Root
							bind:checked={sliderValuePercentMode}
							id="prozent-modus"
							class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-slate-300 px-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-700 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-slate-200 data-[state=unchecked]:shadow-inner"
						>
							<Switch.Thumb
								class="pointer-events-none block size-[18px] shrink-0 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:shadow-sm"
							/>
						</Switch.Root>
					</div>
				</div>

				<div class="self-center justify-self-center sm:justify-self-end">
					<div class="flex items-center space-x-2">
						<Checkbox.Root
							id="divide-green-and-basta"
							name="divide-green-and-basta"
							aria-labelledby="divide-green-and-basta-label"
							class="peer inline-flex size-6 shrink-0 items-center justify-center rounded-md border bg-white transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
							bind:checked={switchValueGBBasta}
							onCheckedChange={(event) => {
								switchValueGBBasta = event;
								handleGrueneBastaSplit(switchValueGBBasta);
							}}
						>
							<Checkbox.Indicator let:isChecked class="inline-flex items-center justify-center">
								{#if isChecked}
									<Check size={20} strokeWidth={3} />
								{/if}
							</Checkbox.Indicator>
						</Checkbox.Root>
						<Label.Root
							id="divide-green-and-basta-label"
							for="divide-green-and-basta"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Grüne und Basta aufteilen
						</Label.Root>
					</div>
				</div>
			</div>
			{#if selectedDistrict != 'Bettingen'}
				{#if switchValueGBBasta}
					<div class="mt-4" transition:slide>
						<label class="grid gap-4 rounded-md bg-slate-200 px-4 py-2 sm:grid-cols-3 sm:gap-0">
							<div>
								<input
									type="number"
									bind:value={RatioGrueneToGrueneAndBastaLocal[selectedDistrict]}
									on:input={() => handleGrueneToBastaRatioChange()}
									min="0"
									max="1"
									step="0.01"
									class="w-full rounded-md focus-within:border-slate-700 focus-within:outline-slate-700"
								/>
							</div>

							<div class="place-self-center">
								<input
									type="range"
									bind:value={RatioGrueneToGrueneAndBastaLocal[selectedDistrict]}
									on:input={() => handleGrueneToBastaRatioChange()}
									min="0"
									max="1"
									step="0.01"
									class="accent-slate-700"
								/>
							</div>

							<div class="self-center justify-self-center sm:justify-self-end">
								Wahlkreis {selectedDistrict}
							</div>
						</label>

						<div class="flex justify-center">
							<Button.Root
								on:click={handleGrüneToBastaRatioTransmitChange}
								class="active:scale-98 mt-4 inline-flex h-12 items-center justify-center rounded-md bg-slate-700 px-5 text-sm font-semibold text-slate-200 shadow-sm hover:bg-slate-700/95 active:transition-all"
							>
								Verhältnis auf alle Wahlkreise übertragen
							</Button.Root>
						</div>
					</div>
				{/if}
			{/if}
			<h3 class="mb-1 mt-8 text-lg font-medium">Listenstimmen:</h3>
			<ul class="space-y-1">
				{#each Object.entries(districts[selectedDistrict].votes) as [party, votes]}
					<div class="flex items-center">
						<li class="w-16">{party}</li>
						{#if sliderValuePercentMode}
							<label class="flex flex-1 gap-1">
								<div class="flex-1">
									<input
										type="number"
										bind:value={proportionalVotes[selectedDistrict][party]}
										on:input={() =>
											handlePercentageChanges(
												proportionalVotes[selectedDistrict],
												party,
												fixedParties[selectedDistrict]
											)}
										min="0"
										max="1"
										step="0.01"
										class="w-full rounded-md focus-within:border-slate-700 focus-within:outline-slate-700"
									/>
								</div>
								<div class="flex-1 self-center">
									<input
										type="range"
										bind:value={proportionalVotes[selectedDistrict][party]}
										on:input={() =>
											handlePercentageChanges(
												proportionalVotes[selectedDistrict],
												party,
												fixedParties[selectedDistrict]
											)}
										min="0"
										max="1"
										step="0.01"
										class="w-full accent-slate-700"
									/>
								</div>
								<div class="flex flex-1 items-center justify-end">
									<div class="w-full text-center">
										<input
											type="checkbox"
											name="fixieren"
											bind:checked={fixedParties[selectedDistrict][party]}
										/>
										fixieren
									</div>
								</div>
							</label>
						{:else}
							<label class="flex flex-1 gap-1">
								<div class="flex-1">
									<input
										type="number"
										bind:value={districts[selectedDistrict].votes[party]}
										on:input={() => handleAbsolutVoteChange()}
										min="0"
										max="150000"
										step="500"
										class="w-full rounded-md focus-within:border-slate-700 focus-within:outline-slate-700"
									/>
								</div>
								<div class="flex-1 self-center">
									<input
										type="range"
										bind:value={districts[selectedDistrict].votes[party]}
										on:input={() => handleAbsolutVoteChange()}
										min="0"
										max="150000"
										step="500"
										class="w-full accent-slate-700"
									/>
								</div>
								<div
									class="flex flex-1 items-center justify-center rounded-md bg-green-500 font-medium leading-none text-white"
								>
									<span>
										{new Intl.NumberFormat('en-US', { style: 'decimal' }).format(
											extraSeatsTotal[selectedDistrict][party]
										)}
									</span>
								</div>
								<div
									class="flex flex-1 items-center justify-center rounded-md bg-red-500 font-medium leading-none text-white"
								>
									<span>
										{new Intl.NumberFormat('en-US', { style: 'decimal' }).format(
											minusSeatsTotal[selectedDistrict][party]
										)}
									</span>
								</div>
							</label>
						{/if}
					</div>
				{/each}
			</ul>
		{/if}

		<div class="flex items-center justify-between">
			<Button.Root
				on:click={resetDistrictVotes}
				class="active:scale-98 mt-4 inline-flex h-12 items-center justify-center rounded-md bg-slate-700 px-5 text-sm font-semibold text-slate-200 shadow-sm hover:bg-slate-700/95 active:transition-all"
			>
				Reset
			</Button.Root>
			{#if sliderValuePercentMode}
				<label>
					<input
						type="number"
						bind:value={participationRatio[selectedDistrict]}
						on:input={() => handleParticipationRatioChange(selectedDistrict)}
						min="0"
						max="1"
						step="0.01"
						class="rounded-md focus-within:border-slate-700 focus-within:outline-slate-700"
					/>
					<input
						type="range"
						bind:value={participationRatio[selectedDistrict]}
						on:input={() => handleParticipationRatioChange(selectedDistrict)}
						min="0"
						max="1"
						step="0.01"
						class="accent-slate-700"
					/>
				</label>
			{:else}
				<p class="font-bold">
					Wahlbeteiligung: {(participationRatio[selectedDistrict] * 100).toFixed(1)}%
				</p>
			{/if}
		</div>
	</div>

	<div class="space-y-8">
		{#if seatDistribution}
			<div>
				<h3 class="mb-1 text-lg font-medium">Sitzzuteilung im Wahlkreis {selectedDistrict}:</h3>
				<table class="w-full table-auto border border-slate-300 text-center">
					<thead>
						<tr class="bg-slate-700 text-slate-200">
							<th class="w-40">Party</th>
							<th class="w-40">Seats</th>
						</tr>
					</thead>
					<tbody>
						{#each Object.entries(seatDistribution[selectedDistrict]) as [party, seats]}
							<tr class="odd:bg-slate-200">
								<td>{party}</td>
								<td>{seats}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div>
				<h3 class="mb-1 text-lg font-medium">Sitzzuteilung alle zusammen:</h3>
				<table class="w-full table-auto border border-slate-300 text-center">
					<thead>
						<tr class="bg-slate-700 text-slate-200">
							<th class="w-40">Party</th>
							<th class="w-40">Seats</th>
						</tr>
					</thead>
					<tbody>
						{#each Object.entries(seatDistributionTotal) as [party, seats]}
							<tr class="odd:bg-slate-200">
								<td>{party}</td>
								<td>{seats}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

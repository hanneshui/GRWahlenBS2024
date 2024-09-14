<script lang="ts">
  import * as Math from "mathjs";
  import { get } from "svelte/store";
  import { Select, Checkbox, Label, Switch, Slider, Button } from "bits-ui";
  import { Check, ChevronsUpDown } from "lucide-svelte";
  import { slide } from "svelte/transition";
  
	export let seatDistribution: any;
    export let selectedDistrict: string;
    export let seatDistributionTotal: any;
</script>

<div class="space-y-8">
    {#if seatDistribution}
      <div>
        <h3 class="mb-1 text-lg font-medium">
          Sitzzuteilung im Wahlkreis {selectedDistrict}:
        </h3>
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
<script lang="ts">
	export let selectedDistrict: string;
</script>

<h1
  class="bg-slate-800 px-4 py-4 text-center text-2xl font-bold text-white md:text-4xl"
>
  Grossratswahlen 2024 Simulation Sitzzuteilung Basel-Stadt
</h1>
<hr />
<h2
  class="bg-slate-600 px-4 py-4 text-center text-lg font-bold text-white md:text-xl"
>
  Ausgewählter Wahlkreis: {selectedDistrict}
</h2>
<div class="centered-text">
  <p>
    Das folgende Tool simuliert die Sitzverteilung für die Grossratswahlen 2024
    in Basel. Das Tool wurde von <a href="https://hanneshui.ch">Hannes Hui</a> &
    Kaspar Hui entworfen und umgesetzt. Die Korrektheit der Simulation ist nicht
    garantiert. Bei Fehlern oder Verbesserungsvorschlägen freue ich mich über
    eure Rückmeldung. Zur Transparenz und vereinfachten Mitwirkung befindet sich
    der Source Code dieses Projektes frei zugänglich auf Github:
    <a href="https://github.com/hanneshui/GRWahlenBS2024">Repository</a> <br /> Die
    Standartwerte basieren auf den Resultaten der Grossratswahlen 2020. Zusätzlich
    ist das Standartaufteilungsverhätniss zwischen der Grünen Partei und der Basta!
    basierend auf dem Resultat der letzten Bürgergemeinderatswahlen.
  </p>
</div>
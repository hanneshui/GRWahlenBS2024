import { exp, re } from "mathjs";

interface DistrictCounts {
  [district: string]: number;
}

interface VoteCounts {
  [party: string]: number;
}
interface DistrictVotes {
  [key: string]: {
    votes: VoteCounts;
    total_seats: number;
  };
}

export function getAllowedVoters() {
  let allowedVoters: DistrictCounts = {
    Grossbasel_Ost: 762538,
    Grossbasel_West: 1226915,
    Kleinbasel: 603577,
    Riehen: 156688,
    Bettingen: 1014,
  };
  return allowedVoters;
}

export function getProportionalVotes(districts: DistrictVotes) {
  let votesSum: { [district: string]: number } = Object.entries(
    districts,
  ).reduce((acc: { [district: string]: number }, [district, data]) => {
    acc[district] = Object.values(data.votes).reduce(
      (sum, current) => sum + current,
      0,
    );
    return acc;
  }, {});
  return Object.entries(districts).reduce(
    (
      acc: { [district: string]: { [party: string]: number } },
      [district, data],
    ) => {
      const districtTotalVotes = votesSum[district];
      const partyVotes = data.votes;
      const proportions = Object.keys(partyVotes).reduce(
        (partyAcc: { [party: string]: number }, party) => {
          const votes = partyVotes[party];
          // Berechnung der Proportion der Stimmen zur Gesamtstimmenzahl des Distrikts
          partyAcc[party] =
            districtTotalVotes > 0 ? votes / districtTotalVotes : 0;
          return partyAcc;
        },
        {},
      );
      acc[district] = proportions;
      return acc;
    },
    {},
  );
}

export function getParticipationRatio(districts: DistrictVotes) {
  const allowedVoters = getAllowedVoters();
  return Object.keys(districts).reduce((acc: DistrictCounts, district) => {
    const votes = Object.entries(districts).reduce(
      (
        acc: DistrictCounts,
        [district, data]: [string, { votes: { [party: string]: number } }],
      ) => {
        acc[district] = Object.values(data.votes).reduce(
          (sum, current) => sum + current,
          0,
        );
        return acc;
      },
      {},
    )[district];
    const allowed = allowedVoters[district]; // Vermeidung von Division durch Null
    acc[district] = allowed > 0 ? votes / allowed : 0; // Verhältnis berechnen
    return acc;
  }, {});
}

export function getDefaultGrueneToBastaRatiosLocal() {
  return {
    Grossbasel_Ost: 0.6500177,
    Grossbasel_West: 0.6513773,
    Kleinbasel: 0.4942063,
    Riehen: 0.76636933,
    Bettingen: 1,
  };
}

export function changeParticipationRatioChange(
  proportionalVotesDistrict: { [party: string]: number },
  participationRatioDistrict: number,
  selectedDistrict: string,
) {
  let district: { [party: string]: number } = {};
  let allowedVoters = getAllowedVoters();
  Object.keys(proportionalVotesDistrict).forEach((key) => {
    district[key] = Math.round(
      proportionalVotesDistrict[key] *
        participationRatioDistrict *
        allowedVoters[selectedDistrict],
    );
  });
  return district;
}

export function changePercentageChanges(
  proportionalVoteDistricts: { [party: string]: number },
  party: string,
  fixedParties: { [party: string]: boolean },
) {
  // Hier können Sie Logik hinzufügen, um zu verarbeiten, was passiert, wenn sich ein Wert ändert
  let sumFixedParties: number = 0;
  Object.keys(proportionalVoteDistricts).forEach((tempParty) => {
    if (fixedParties[tempParty]) {
      sumFixedParties += proportionalVoteDistricts[tempParty] ?? 0;
    }
  });

  if (!fixedParties[party]) {
    // Wert der Partei zur Summe hinzufügen
    sumFixedParties += proportionalVoteDistricts[party] ?? 0;
  }

  // Wenn die Summe größer als 1 ist, das was über 1 ist von proportionalVoteDistricts an der Stelle von party abziehen
  if (sumFixedParties > 1) {
    let excess = sumFixedParties - 1; // Berechnung des Überschusses
    proportionalVoteDistricts[party] -= excess; // Überschuss von der Partei abziehen
    sumFixedParties = 1; // Summe auf 1 setzen
  }

  let leftOver: number = 1 - sumFixedParties;
  let movableParties = Object.keys(proportionalVoteDistricts).filter(
    (tempParty) => !fixedParties[tempParty] && tempParty !== party,
  );
  let sumMovableParties: number = 0;
  movableParties.forEach((tempParty) => {
    sumMovableParties += proportionalVoteDistricts[tempParty];
  });
  if (sumMovableParties === 0) {
    let factor: number = leftOver / movableParties.length;
    for (let i = 0; i < movableParties.length; i++) {
      proportionalVoteDistricts[movableParties[i]] += factor;
    }
  } else {
    let factor: number = leftOver / sumMovableParties;
    for (let i = 0; i < movableParties.length; i++) {
      proportionalVoteDistricts[movableParties[i]] *= factor;
    }
  }
  return proportionalVoteDistricts;
}

export function changeGrueneBastaSplitDistricts(
  districts: DistrictVotes,
  RationGrueneToGrueneAndBasta: { [distrct: string]: number },
): DistrictVotes {
  Object.keys(districts).forEach((districtKey) => {
    const district = districts[districtKey];
    Object.keys(district.votes).forEach((partyCode) => {
      if (partyCode === "GB") {
        const gbVotes = district.votes[partyCode];
        // Berechnen der neuen Werte basierend auf der Ratio
        const grVotes = Math.round(
          RationGrueneToGrueneAndBasta[districtKey] * gbVotes,
        );
        const baVotes = Math.round(
          (1 - RationGrueneToGrueneAndBasta[districtKey]) * gbVotes,
        );
        // Löschen des "GB"-Eintrags
        delete district.votes[partyCode];
        // Hinzufügen der neuen Schlüssel-Wert-Paare
        district.votes["Grüne"] = grVotes;
        district.votes["BastA"] = baVotes;
      }
    });
  });
  return districts;
}

export function changeGrueneBastaSplitProportion(
  proportionalVotes: { [district: string]: { [party: string]: number } },
  RationGrueneToGrueneAndBasta: { [distrct: string]: number },
): { [district: string]: { [party: string]: number } } {
  Object.keys(proportionalVotes).forEach((districtKey) => {
    const proportionalVote = proportionalVotes[districtKey];
    Object.keys(proportionalVote).forEach((partyCode) => {
      if (partyCode === "GB") {
        const gbVotes = proportionalVote[partyCode];
        // Berechnen der neuen Werte basierend auf der Ratio
        const grVotes = RationGrueneToGrueneAndBasta[districtKey] * gbVotes;
        const baVotes =
          (1 - RationGrueneToGrueneAndBasta[districtKey]) * gbVotes;
        // Löschen des "GB"-Eintrags
        delete proportionalVote[partyCode];
        // Hinzufügen der neuen Schlüssel-Wert-Paare
        proportionalVote["Grüne"] = grVotes;
        proportionalVote["BastA"] = baVotes;
      }
    });
  });
  return proportionalVotes;
}

export function changeGrueneBastaFuseDistricts(
  districts: DistrictVotes,
): DistrictVotes {
  Object.keys(districts).forEach((districtKey) => {
    const district = districts[districtKey];
    Object.keys(district.votes).forEach((partyCode) => {
      if (partyCode === "Grüne") {
        const grVotes = district.votes["Grüne"] ?? 0;
        const baVotes = district.votes["BastA"] ?? 0;
        // Berechnen der neuen Werte basierend auf der Fusion
        const gbVotes = grVotes + baVotes;
        // Löschen der "GR" und "BA"-Einträge
        delete district.votes["Grüne"];
        delete district.votes["BastA"];
        // Hinzufügen des neuen "GB"-Eintrags
        district.votes["GB"] = gbVotes;
      }
    });
  });
  return districts;
}

export function changeGrueneBastaFuseProportion(proportionalVotes: {
  [district: string]: { [party: string]: number };
}): { [district: string]: { [party: string]: number } } {
  Object.keys(proportionalVotes).forEach((districtKey) => {
    const proportionalVote = proportionalVotes[districtKey];
    Object.keys(proportionalVote).forEach((partyCode) => {
      if (partyCode === "Grüne") {
        const grVotes = proportionalVote["Grüne"] ?? 0;
        const baVotes = proportionalVote["BastA"] ?? 0;
        // Berechnen der neuen Werte basierend auf der Fusion
        const gbVotes = grVotes + baVotes;
        // Löschen der "GR" und "BA"-Einträge
        delete proportionalVote["Grüne"];
        delete proportionalVote["BastA"];
        // Hinzufügen des neuen "GB"-Eintrags
        proportionalVote["GB"] = gbVotes;
      }
    });
  });
  return proportionalVotes;
}

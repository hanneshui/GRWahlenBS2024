interface VoteCounts {
	[party:string] : number;
}

interface DistrictVotes {
	votes: VoteCounts;
	total_seats: number;
}

interface TotalVoters {
	[key: string]: number;
}

// districtVotes.ts
export const getDistrictVotes = () => {
	return {
		Grossbasel_Ost: {
			votes: {
				FDP: 29576,
				LDP: 59533,
				EVP: 9425,
				SP: 94945,
				CVP: 22171,
				GLP: 31089,
				SVP: 36131,
				KL: 1406,
				Andere: 0,
				GB: 47428
			},
			total_seats: 27
		},
		Grossbasel_West: {
			votes: {
				FDP: 38797,
				LDP: 65248,
				EVP: 16652,
				SP: 181483,
				CVP: 26816,
				GLP: 41200,
				SVP: 55681,
				Andere: 0,
				GB: 107831
			},
			total_seats: 34
		},
		Kleinbasel: {
			votes: {
				FDP: 16667,
				LDP: 29135,
				EVP: 4651,
				SP: 87910,
				CVP: 15505,
				GLP: 17155,
				SVP: 23720,
				FUK: 3726,
				VA: 5354,
				KL: 2662,
				Andere: 2459,
				GB: 53612
			},
			total_seats: 27
		},
		Riehen: {
			votes: {
				FDP: 9538,
				LDP: 11410,
				EVP: 6657,
				SP: 13216,
				CVP: 6478,
				GLP: 4920,
				SVP: 11133,
				Andere: 0,
				GB: 4805
			},
			total_seats: 11
		},
		Bettingen: {
			votes: { BDV: 179, AB: 262, Andere: 0},
			total_seats: 1
		}
	};
};

export function getDefaultFixedParties() {
	let fixedParties: { [district: string]: { [party: string]: boolean } } = {
		Grossbasel_Ost: {
			FDP: false,
			LDP: false,
			EVP: false,
			SP: false,
			CVP: false,
			GLP: false,
			SVP: false,
			KL: false,
			Andere: false,
			GB: false,
			GP: false,
			BA: false
		},
		Grossbasel_West: {
			FDP: false,
			LDP: false,
			EVP: false,
			SP: false,
			CVP: false,
			GLP: false,
			SVP: false,
			Andere: false,
			GB: false,
			GP: false,
			BA: false
		},
		Kleinbasel: {
			FDP: false,
			LDP: false,
			EVP: false,
			SP: false,
			CVP: false,
			GLP: false,
			SVP: false,
			FUK: false,
			VA: false,
			KL: false,
			Andere: false,
			GB: false,
			GP: false,
			BA: false
		},
		Riehen: {
			FDP: false,
			LDP: false,
			EVP: false,
			SP: false,
			CVP: false,
			GLP: false,
			SVP: false,
			Andere: false,
			GB: false,
			GP: false,
			BA: false
		},
		Bettingen: {
			BDV: false,
			AB: false,
			Andere: false
		}
	};
	return fixedParties;
}

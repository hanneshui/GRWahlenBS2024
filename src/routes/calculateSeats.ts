import * as Math from 'mathjs';
interface VoteCounts {
	[party: string]: number;
}
interface DistrictVotes {
	[key: string]: {
		votes: VoteCounts;
		total_seats: number;
	};
}
// Definieren eines Typs für das Eingabeobjekt
interface District {
	total_seats: number;
	votes: { [party: string]: number };
}

// Definieren eines Typs für das Ausgabeobjekt
type SeatDistribution = { [party: string]: number };

export function calculateSeats(district: District): SeatDistribution {
	const totalSeats: number = district.total_seats;
	const votes: { [party: string]: number } = district.votes;
	const totalVotes: number = Object.values(votes).reduce((a, b) => a + b, 0);
	const requiredVotesPerSeat: number = Math.ceil(totalVotes / totalSeats);

	let seats: SeatDistribution = {};
	Object.keys(votes).forEach((party) => {
		seats[party] = Math.floor(votes[party] / requiredVotesPerSeat);
	});

	let remainingSeats: number = totalSeats - Object.values(seats).reduce((a, b) => a + b, 0);

	let quotients: { [party: string]: number } = {};
	Object.keys(votes).forEach((party) => {
		quotients[party] = votes[party] / (seats[party] * 2 + 1);
	});

	while (remainingSeats > 0) {
		const maxQuotient: number = Math.max(...Object.values(quotients));
		const maxParty: string | undefined = Object.keys(quotients).find(
			(party) => Math.abs(quotients[party] - maxQuotient) < 1e-6
		);
		if (maxParty) {
			seats[maxParty] += 1;
			quotients[maxParty] = votes[maxParty] / (seats[maxParty] * 2 + 1);
		}
		remainingSeats -= 1;
	}
	return seats;
}

// Funktion, um die Sitze zu berechnen
export function calculateSeatsTotal(newSeatDistribution: {
	[district: string]: { [party: string]: number };
}) {
	let newSeatDistributionTotal: { [party: string]: number } = fuseSeats(newSeatDistribution);
	return newSeatDistributionTotal;
}

export function calculateSeatsDistricts(districts: DistrictVotes) {
	let newSeatDistribution: { [district: string]: { [party: string]: number } } = {};
	for (const districtKey in districts) {
		newSeatDistribution[districtKey] = calculateSeats(districts[districtKey]);
	}
	return newSeatDistribution;
}

function fuseSeats(newSeatDistribution: { [district: string]: { [party: string]: number } }) {
	let newSeatDistributionTotal: { [party: string]: number } = {};
	for (const districtKey in newSeatDistribution) {
		for (const partyKey in newSeatDistribution[districtKey]) {
			if (newSeatDistributionTotal[partyKey] === undefined) {
				newSeatDistributionTotal[partyKey] = 0;
			}
			newSeatDistributionTotal[partyKey] += newSeatDistribution[districtKey][partyKey];
		}
	}
	return newSeatDistributionTotal;
}

function getColour(party: string) {
	switch (party) {
		case 'FDP':
			return '#00A0E2';
		case 'LDP':
			return '#004B8C';
		case 'GB':
			return '#84B414';
		case 'Grüne':
			return '#84B414';
		case 'BastA':
			return '#E6007E';
		case 'EVP':
			return '#F8DA00';
		case 'SP':
			return '#E40000';
		case 'Mitte':
			return 'FF9B00';
		case 'GLP':
			return '#B3DD00';
		case 'SVP':
			return '#009F4F';
		case 'VA':
			return '#5B3A29';
		case 'FUK':
			return '#231F20';
		case 'KL':
			return '#E51616';
		case 'Andere':
			return '#000000';
		case 'BDV':
			return '#E1564F';
		case 'AB':
			return '#044C77';
		default:
			return '#000000';
	}
}

export function TotalSeatsForBarChart(SeatDistributionTotal: { [party: string]: number }) {
	let SeatsForBarChart: {[party:string]:{name:string, seats:number, colour:string}} = {};
	for (const partyKey in SeatDistributionTotal) {
		SeatsForBarChart[partyKey] = {
			name: partyKey,
			seats: SeatDistributionTotal[partyKey],
			colour: getColour(partyKey),
		};
	}
	return SeatsForBarChart;
}
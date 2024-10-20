interface VoteCounts {
  [party: string]: number;
}

interface DistrictVotes {
  votes: VoteCounts;
  total_seats: number;
}

interface TotalVoters {
  [key: string]: number;
}

// districtVotes.ts

export const getDistrictVotes2020 = () => {
  return {
    Grossbasel_Ost: {
      votes: {
        FDP: 29576,
        LDP: 59533,
        EVP: 9425,
        SP: 94945,
        Mitte: 22171,
        GLP: 31089,
        SVP: 36131,
        KL: 1406,
        Andere: 0,
        GB: 47428,
      },
      total_seats: 27,
    },
    Grossbasel_West: {
      votes: {
        FDP: 38797,
        LDP: 65248,
        EVP: 16652,
        SP: 181483,
        Mitte: 26816,
        GLP: 41200,
        SVP: 55681,
        Andere: 0,
        GB: 107831,
      },
      total_seats: 34,
    },
    Kleinbasel: {
      votes: {
        FDP: 16667,
        LDP: 29135,
        EVP: 4651,
        SP: 87910,
        Mitte: 15505,
        GLP: 17155,
        SVP: 23720,
        FUK: 3726,
        VA: 5354,
        KL: 2662,
        Andere: 2459,
        GB: 53612,
      },
      total_seats: 27,
    },
    Riehen: {
      votes: {
        FDP: 9538,
        LDP: 11410,
        EVP: 6657,
        SP: 13216,
        Mitte: 6478,
        GLP: 4920,
        SVP: 11133,
        Andere: 0,
        GB: 4805,
      },
      total_seats: 11,
    },
    Bettingen: {
      votes: { BDV: 179, AB: 262, Andere: 0 },
      total_seats: 1,
    },
  };
};

export const getDistrictVotes = () => {
  return {
    Grossbasel_Ost: {
      votes: {
        FDP: 27616,
        LDP: 52320,
        EVP: 8648,
        SP: 85754,
        Mitte: 21159,
        EDU: 1384,
        GLP: 25270,
        PDA: 2755,
        SVP: 38667,
        Andere: 0,
        GB: 48031,
      },
      total_seats: 27,
    },
    Grossbasel_West: {
      votes: {
        FDP: 37396,
        LDP: 49830,
        EVP: 15565,
        SP: 167394,
        Mitte: 29297,
        GLP: 34180,
        PDA:4070,
        SVP: 63620,
        Andere: 1406,
        GB: 103863,
      },
      total_seats: 34,
    },
    Kleinbasel: {
      votes: {
        FDP: 13018,
        LDP: 20231,
        EVP: 4624,
        SP: 81669,
        Mitte: 15554,
        GLP: 13352,
        PDA: 2332,
        SVP: 28332,
        VA: 5978,
        KL: 2662,
        Andere: 3469,
        GB: 54542,
      },
      total_seats: 27,
    },
    Riehen: {
      votes: {
        FDP: 7917,
        LDP: 11283,
        EVP: 5682,
        SP: 12075,
        Mitte: 6418,
        GLP: 4380,
        SVP: 13292,
        Andere: 0,
        GB: 5269,
      },
      total_seats: 11,
    },
    Bettingen: {
      votes: {GB:88, AB: 325, Andere: 0 },
      total_seats: 1,
    },
  };
};

export function getDefaultFixedParties() {
  let fixedParties: { [district: string]: { [party: string]: boolean } } = {
    Grossbasel_Ost: {
      FDP: false,
      LDP: false,
      EVP: false,
      SP: false,
      Mitte: false,
      GLP: false,
      SVP: false,
      KL: false,
      Andere: false,
      GB: false,
      Grüne: false,
      BastA: false,
    },
    Grossbasel_West: {
      FDP: false,
      LDP: false,
      EVP: false,
      SP: false,
      Mitte: false,
      GLP: false,
      SVP: false,
      Andere: false,
      GB: false,
      Grüne: false,
      BastA: false,
    },
    Kleinbasel: {
      FDP: false,
      LDP: false,
      EVP: false,
      SP: false,
      Mitte: false,
      GLP: false,
      SVP: false,
      FUK: false,
      VA: false,
      KL: false,
      Andere: false,
      GB: false,
      Grüne: false,
      BastA: false,
    },
    Riehen: {
      FDP: false,
      LDP: false,
      EVP: false,
      SP: false,
      Mitte: false,
      GLP: false,
      SVP: false,
      Andere: false,
      GB: false,
      Grüne: false,
      BastA: false,
    },
    Bettingen: {
      BDV: false,
      AB: false,
      Andere: false,
    },
  };
  return fixedParties;
}

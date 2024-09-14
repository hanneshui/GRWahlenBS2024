import {
  getProportionalVotes,
  getParticipationRatio,
} from "./importantFunctions.ts";
import { getDistrictVotes } from "./districtVotes.ts";

let districts = getDistrictVotes();

console.log(getProportionalVotes(districts));
console.log(getParticipationRatio(districts));

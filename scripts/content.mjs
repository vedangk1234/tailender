// Shared cricket content — imported by seed.mjs (to write the DB) and by
// validateContent.mjs (to sanity-check it offline). Keep facts human-verified.

export const TIERS = ["duck", "single", "double", "boundary", "half_century", "six", "century"];

// id, canonical, [aliases] — aliases feed Layer-1 fuzzy recognition.
export const ENTITIES = [
  // India
  ["dhoni", "MS Dhoni", ["dhoni", "ms dhoni", "mahendra singh dhoni", "mahi", "msd"]],
  ["kapil_dev", "Kapil Dev", ["kapil", "kapil dev", "kapil dev nikhanj"]],
  ["harbhajan", "Harbhajan Singh", ["harbhajan", "harbhajan singh", "bhajji", "turbanator"]],
  ["irfan_pathan", "Irfan Pathan", ["irfan", "irfan pathan"]],
  ["rohit_sharma", "Rohit Sharma", ["rohit", "rohit sharma", "hitman"]],
  ["gambhir", "Gautam Gambhir", ["gambhir", "gautam gambhir", "gauti"]],
  ["shreyas_iyer", "Shreyas Iyer", ["shreyas", "shreyas iyer", "iyer"]],
  ["hardik_pandya", "Hardik Pandya", ["hardik", "hardik pandya", "pandya"]],
  ["sachin", "Sachin Tendulkar", ["sachin", "sachin tendulkar", "tendulkar", "little master"]],
  ["sehwag", "Virender Sehwag", ["sehwag", "virender sehwag", "viru", "nawab of najafgarh"]],
  ["karun_nair", "Karun Nair", ["karun", "karun nair", "nair"]],
  ["ishan_kishan", "Ishan Kishan", ["ishan", "ishan kishan"]],
  ["shubman_gill", "Shubman Gill", ["shubman", "shubman gill", "gill"]],
  ["kohli", "Virat Kohli", ["kohli", "virat kohli", "v kohli", "king kohli", "chiku"]],
  ["bumrah", "Jasprit Bumrah", ["bumrah", "jasprit bumrah", "boom", "boom boom bumrah"]],
  ["dravid", "Rahul Dravid", ["dravid", "rahul dravid", "the wall", "jammy"]],
  ["ganguly", "Sourav Ganguly", ["ganguly", "sourav ganguly", "dada", "prince of kolkata"]],
  ["anil_kumble", "Anil Kumble", ["kumble", "anil kumble", "jumbo"]],
  ["ashwin", "Ravichandran Ashwin", ["ashwin", "r ashwin", "ravichandran ashwin", "ash"]],
  ["jadeja", "Ravindra Jadeja", ["jadeja", "ravindra jadeja", "sir jadeja", "jaddu"]],
  ["raina", "Suresh Raina", ["raina", "suresh raina", "chinna thala"]],
  ["yuvraj_singh", "Yuvraj Singh", ["yuvraj", "yuvraj singh", "yuvi"]],
  ["ravi_shastri", "Ravi Shastri", ["shastri", "ravi shastri"]],
  ["srinath", "Javagal Srinath", ["srinath", "javagal srinath"]],
  ["chandrasekhar", "Bhagwat Chandrasekhar", ["chandrasekhar", "bhagwat chandrasekhar", "chandra"]],
  ["prasanna", "Erapalli Prasanna", ["prasanna", "erapalli prasanna"]],
  ["narendra_hirwani", "Narendra Hirwani", ["hirwani", "narendra hirwani"]],
  // Australia
  ["warner", "David Warner", ["warner", "david warner", "davey"]],
  ["warne", "Shane Warne", ["warne", "shane warne", "warney"]],
  ["gilchrist", "Adam Gilchrist", ["gilchrist", "adam gilchrist", "gilly"]],
  ["ponting", "Ricky Ponting", ["ponting", "ricky ponting", "punter"]],
  ["finch", "Aaron Finch", ["finch", "aaron finch"]],
  ["allan_border", "Allan Border", ["border", "allan border", "ab"]],
  ["steve_waugh", "Steve Waugh", ["steve waugh", "stephen waugh", "tugga"]],
  ["michael_clarke", "Michael Clarke", ["clarke", "michael clarke", "pup"]],
  ["glenn_mcgrath", "Glenn McGrath", ["mcgrath", "glenn mcgrath", "pigeon"]],
  ["nathan_lyon", "Nathan Lyon", ["lyon", "nathan lyon", "garry", "goat"]],
  ["pat_cummins", "Pat Cummins", ["cummins", "pat cummins", "patrick cummins"]],
  // England
  ["buttler", "Jos Buttler", ["buttler", "jos buttler"]],
  ["collingwood", "Paul Collingwood", ["collingwood", "paul collingwood", "colly"]],
  ["root", "Joe Root", ["root", "joe root", "rooty"]],
  ["eoin_morgan", "Eoin Morgan", ["morgan", "eoin morgan"]],
  ["james_anderson", "James Anderson", ["anderson", "james anderson", "jimmy", "jimmy anderson"]],
  ["stuart_broad", "Stuart Broad", ["broad", "stuart broad", "broady"]],
  // West Indies
  ["sammy", "Darren Sammy", ["sammy", "darren sammy"]],
  ["gayle", "Chris Gayle", ["gayle", "chris gayle", "universe boss"]],
  ["courtney_walsh", "Courtney Walsh", ["walsh", "courtney walsh"]],
  ["sobers", "Garfield Sobers", ["sobers", "garfield sobers", "garry sobers", "gary sobers"]],
  ["brian_lara", "Brian Lara", ["lara", "brian lara", "prince"]],
  ["kieron_pollard", "Kieron Pollard", ["pollard", "kieron pollard", "polly"]],
  // Sri Lanka
  ["malinga", "Lasith Malinga", ["malinga", "lasith malinga", "slinga malinga"]],
  ["arjuna_ranatunga", "Arjuna Ranatunga", ["ranatunga", "arjuna ranatunga"]],
  ["muralitharan", "Muttiah Muralitharan", ["murali", "muralitharan", "muttiah muralitharan"]],
  ["rangana_herath", "Rangana Herath", ["herath", "rangana herath"]],
  ["jayasuriya", "Sanath Jayasuriya", ["jayasuriya", "sanath jayasuriya", "matara mauler"]],
  ["sangakkara", "Kumar Sangakkara", ["sangakkara", "kumar sangakkara", "sanga"]],
  ["mahela", "Mahela Jayawardene", ["mahela", "mahela jayawardene", "jayawardene"]],
  // Pakistan
  ["younis_khan", "Younis Khan", ["younis", "younis khan", "younus khan"]],
  ["wasim", "Wasim Akram", ["wasim", "wasim akram", "sultan of swing"]],
  ["imran_khan", "Imran Khan", ["imran", "imran khan"]],
  ["fakhar_zaman", "Fakhar Zaman", ["fakhar", "fakhar zaman"]],
  ["inzamam", "Inzamam-ul-Haq", ["inzamam", "inzamam ul haq", "inzi"]],
  // New Zealand / South Africa
  ["williamson", "Kane Williamson", ["williamson", "kane williamson", "kane"]],
  ["guptill", "Martin Guptill", ["guptill", "martin guptill"]],
  ["abd", "AB de Villiers", ["abd", "ab de villiers", "de villiers", "mr 360"]],
  ["kallis", "Jacques Kallis", ["kallis", "jacques kallis"]],
  ["herschelle_gibbs", "Herschelle Gibbs", ["gibbs", "herschelle gibbs"]],
];

// tiers: duck single double boundary half_century six century
export const QUESTIONS = [
  { id: "q1", prompt: "Name a captain who lifted a men's ODI World Cup for India.", category: "International · ODI",
    answers: [["dhoni", "single"], ["kapil_dev", "six"]] },

  { id: "q2", prompt: "Name a bowler who has taken a Test hat-trick for India.", category: "International · Test",
    answers: [["harbhajan", "double"], ["bumrah", "boundary"], ["irfan_pathan", "six"]] },

  { id: "q3", prompt: "Name a captain who has won the IPL title.", category: "IPL",
    answers: [["dhoni", "single"], ["rohit_sharma", "double"], ["gambhir", "boundary"], ["shreyas_iyer", "half_century"], ["hardik_pandya", "six"], ["warner", "six"], ["warne", "century"], ["gilchrist", "century"]] },

  { id: "q4", prompt: "Name a batter with a men's double century in ODIs.", category: "International · ODI",
    answers: [["sachin", "single"], ["rohit_sharma", "double"], ["sehwag", "boundary"], ["gayle", "half_century"], ["guptill", "six"], ["fakhar_zaman", "six"], ["ishan_kishan", "century"], ["shubman_gill", "century"]] },

  { id: "q5", prompt: "Name a captain who has won a men's T20 World Cup.", category: "International · T20",
    answers: [["dhoni", "single"], ["rohit_sharma", "single"], ["buttler", "double"], ["finch", "boundary"], ["sammy", "half_century"], ["collingwood", "six"], ["malinga", "six"], ["younis_khan", "century"]] },

  { id: "q6", prompt: "Name a batter with a Test triple century for India.", category: "International · Test",
    answers: [["sehwag", "single"], ["karun_nair", "century"]] },

  { id: "q7", prompt: "Name a captain who has lifted the men's 50-over World Cup (any nation).", category: "International · ODI",
    answers: [["dhoni", "single"], ["ponting", "single"], ["kapil_dev", "double"], ["eoin_morgan", "boundary"], ["pat_cummins", "boundary"], ["imran_khan", "half_century"], ["arjuna_ranatunga", "six"], ["allan_border", "six"], ["steve_waugh", "six"], ["michael_clarke", "six"]] },

  { id: "q8", prompt: "Name a bowler with 400 or more men's Test wickets.", category: "International · Test",
    answers: [["muralitharan", "single"], ["warne", "single"], ["anil_kumble", "double"], ["james_anderson", "double"], ["ashwin", "double"], ["stuart_broad", "boundary"], ["glenn_mcgrath", "boundary"], ["nathan_lyon", "six"], ["courtney_walsh", "six"], ["kapil_dev", "six"], ["rangana_herath", "century"]] },

  { id: "q9", prompt: "Name a batter who has hit six sixes in an over in professional cricket.", category: "Records",
    answers: [["yuvraj_singh", "single"], ["sobers", "boundary"], ["herschelle_gibbs", "half_century"], ["kieron_pollard", "six"], ["ravi_shastri", "century"]] },

  { id: "q10", prompt: "Name a batter with 10,000 or more men's ODI runs.", category: "International · ODI",
    answers: [["sachin", "single"], ["kohli", "single"], ["ponting", "double"], ["ganguly", "boundary"], ["dravid", "boundary"], ["jayasuriya", "six"], ["sangakkara", "six"], ["inzamam", "six"], ["kallis", "six"], ["mahela", "century"], ["brian_lara", "century"]] },

  { id: "q11", prompt: "Name a player who has captained Chennai Super Kings in the IPL.", category: "IPL",
    answers: [["dhoni", "single"], ["jadeja", "six"], ["raina", "century"]] },

  { id: "q12", prompt: "Name a bowler to take 10 wickets in a men's Test match for India.", category: "International · Test",
    answers: [["anil_kumble", "single"], ["ashwin", "single"], ["harbhajan", "double"], ["kapil_dev", "boundary"], ["bumrah", "boundary"], ["srinath", "six"], ["chandrasekhar", "six"], ["prasanna", "six"], ["narendra_hirwani", "century"]] },
];

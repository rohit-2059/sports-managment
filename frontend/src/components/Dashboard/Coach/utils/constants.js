export const SPORT_STATS_FIELDS = {
  Football: ['goals', 'assists', 'shots', 'shotsOnTarget', 'passes', 'tackles', 'fouls', 'yellowCards', 'redCards', 'minutesPlayed'],
  Cricket: ['runs', 'ballsFaced', 'fours', 'sixes', 'wickets', 'ballsBowled', 'runsConceded', 'catches', 'stumpings', 'runOuts'],
  Basketball: ['points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fieldGoalsMade', 'fieldGoalsAttempted', 'threePointersMade', 'minutesPlayed'],
  Volleyball: ['spikes', 'blocks', 'aces', 'digs', 'sets', 'errors', 'serviceErrors', 'receptionErrors'],
  Tennis: ['matchesWon', 'matchesLost', 'setsWon', 'setsLost', 'aces', 'doubleFaults', 'winners', 'unforcedErrors'],
  Badminton: ['matchesWon', 'matchesLost', 'setsWon', 'setsLost', 'aces', 'doubleFaults', 'winners', 'unforcedErrors'],
  Hockey: ['goals', 'assists', 'shots', 'shotsOnGoal', 'penaltyMinutes', 'faceoffWins', 'faceoffLosses', 'hits', 'plusMinus'],
};

export const DEFAULT_STATS_FIELDS = ['appearances', 'wins', 'losses', 'draws', 'mvpAwards', 'rating'];

export const SPORTS_OPTIONS = [
  { value: 'Football', label: '⚽ Football' },
  { value: 'Cricket', label: '🏏 Cricket' },
  { value: 'Basketball', label: '🏀 Basketball' },
  { value: 'Volleyball', label: '🏐 Volleyball' },
  { value: 'Tennis', label: '🎾 Tennis' },
  { value: 'Badminton', label: '🏸 Badminton' },
  { value: 'Hockey', label: '🏑 Hockey' },
  { value: 'Baseball', label: '⚾ Baseball' },
  { value: 'Rugby', label: '🏉 Rugby' },
  { value: 'Other', label: '🏅 Other' },
];

export const getStatsFields = (sport) => {
  return SPORT_STATS_FIELDS[sport] || DEFAULT_STATS_FIELDS;
};

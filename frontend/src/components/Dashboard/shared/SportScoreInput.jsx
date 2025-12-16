import { useState } from 'react';

const SportScoreInput = ({ sport, homeTeam, awayTeam, onSave, onCancel }) => {
    const [homeScore, setHomeScore] = useState({});
    const [awayScore, setAwayScore] = useState({});

    const renderCricketInput = (team, score, setScore, label) => (
        <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">{label}</h4>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-slate-500 font-medium">Runs *</label>
                    <input
                        type="number"
                        min="0"
                        value={score.runs || ''}
                        onChange={(e) => setScore({ ...score, runs: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="134"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-medium">Wickets</label>
                    <input
                        type="number"
                        min="0"
                        max="10"
                        value={score.wickets || ''}
                        onChange={(e) => setScore({ ...score, wickets: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="5"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-medium">Overs</label>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={score.overs || ''}
                        onChange={(e) => setScore({ ...score, overs: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="20"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-medium">Extras</label>
                    <input
                        type="number"
                        min="0"
                        value={score.extras || ''}
                        onChange={(e) => setScore({ ...score, extras: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10"
                    />
                </div>
            </div>
            <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                Score: {score.runs || 0}/{score.wickets || 0} ({score.overs || 0} overs)
            </div>
        </div>
    );

    const renderFootballInput = (team, score, setScore, label) => (
        <div className="space-y-2">
            <h4 className="font-semibold text-slate-800">{label}</h4>
            <div>
                <label className="text-xs text-slate-500 font-medium">Goals *</label>
                <input
                    type="number"
                    min="0"
                    value={score.goals || ''}
                    onChange={(e) => setScore({ goals: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-3xl font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                />
            </div>
        </div>
    );

    const renderBasketballInput = (team, score, setScore, label) => (
        <div className="space-y-2">
            <h4 className="font-semibold text-slate-800">{label}</h4>
            <div>
                <label className="text-xs text-slate-500 font-medium">Points *</label>
                <input
                    type="number"
                    min="0"
                    value={score.points || ''}
                    onChange={(e) => setScore({ points: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-3xl font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                />
            </div>
        </div>
    );

    const renderGenericInput = (team, score, setScore, label) => (
        <div className="space-y-2">
            <h4 className="font-semibold text-slate-800">{label}</h4>
            <div>
                <label className="text-xs text-slate-500 font-medium">Score *</label>
                <input
                    type="number"
                    min="0"
                    value={score.score || ''}
                    onChange={(e) => setScore({ score: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-2xl font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                />
            </div>
        </div>
    );

    const renderScoreInput = (team, score, setScore, label) => {
        switch (sport) {
            case 'Cricket':
                return renderCricketInput(team, score, setScore, label);
            case 'Football':
                return renderFootballInput(team, score, setScore, label);
            case 'Basketball':
                return renderBasketballInput(team, score, setScore, label);
            default:
                return renderGenericInput(team, score, setScore, label);
        }
    };

    const handleSave = () => {
        const scoreDetails = {
            homeTeam: homeScore,
            awayTeam: awayScore
        };
        onSave(scoreDetails);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-sm font-semibold text-blue-800">
                    Sport: {sport || 'General'}
                </p>
            </div>

            {renderScoreInput(homeTeam, homeScore, setHomeScore, `${homeTeam?.name || 'Home Team'}`)}

            <div className="border-t border-slate-200 pt-4">
                {renderScoreInput(awayTeam, awayScore, setAwayScore, `${awayTeam?.name || 'Away Team'}`)}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Save Score
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default SportScoreInput;

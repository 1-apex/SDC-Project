import React, { useState, useEffect } from 'react';

export default function LeaderBoard() {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data.json');
                const data = await response.json();

                // data.forEach(item=>{
                //     console.log(item.gfg_user_name);
                // });
                
                console.log(data);

                setLeaderboardData(data);
            }
            catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <h2>Leaderboard</h2>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Player Name</th>
                        <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboardData.map((player, index) => (
                        <tr key={index}>
                            <td>{player.user_name}</td>
                            <td>{player.gfg_score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

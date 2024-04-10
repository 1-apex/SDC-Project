
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

async function scrapeUserData(userNames) {
    const browser = await puppeteer.launch({ headless: true });
    const scrapedData = [];

    try {

        for (const userName of userNames) {
            const page = await browser.newPage();
            const url = `https://auth.geeksforgeeks.org/user/${userName}`;
            await page.goto(url);
            // console.log(url);

            await page.waitForSelector('.scoreCard_head_card_left--score__pC6ZA');
            const scoreElement = await page.$('.scoreCard_head_card_left--score__pC6ZA');
            const scoreText = await page.evaluate(element => element.textContent, scoreElement);
            // console.log('Score : ' + scoreText);
            scrapedData.push({ user_name: userName, gfg_score: scoreText });
        }
    } catch (error) {
        console.error('Error scraping data:', error);
    } finally {
        updateScoresInJsonFile(scrapedData);
        await browser.close();
    }

    return scrapedData;
}

// module.exports = scrapeUserData;
// console.log(scrapeUserData);

let users = [];

const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:3000/data.json');
        const data = await response.json();

        data.forEach(item => {
            // console.log(item.gfg_user_name);
            users.push(item.gfg_user_name);
        });

        // console.log(users);
        // console.log(scrapeUserData(users));
        scrapeUserData(users);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
};

fetchData();
const fs = require('fs');

// Function to update scores in the JSON file
const updateScoresInJsonFile = (newScores) => {
    // Read the existing JSON data from the file
    fs.readFile('new_data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }

        try {
            // Parse the JSON data into a JavaScript object
            const leaderboardData = JSON.parse(data);
            // console.log("Leaderboard Data : " + data);
            // console.log("new scores recieved Data : " + newScores);

            // Update the scores in the JavaScript object based on newScores
            // newScores.forEach(({ gfg_user_name, score }) => {
            //     const player = leaderboardData.find(player => player.gfg_user_name === gfg_user_name);
            //     if (player) {
            //         player.gfg_score = score;
            //     } else {
            //         console.warn(`Player '${gfg_user_name}' not found in leaderboard data.`);
            //     }
            // });

            newScores.forEach(player => {
                console.log('usr_name: ' + player.user_name + ' gfg_score: ' + player.gfg_score);
                const updated_user = leaderboardData.find(user => user.gfg_user_name === player.user_name);
                if (updated_user) {
                    updated_user.gfg_score = player.gfg_score;
                } else {
                    console.warn(`Player '${player.user_name}' not found in leaderboard data.`);
                }
            })

            // Write the updated JSON data back to the file
            fs.writeFile('new_data.json', JSON.stringify(leaderboardData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                } else {
                    console.log('Scores updated successfully.');
                }
            });
        } catch (error) {
            console.error('Error parsing JSON data:', error);
        }
    });
};
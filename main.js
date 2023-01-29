/**
 * Author: Mikkel-Coder
 * Date: 29-01-2023
 * License: MIT
 * Version: 1.0.0
 */

/**
 * Simulates a game of Bunny Jump Jump
 *
 * @param {number} N - Number of games to simulate.
 * @param {number} PLAYERS - Number of players in the game.
 * @param {string} GAMEMODE - Game mode to play (options: 'slow', 'normal', 'fast').
 * @returns {Map} A map where the key is the game number and the value is an array of win percentages (multiplied by 100).
 * 
 * @example
 * let result = game(1, 3, 'normal');
 * console.log(result); // Output: Map { '0': [100, 0, 0] }
 */
function simulateBunnyJumpJump(N = 1000, PLAYERS = 3, GAMEMODE = 'normal') {
    const CHOICES_DICE = ['green', 'blue', 'purple', 'yellow', 'red', 'bunny']; // All possible outcomes of the dice.
    let winnersMapCumsum = {}; // Used for counting total (accumulative) number of wins per key. 
    let winnersMapCumsumPercentages = {}; // Same as winnersMapCumsum but as percentages*100 

    for (let gameNumber = 0; gameNumber < N; gameNumber++) {
        let holes = {}; // A map of colourspots and if they are occupied or not.
        for (const colour of CHOICES_DICE.slice(0, -1)) { // For every colour except 'bunny'.
            holes[colour] = false; // set value to false.
        }

        let scoreBoard = {}; // A map of a single games outcome where keys are the player and values are the amount of bunnies (points)
        for (let i = 1; i <= PLAYERS; i++) {
            scoreBoard[i] = 0;
        }

        let bunniesRemaining = 20; // Bunnies remaining in the pool.
        let currentPlayer = 1;

        while (bunniesRemaining > 0) { // As long there are bunnies in the pool continue playing.
            let dice_outcome = CHOICES_DICE[Math.floor(Math.random() * CHOICES_DICE.length)]; // Random outcome.

            if (dice_outcome === 'bunny') { // If we hit 'bunny'
                switch (GAMEMODE) { // Check gamerules for further detail.
                    case 'slow':
                        if (scoreBoard[currentPlayer] > 0) {
                            scoreBoard[currentPlayer]--;
                            bunniesRemaining++;
                        }
                        break;
                    case 'normal':
                        scoreBoard[currentPlayer]++;
                        bunniesRemaining--;
                        break;
                    case 'fast':
                        break;
                }
            } else if (holes[dice_outcome]) { // If we hit a colourspot where a bunny is.
                scoreBoard[currentPlayer]++;
                holes[dice_outcome] = false;
            } else { // Otherwise take a bunny from the pool.
                bunniesRemaining--;
                holes[dice_outcome] = true;
            }
            currentPlayer++;

            if (currentPlayer > PLAYERS) { // If it is the last player,
                currentPlayer = 1; // then start from player 1.
            }
        }

        if (bunniesRemaining === 0) { // When a single game ends, calculate the sum of wins and percentages.
            let winnersInt = [];
            let winnersPercentages = [];

            for (let l = 1; l <= PLAYERS; l++) { // Check for every Player
                try {
                    var previous_value = winnersMapCumsum[gameNumber - 1][l - 1]; // We need to know the previous value to calculate the sum.
                } catch (error) {
                    var previous_value = 0; // If it is the first game, then we must start from 0.
                }

                if (scoreBoard[l] === Math.max(...Object.values(scoreBoard))) { // If the player got the highest score.
                    winnersInt.push(1 + previous_value);
                    winnersPercentages.push((1 + previous_value) / (gameNumber + 1) * 100);
                } else { // Otherwise they lost.
                    winnersInt.push(0 + previous_value);
                    winnersPercentages.push((0 + previous_value) / (gameNumber + 1) * 100);
                }

                // Save the outcome to the maps.
                winnersMapCumsum[gameNumber] = winnersInt;
                winnersMapCumsumPercentages[gameNumber] = winnersPercentages;
            }
        }
    }
    return winnersMapCumsumPercentages;
}

console.log(simulateBunnyJumpJump())
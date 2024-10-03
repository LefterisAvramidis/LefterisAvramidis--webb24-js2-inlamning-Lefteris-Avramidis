document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let highscoreList = [];

    const guessForm = document.getElementById('gissningsform');
    const guessInput = document.getElementById('gissning-input');
    const result = document.getElementById('resultat');
    const scoreDisplay = document.getElementById('poäng');
    const highscoreListDisplay = document.getElementById('highscore-lista');
    const resetButton = document.getElementById('reset-btn'); 

    
    function fetchHighscores() {
        fetch('http://localhost:3000/highscores')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    highscoreList = data;
                    updateHighscoreList();
                } else {
                    console.error('Highscore-listan är inte en giltig array:', data);
                }
            })
            .catch(err => console.error('Kunde inte hämta highscorelistan', err));
    }
    
    
    function sendScore(name, score) {
        fetch('http://localhost:3000/highscores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, score })
        })
        .then(response => {
            if (response.status === 201) {
                alert('Din poäng har lagts till på highscorelistan!');
                fetchHighscores(); 
            } else {
                alert('Din poäng platsade inte på highscorelistan.');
            }
        })
        .catch(err => console.error('Kunde inte skicka poängen', err));
    }

    
    function resetHighscores() {
        fetch('http://localhost:3000/highscores/reset', {
            method: 'POST',
        })
        .then(response => {
            if (response.ok) {
                alert('Highscorelistan har återställts!');
                fetchHighscores(); 
            } else {
                alert('Kunde inte återställa highscorelistan.');
            }
        })
        .catch(err => console.error('Kunde inte återställa highscorelistan', err));
    }

    
    function updateHighscoreList() {
        highscoreListDisplay.innerHTML = ''; 
        highscoreList.forEach((entry) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name}: ${entry.score}`;
            highscoreListDisplay.appendChild(listItem);
        });
    }

    
    guessForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const userGuess = parseInt(guessInput.value);
        const computerNumber = Math.floor(Math.random() * 3) + 1;   

        if (userGuess === computerNumber) {
            score++;
            result.textContent = 'Rätt gissat! Datorn tänkte på ' + computerNumber;
            result.style.color = "green";
            scoreDisplay.textContent = score;
        } else {
            result.textContent = 'Fel! Datorn tänkte på ' + computerNumber;
            result.style.color = "red";

            const playerName = prompt('Fel! Ange ditt namn för att spara din poäng:');
            if (playerName) {
                sendScore(playerName, score); 
            }

            score = 0; 
            scoreDisplay.textContent = score;
        }

        guessInput.value = ''; 
    });

    
    resetButton.addEventListener('click', resetHighscores); 

    
    fetchHighscores();
});

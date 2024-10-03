const express = require('express'); 
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const highscoreFile = path.join(__dirname, 'highscore.json');


app.get('/highscores', (req, res) => {
    fs.readFile(highscoreFile, (err, data) => {
        if (err) {
            console.error('Error reading highscore file:', err); 
            return res.status(500).json({ error: 'Kunde inte läsa highscorelistan' });
        }
        
        try {
            const highscores = JSON.parse(data || '[]');  
            console.log('Highscore-data:', highscores);   
            res.json(highscores);
        } catch (err) {
            console.error('Fel vid parsning av highscorelistan:', err);
            return res.status(500).json({ error: 'Fel vid parsning av highscorelistan' });
        }
    });
});


app.post('/highscores', (req, res) => {
    const { name, score } = req.body;

    if (!name || score === undefined) {
        return res.status(400).json({ error: 'Namn och poäng krävs' });
    }

    fs.readFile(highscoreFile, (err, data) => {
        if (err) {
            console.error('Error reading highscore file:', err);  
            return res.status(500).json({ error: 'Kunde inte läsa highscorelistan' });
        }

        let highscores = JSON.parse(data || '[]');  
        
        if (highscores.length < 5 || score > highscores[4].score) {
            highscores.push({ name, score });
            highscores.sort((a, b) => b.score - a.score); 
            if (highscores.length > 5) {
                highscores.pop(); 
            }

            fs.writeFile(highscoreFile, JSON.stringify(highscores), (err) => {
                if (err) {
                    console.error('Error writing highscore file:', err);  
                    return res.status(500).json({ error: 'Kunde inte spara highscorelistan' });
                }
                res.status(201).json({ message: 'Poängen har lagts till' });
            });
        } else {
            res.status(200).json({ message: 'Poängen platsar inte på listan' });
        }
    });
});


app.post('/highscores/reset', (req, res) => {
    const emptyHighscores = []; 

    fs.writeFile(highscoreFile, JSON.stringify(emptyHighscores), (err) => {
        if (err) {
            console.error('Error resetting highscore file:', err);  
            return res.status(500).json({ error: 'Kunde inte återställa highscorelistan' });
        }
        res.status(200).json({ message: 'Highscorelistan har återställts' });
    });
});


app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});

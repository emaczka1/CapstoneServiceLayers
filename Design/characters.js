document.addEventListener('DOMContentLoaded', async () => {
    const charactersList = document.getElementById('charactersList');

    try {
        // Fetch characters from the server
        const response = await fetch('/characters');
        const characters = await response.json();

        // Display characters in the list
        characters.forEach(character => {
            const characterItem = document.createElement('div');
            characterItem.classList.add('character-item');
            characterItem.textContent = `Name: ${character.name},
                                        Age: ${character.age},
                                        Gender: ${character.gender},
                                        Species: ${character.species},
                                        Eyes: ${character.eyes},
                                        Hair: ${character.hair},
                                        Skin: ${character.skin},
                                        Height: ${character.height},
                                        Other: ${character.other},
                                        Personality: ${character.personality},
                                        Traits: ${character.traits},
                                        Background: ${character.background},
                                        Occupation: ${character.occupation},
                                        Hobbies: ${character.hobbies},
                                        Goals: ${character.goals},
                                        Fears: ${character.fears},
                                        Religion: ${character.religion},
                                        Flaws: ${character.flaws}`;
            charactersList.appendChild(characterItem);
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
});
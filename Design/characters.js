document.addEventListener('DOMContentLoaded', async () => {
    const charactersList = document.getElementById('charactersList');

    try {
        // Fetch characters from the server
        const response = await fetch('/characters');
        const characters = await response.json();

        // Display characters in the list
        characters.forEach(character => {
            const characterItem = document.createElement('div');
            characterItem.textContent = `Name: ${character.name}, Age: ${character.age}, Gender: ${character.gender}, Species: ${character.species}`;
            charactersList.appendChild(characterItem);
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const charactersList = document.getElementById('charactersList');
    const searchInput = document.getElementById('searchInput');

    try {
        // Fetch characters from the server
        const response = await fetch('/characters');
        const characters = await response.json();

        // Add event listener for the search input
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();

            // Filter characters based on the search term
            const filteredCharacters = characters.filter(character => {
                const characterInfo = Object.values(character).join(' ').toLowerCase();
                return characterInfo.includes(searchTerm);
            });

            // Clear the existing character list
            charactersList.innerHTML = '';

            // Display the filtered characters
            filteredCharacters.forEach(filteredCharacter => {
                const filteredCharacterItem = document.createElement('div');
                filteredCharacterItem.classList.add('character-item');

                filteredCharacterItem.textContent = `
                Name: ${filteredCharacter.name},
                Age: ${filteredCharacter.age},
                Gender: ${filteredCharacter.gender},
                Species: ${filteredCharacter.species},
                Eyes: ${filteredCharacter.eyes},
                Hair: ${filteredCharacter.hair},
                Skin: ${filteredCharacter.skin},
                Height: ${filteredCharacter.height},
                Other: ${filteredCharacter.other},
                Personality: ${filteredCharacter.personality},
                Traits: ${filteredCharacter.traits},
                Background: ${filteredCharacter.background},
                Occupation: ${filteredCharacter.occupation},
                Hobbies: ${filteredCharacter.hobbies},
                Goals: ${filteredCharacter.goals},
                Fears: ${filteredCharacter.fears},
                Religion: ${filteredCharacter.religion},
                Flaws: ${filteredCharacter.flaws}`;

                charactersList.appendChild(filteredCharacterItem);
            });
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
});

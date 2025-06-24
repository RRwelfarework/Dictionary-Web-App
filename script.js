const themeBtn = document.getElementById("themeBtn");
const fontSelector = document.getElementById("fontSelector");
const body = document.body;
const output = document.getElementById("output");

themeBtn.onclick = () => {
  body.classList.toggle("dark");
};

fontSelector.onchange = (e) => {
  body.style.fontFamily = e.target.value;
};

async function searchWord() {
  const input = document.getElementById("wordInput").value.trim();
  if (!input) return;
  output.innerHTML = `<p>Loading...</p>`;

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`);
    const data = await res.json();

    if (data.title === "No Definitions Found") {
      output.innerHTML = `<p>No results for "${input}"</p>`;
      return;
    }

    const entry = data[0];
    const phonetic = entry.phonetics.find(p => p.text)?.text || '';
    const audio = entry.phonetics.find(p => p.audio)?.audio || '';

    let html = `
      <div class="word-title">
        <span>${entry.word}</span>
        ${audio ? `<button onclick="new Audio('${audio}').play()">🔊</button>` : ''}
      </div>
      <div class="phonetic">${phonetic}</div>
      <div class="meanings">
    `;

    entry.meanings.forEach(meaning => {
      html += `
        <div class="meaning-block">
          <strong>${meaning.partOfSpeech}</strong>
          <ul>
            ${meaning.definitions.map(d => `<li>${d.definition}</li>`).join('')}
          </ul>
          ${meaning.synonyms.length ? `<div class="synonyms">Synonyms: ${meaning.synonyms.join(', ')}</div>` : ''}
        </div>
      `;
    });

    html += '</div>';
    output.innerHTML = html;
  } catch (err) {
    output.innerHTML = `<p>Error loading definition.</p>`;
  }
}
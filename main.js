// load a random quote
function getQuote() {
  fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => {
      const quote = data[0];
      document.getElementById("quote-text").innerText = `"${quote.q}"`;
      document.getElementById("quote-author").innerText = `— ${quote.a}`;
    });
}

// set up voice commands
function setupAnnyang() {
  if (!annyang) {
    console.log("Annyang not found.");
    return;
  }

  const commands = {
    // say "hello"
    'hello': () => {
      console.log('Heard: hello');
      alert('Hello World!');
    },

    // say "change the color to pink"
    'change the color to *pink': (color) => {
      console.log('Heard: change the color to', color);
      document.body.style.backgroundColor = color;
    },

    // say "navigate to home", "navigate to dogs", etc.
    'navigate to *page': (page) => {
      console.log('Heard: navigate to', page);
      const p = page.toLowerCase();
      if (p.includes('stock')) location.href = 'stocks.html';
      else if (p.includes('dog')) location.href = 'dogs.html';
      else location.href = 'index.html';
    },

    // say "lookup AAPL"
    'lookup *ticker': (ticker) => {
      console.log('Heard: lookup', ticker);
      const input = document.getElementById('ticker-input');
      if (input && typeof fetchStock === 'function') {
        input.value = ticker.toUpperCase();
        fetchStock(ticker.toUpperCase(), 30);
      }
    },

    // say "load dog breed husky"
    'load dog breed *name': (name) => {
      console.log('Heard: load dog breed', name);
      if (typeof loadDogBreed === 'function') {
        loadDogBreed(name);
      } else {
        alert('Breed command not available on this page.');
      }
    }
  };

  annyang.addCommands(commands);

  // show what was heard
  annyang.addCallback('result', (phrases) => {
    console.log('You said:', phrases);
  });

  annyang.start({ autoRestart: true, continuous: true });
  console.log("Annyang started");
}

// turn on mic
function startListening() {
  if (annyang) annyang.start();
}

// turn off mic
function stopListening() {
  if (annyang) annyang.abort();
}

// run on page load
window.addEventListener('load', () => {
  if (document.getElementById('quote-text')) {
    getQuote();
  }

  if (typeof setupAnnyang === 'function') {
    setupAnnyang();
  }

  const onBtn = document.getElementById("audioOn");
  const offBtn = document.getElementById("audioOff");
  if (onBtn) onBtn.onclick = startListening;
  if (offBtn) offBtn.onclick = stopListening;
});

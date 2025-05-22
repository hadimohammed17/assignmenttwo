// run when page loads
window.onload = function () {
  loadDogCarousel();
  loadDogBreeds();
  setupAnnyang();
};

// show dog images with arrow buttons
function loadDogCarousel() {
  fetch("https://dog.ceo/api/breeds/image/random/10")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("dogCarousel");
      container.innerHTML = "";

      let index = 0;
      const img = document.createElement("img");
      img.src = data.message[index];
      img.style.width = "300px";
      img.style.borderRadius = "10px";

      const leftArrow = document.createElement("button");
      leftArrow.textContent = "←";
      leftArrow.className = "home-button";
      leftArrow.onclick = () => {
        index = (index - 1 + data.message.length) % data.message.length;
        img.src = data.message[index];
      };

      const rightArrow = document.createElement("button");
      rightArrow.textContent = "→";
      rightArrow.className = "home-button";
      rightArrow.onclick = () => {
        index = (index + 1) % data.message.length;
        img.src = data.message[index];
      };

      const layout = document.createElement("div");
      layout.style.display = "flex";
      layout.style.justifyContent = "center";
      layout.style.alignItems = "center";
      layout.style.gap = "20px";
      layout.appendChild(leftArrow);
      layout.appendChild(img);
      layout.appendChild(rightArrow);

      container.appendChild(layout);
    });
}

// get 10 random dog breeds and make buttons
function loadDogBreeds() {
  fetch("https://api.thedogapi.com/v1/breeds")
    .then(res => res.json())
    .then(data => {
      const breedButtons = document.getElementById("breed-buttons");
      breedButtons.innerHTML = "";

      window.allBreeds = data; // save for voice use

      const selected = data.sort(() => 0.5 - Math.random()).slice(0, 10);
      selected.forEach(breed => {
        const btn = document.createElement("button");
        btn.textContent = breed.name;
        btn.className = "home-button";
        btn.onclick = () => showBreedInfo(breed);
        breedButtons.appendChild(btn);
      });
    });
}

// show breed info when a button is clicked
function showBreedInfo(breed) {
  document.getElementById("breed-name").textContent = breed.name;
  document.getElementById("breed-description").textContent = breed.temperament || "No description";
  const [min, max] = breed.life_span.split("-");
  document.getElementById("min-life").textContent = min?.trim() || "";
  document.getElementById("max-life").textContent = max?.trim() || min?.trim() || "";
  document.getElementById("breed-info").style.display = "block";
}

// used by voice command to load a breed
function loadDogBreed(breedName) {
  if (!window.allBreeds) return;

  const name = breedName.toLowerCase();
  let match = window.allBreeds.find(b => b.name.toLowerCase() === name);
  if (!match) match = window.allBreeds.find(b => b.name.toLowerCase().includes(name));
  if (match) showBreedInfo(match);
}

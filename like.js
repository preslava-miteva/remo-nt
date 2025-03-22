function CallFavs() {
    const container = document.getElementById('container');
    container.innerHTML = "";

    const n = localStorage.getItem("counter"); 
    if (n) {
        for (let i = 1; i <= n; i++) {
            let loadRecipe = localStorage.getItem("liked." + i);
            if (loadRecipe) {
                let child = generateHTML(loadRecipe);
                container.appendChild(child);
            }
        }
    } else {
        container.textContent = "No data found in localStorage.";
    }
}

function generateHTML(jsonString) {
    const json = JSON.parse(JSON.parse(jsonString));
    let container = document.createElement("div");
    let html = `<h1 class="textContainer">${json.name}</h1>`;
    if (json.ingredients) {
        html += `<p class="pContainer">Ingredients:</p><ul class="pContainer">`;
        json.ingredients.forEach(item => {
            html += `<li>${item}</li>`;

        });
        html += `</ul>`;
    }
    
    if (json.process) {
        html += `<p class="pContainer">Preparation Steps:</p><ol class="pContainer">`;
        json.process.forEach(step => {
            html += `<li>${step}</li>`;
        });
        html += `</ol>`;
    }
    html += '<br><br>'
    container.innerHTML = html;
    return container;
}

window.onload = CallFavs();
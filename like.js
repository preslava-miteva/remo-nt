function CallFavs() {
    const container = document.getElementById('container');
    container.innerHTML = "";

    const n = localStorage.getItem("counter"); 
    
    if (n) {
        for (let i = 1; i <= n; i++) {
            let loadRecipe = localStorage.getItem("liked." + i);
            if (loadRecipe) {
                const p = document.createElement("p");
                p.textContent = loadRecipe;
                container.appendChild(p);
            }
        }
    } else {
        container.textContent = "No data found in localStorage.";
    }
}

// Run function when page loads
window.onload = CallFavs;
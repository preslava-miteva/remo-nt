const portions = document.getElementById("quantity");
const allergies = document.getElementById("alerg");
const othereq = document.getElementById("req");
const time = document.getElementById("appointment");
const btn = document.getElementById("output");

btn.addEventListener("click", async function() {
    await generate_inference();
});


const MODEL_NAME = "mistralai/mistral-small-3.1-24b-instruct:free";
const requirements = [time, othereq, portions];
const PROMPT = "You are a helpful diet assistant. You will generate a healthy zone recipe based on the requirements:" + requirements + " Return your answer in json format with fields: name, ingredients and process. Make sure you only return the json";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";


    const json = JSON.parse(jsonString);
            let container = document.getElementById("result");
            let html = `<h1>${json.name}</h1>`;

            if (json.ingredients) {
                html += `<p class='section-title'>Ingredients:</p><ul>`;
                json.ingredients.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += `</ul>`;
            }
            
            if (json.process) {
                html += `<p class='section-title'>Preparation Steps:</p><ol>`;
                json.process.forEach(step => {
                    html += `<li>${step}</li>`;
                });
                html += `</ol>`;
            }
            
            container.innerHTML = html;

            async function generate_inference() {
                try {
                    const requirements = {
                        portions: portions.value,
                        allergies: allergies.value,
                        other_requirements: othereq.value,
                        time: time.value
                    };
                }
        catch{ const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "HTTP-Referer": "http://localhost:3000",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    {
                        "role": "user",
                        "content": PROMPT
                    }
                ]
            })
        })};
        
        function generateHTML(json) {
            let container = document.getElementById("result");
            let html = `<h1>${json.name}</h1>`;
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        console.log(data);
        const recipe = data.choices[0].message.content

        generateHTML(recipe.substring(recipe.indexOf("{"), recipe.lastIndexOf("}") + 1));
        return data.choices[0].message.content;
    } try {catch{ (error) => {
        console.error("Error during inference:", error.message);
        throw error;
    }
}
}






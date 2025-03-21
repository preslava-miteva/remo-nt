 const minutes = document.getElementById("minutes");
 const hours = document.getElementById("hours");
 const request = document.getElementById("req");
 const portions = document.getElementById("num").value;
 const allergies = document.getElementById("alg");   
 
 function getTimeInMinutes() {
    return Number(minutes.value) + Number(hours.value) * 60;
}

 function generateHTML(jsonString) {
        const json = JSON.parse(jsonString);
        let container = document.getElementById("AI");
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
    }   

const time = getTimeInMinutes();
// Function to make inference request to OpenRouter API
const MODEL_NAME = "mistralai/mistral-small-3.1-24b-instruct:free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";   
const PROMPT = "You are a helpful diet asssitant. You will generate a zone diet recipe with the zone block ratio on the following requirements: the amounth of portions: " + portions + ", the requirements given by the user: " + request + ", the maximum time to make is " + time + "and avoid the ingredients specified " + allergies + ". Return your answer in json format with fields: name, ingredients and process. Make sure you only return the json" 

const specifiedElement = document.getElementById('btn')

// I'm using "click" but it works with any event
document.addEventListener('click', async event => {
  console.log("button clicked");
  const recipe = await generate_inference();
  document.getElementById("AI").textContent = recipe;
})

// Function to make inference request to OpenRouter API
async function generate_inference() {
try {
    const response = await fetch(API_URL, {
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
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); 
    console.log(data);

    // const recipe = data.choices[0].message.content.split("json")[1] ?? 'Name: Shake and Bake Zucchini Fries \n     \n3 Baggies    \n1/2 lb Zucchini (cut into 3-4 inch sticks)    \n1 1/2 tbsps Almond meal (divided)    \n1 1/2 tbsps Flour (divided)    \n1 tbsps Parmesan (finely grated)    \nTo Taste Salt and pepper    \n3 tbsps Egg beaters-whites    \n1 tbsps 1% milk    \nCooking spray (Pam olive oil)    \n1/3 cup Tomato sauce (warmed)'

    // document.getElementById("suggested-time").textContent = recipe.substring(recipe.indexOf("{"), recipe.lastIndexOf("}") + 1);
    const res =  data.choices[0].message.content;
   // generateHTML(JSON.parse(res));
    return res.substring(res.indexOf("{"), res.lastIndexOf("}") + 1);
} catch (error) {
    console.error("Error during inference:", error.message);
    throw error;
}
}

function displayRecipe(json) {
    let html = `
        <h1 style="color: #2c3e50; text-align: center;">${json.name}</h1>
        <hr style="border: 1px solid #ccc; margin-bottom: 10px;">
    `;

    if (json.ingredients) {
        html += `<h2 style="color: #27ae60;">Ingredients</h2><ul style="padding-left: 20px;">`;
        json.ingredients.forEach(item => {
            html += `<li style="font-size: 18px; margin-bottom: 5px;">${item}</li>`;
        });
        html += `</ul>`;
    }

    if (json.process) {
        html += `<h2 style="color: #e67e22;">Preparation Steps</h2><ol style="padding-left: 20px;">`;
        json.process.forEach((step, index) => {
            html += `<li style="font-size: 18px; margin-bottom: 5px;"><strong>Step ${index + 1}:</strong> ${step}</li>`;
        });
        html += `</ol>`;
    }

    outputContainer.innerHTML = html;
}

 const minutes = document.getElementById("minutes");
 const hours = document.getElementById("hours");
 const request = document.getElementById("req");
 const portions = document.getElementById("num").value;
 const allergies = document.getElementById("alg");   
 

let rec = {

}

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

    function addListItem(item) {
        // Step 1: Select the list element
        const list = document.getElementById('ing');
  
        // Step 2: Create a new list item
        const newItem = document.createElement('li');
  
        // Step 3: Set the content of the list item
        newItem.textContent =  item;
  
        // Step 4: Append the new list item to the list
        list.appendChild(newItem);
      }
    

const time = getTimeInMinutes();
// Function to make inference request to OpenRouter API
const MODEL_NAME = "mistralai/mistral-small-3.1-24b-instruct:free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";   


const specifiedElement = document.getElementById('btn')

// I'm using "click" but it works with any event
document.getElementById("btn").addEventListener('click', async event => {
  console.log("button clicked");
  const recipe = await generate_inference();
  const recipeOBJ = JSON.parse(recipe);
  document.getElementById("recipeTitle").textContent = recipeOBJ.name;
  recipeOBJ.ingredients.forEach((ingr) => addListItem(ingr));
  document.getElementById("proc").textContent = recipeOBJ.process;

})

// Function to make inference request to OpenRouter API
async function generate_inference() {
    try {
        const PROMPT = "You are a helpful diet asssitant. You will generate a zone diet recipe with the zone block ratio on the following requirements: the amounth of portions: " + portions + ", the requirements given by the user: " + request + ", the maximum time to make is " + time + "and avoid the ingredients specified " + allergies + ". Return your answer in json format with fields: name, ingredients and process. Return the list of ingredient as an array of strings where every ingredient is a list item. Make sure you only return the json" 
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
    rec = res.substring(res.indexOf("{"), res.lastIndexOf("}") + 1);
    return rec;
} catch (error) {
    console.error("Error during inference:", error.message);
    throw error;
}
}

function like(){
    const old = JSON.parse(localStorage.getItem("liked"))
   console.log("old", old);
    if (old){
        old.push(rec)
        localStorage.setItem("liked", JSON.stringify( old));
    }
    else{
        localStorage.setItem("liked", JSON.stringify([rec]))
    }
}
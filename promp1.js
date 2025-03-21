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

const MODEL_NAME = "mistralai/mistral-small-3.1-24b-instruct:free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";   


const specifiedElement = document.getElementById('btn')

document.getElementById("btn").addEventListener('click', async event => {
  console.log("button clicked");
  const recipe = await generate_inference();
  const recipeOBJ = JSON.parse(recipe);
  document.getElementById("recipeTitle").textContent = recipeOBJ.name;
  recipeOBJ.ingredients.forEach((ingr) => addListItem(ingr));
  document.getElementById("proc").textContent = recipeOBJ.process;

})
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

    const res =  data.choices[0].message.content;
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
const addNote = document.querySelector(".addNote");
const form = document.querySelector(".formmaindiv");
const tagstext = document.querySelector(".tagstext");
const formheadingtext = document.querySelector(".titletext");
const formnotetext = document.querySelector(".notetext");
const savebtn = document.querySelector(".savebtn");
const cancelBtn = document.querySelector(".cancel");
const circles = document.querySelectorAll(".circle");
const yesbtn = document.querySelector(".yes");
const nobtn = document.querySelector(".no");
const outererror = document.querySelector(".errorouterdiv");
const forms = document.querySelector(".formdiv");
const dropdown = document.querySelector(".dropdown");
const dropdownLabel = document.getElementById('dropdown-label');
const multilevel = document.querySelector('.multilevel');
const searchbar = document.querySelector('.searchbar');
const boxes = document.querySelector(".boxes");
const titledivsidebar = document.querySelector(".titledivsidebar");
const tagsdiv = document.querySelector(".tagsdiv");
const contentdiv = document.querySelector(".contentdiv");
const orignalbtn = document.querySelector(".orignalbtn");
const summarybtn = document.querySelector(".summarybtn");
const orignalcontent = document.querySelector(".orignalcontent");
const summarycontent = document.querySelector(".summarycontent");
const cancelside = document.querySelector(".cancel2");
const outersidebar = document.querySelector(".outersidebar");
const selectenter = document.querySelector(".selectenter");
const quizenterbtn =document.querySelector(".quizenter");
const quizcancel = document.querySelector(".cancelquiz");
const filtersearch = document.getElementById("filtersearch");
const cancel3 = document.querySelector(".cancel3");


const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
const year = currentDate.getFullYear();

let pressedonce =false;
let currentCardId = null;
let summaryoftext="";
let origparagraph = formnotetext.value.trim();
let keywordsofsumary = [];
let colorchosen ;
let currentcard=[];
const colorpick=["#1e9eb7","#e57373","#64b5f6","#81c784","#ffb74d"];
let count = 0;
const gradients = [
    "linear-gradient(to right, #ff7e5f, #feb47b)",
    "linear-gradient(to right, #6a11cb, #2575fc)",
    "linear-gradient(to right, #00c6ff, #0072ff)",
    "linear-gradient(to right, #fbc2eb, #a6c1ee)",
    "linear-gradient(to right, #ff5e62, #ff9966)"
];
let globalquizwords =[];

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.length>0){
        
        createCard();
    
    }else{
       

        const noResultsMessage = document.createElement("h1");
            noResultsMessage.textContent = "Create a Note Now :)";
            noResultsMessage.style.fontFamily = "sans-serifs";
            noResultsMessage.style.opacity = "0.4";
            boxes.appendChild(noResultsMessage);  
    }
   
});
document.addEventListener("DOMContentLoaded", () => {

    // Use event delegation to handle dynamically added elements
    boxes.addEventListener("click", function(event) {
        if (event.target.closest(".expandbtn")) {
            outersidebar.classList.remove("hidden");

            const nav = document.querySelector("nav");
            nav.classList.add("hidden");
            const main = document.querySelector("main");
            main.style.flex = "0.6";
            main.style.columnGap = "0px";

            // Find the clicked element
            const clickedElement = event.target.closest(".expandbtn");

            // Get the parent element of the clicked button
            const parentElement = clickedElement.closest(".card");
            const parentId = parentElement ? parentElement.id : null;


            console.log("Parent ID:", parentId);
            createSide(parentId);

            currentCardId = parentId;

        }
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     const expandicon = document.querySelectorAll(".expandbtn");
//     const outersidebar = document.querySelector(".outersidebar");

//     expandicon.forEach(element => {
//         element.addEventListener("click",function(event){
//             outersidebar.classList.remove("hidden");

//             const clickedElement = event.target;
//             const parentElement = clickedElement.parentElement;
//             const parentId = parentElement ? parentElement.id : null;
//             console.log("Parent ID:", parentId);


//         });
//     });
    
// });


const isEmpty = str => !str.trim().length;
const clearcontent = () => {
    formheadingtext.value = "";
    formnotetext.value = "";
    tagstext.value = "";
    const div = document.querySelector(".wheretagsgo");
    div.innerHTML = "";
    colorchosen="";
    forms.style.backgroundColor = "white";
    formnotetext.style.backgroundColor = "transparent";
    formheadingtext.style.backgroundColor = "transparent";
    tagstext.style.backgroundColor = "transparent";
};


function updateCount() {
    const cardCountKey = "cardcount"; 
    let count = parseInt(localStorage.getItem(cardCountKey), 10) || 0; 
    count++;
    localStorage.setItem(cardCountKey, count.toString()); 
}

const createSingleCard = (template,templateid) => {
    

    const cd = document.createElement("div");
    cd.className = "card";
    // cd.setAttribute("data-card-id",cardcountnum);
    cd.id = templateid;
    
    cd.style.backgroundColor = template.color;

    const innercard = document.createElement("div");
    innercard.className = "innercard";
    cd.appendChild(innercard);

    const heading = document.createElement("h1");
    heading.textContent = template.title;

    const para = document.createElement("p");
    para.className = "innercardp";
    para.textContent = template.para;

    innercard.appendChild(heading);
    innercard.appendChild(para);

    const footercard = document.createElement("div");
    footercard.className = "footercard";
    innercard.appendChild(footercard);

    if (Array.isArray(template.tags) && template.tags.length > 0) {
        const tags = document.createElement("div");
        tags.className = "tags";

        template.tags.forEach((tag) => {
            const sp = document.createElement("span");
            sp.className = "cardtagspan";
            sp.textContent = tag;
            tags.appendChild(sp);
        });

        footercard.appendChild(tags);
    }

    const expand = document.createElement("div");
    expand.className = "expand";

    const btn = document.createElement("button");
    btn.className = "expandbtn";
    const i = document.createElement("i");
    i.className = "fas fa-expand";
    btn.appendChild(i);
    expand.appendChild(btn);

    footercard.appendChild(expand);

    boxes.appendChild(cd);
};

const createCard = () => {
    boxes.innerHTML = ""; 

    const storedCards = JSON.parse(localStorage.getItem("cards")) || [];

    storedCards.forEach((template) => {
        createSingleCard(template,template.id);
    });
};

const appendObject = (origpara,summarizedText="", keywords =[]) => {
    

    const cardCountKey = "cardcount";
    if(!localStorage.getItem("cardcount")){
        localStorage.setItem("cardcount","0");
    }
    let cardcountnum = parseInt(localStorage.getItem(cardCountKey), 10) || 0; 

    const idCard = cardcountnum;
    updateCount();

    const listOfCards = JSON.parse(localStorage.getItem("cards")) || [];
    const div = document.querySelector(".wheretagsgo");

    const spans = div.getElementsByTagName("span");
    const dataArray = Array.from(spans).map(span => span.textContent);

    const color = colorpick[colorchosen] || "#f5f5f5"; 

    console.log("append",origpara);
    const newCard = {
        id : idCard,
        date : `${day}-${month}-${year}`,
        title: formheadingtext.value.trim(),
        para: origpara,
        summary: summarizedText,
        tags: dataArray,
        color: color,
        keys: keywords,
    };

    listOfCards.push(newCard);
    localStorage.setItem("cards", JSON.stringify(listOfCards));

    
    createSingleCard(newCard,idCard);

    clearcontent();
    form.classList.add("hidden");


    summaryoftext = "";
            origparagraph="";
            keywordsofsumary=[];
};

function updateDropdownLabel() {
    const selectedOptions = [];

    // Check Summary checkbox
    const summaryCheckbox = document.getElementById('A');
    if (summaryCheckbox.checked) {
        let summaryText = "";

        // Check Strength checkbox
        const strengthCheckbox = document.getElementById('A-1');
        if (strengthCheckbox.checked) {

            const radios = multilevel.querySelectorAll('input[name="grp1"]');
            const selectedRadio = Array.from(radios).find(radio => radio.checked);
            if (selectedRadio) {
                summaryText += "Summarize";
                const burger = document.getElementById("burger");

                const allcheckbox = multilevel.querySelectorAll('input[type="checkbox"');
                const allradios = multilevel.querySelectorAll('input[type="radio"');
                allcheckbox.forEach((check)=>{
                    check.checked=false;
                })
                allradios.forEach((check)=>{
                    check.checked=false;
                })
                burger.checked=false;
            }
        }

        selectedOptions.push(summaryText);
       
    }

    savebtn.textContent = "";
    savebtn.textContent = selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select Options';

    
};

const search =(value)=>{
    const myreg = /[^a-zA-Z0-9_\s]/g;

    return myreg.test(value);

}

const searchforsearchbar = (value) => {
    // Regex for matching words with a hash (#)
    const hashRegex = /([#])\w+/g;

    // Split the input string into words based on spaces
    const words = value.split(/\s+/);
    console.log("Words from input:", words);  // Log input words

    // Filter words with hashes and without hashes
    const onlyhash = words.filter((element) => hashRegex.test(element));
    const noHashWords = words.filter((word) => !hashRegex.test(word));

    console.log("Words with hash:", onlyhash);  // Log words that have hashes
    console.log("Words without hash:", noHashWords);  // Log words that don't have hashes

    // Get cards from localStorage (assuming each card is an object with 'title' and 'tags')
    let tempcardsarr = JSON.parse(localStorage.getItem("cards")) || [];
    console.log("Cards from localStorage:", tempcardsarr);  // Log localStorage cards

    // Filter the cards based on the input words
    const matchingCards = tempcardsarr.filter((card) => {
        // Check if any of the non-hashed words match the title
        const titleMatches = noHashWords.some((word) => card.title.toLowerCase().includes(word.toLowerCase()));

        // Check if any of the hashed words match the tags
        const tagMatches = onlyhash.some((word) => card.tags.some(tag => tag.toLowerCase() === word.toLowerCase()));

        // Return true if either title or tags match
        return titleMatches || tagMatches;
    });

    console.log("Matching cards:", matchingCards);  // Log matching cards

    return matchingCards;
};

const createSide = (Parentid) => {
    titledivsidebar.innerHTML = "";
    tagsdiv.innerHTML = "";
    contentdiv.innerHTML = "";
    summarycontent.innerHTML = "";
    orignalcontent.innerHTML = "";

    const tempcardarr = JSON.parse(localStorage.getItem("cards"));
    const thiscard = tempcardarr.find(card => card.id === parseInt(Parentid, 10));

    // Add title
    let sidebarheading = document.createElement("h1");
    sidebarheading.textContent = thiscard.title || "No Title";
    titledivsidebar.appendChild(sidebarheading);

    // Add tags
    if (Array.isArray(thiscard.tags) && thiscard.tags.length > 0) {
        thiscard.tags.forEach((tag) => {
            const sp = document.createElement("span");
            sp.textContent = tag;
            const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
            sp.style.background = randomGradient;
            tagsdiv.appendChild(sp);
        });
    }

    // Add summary with bullet points
    if (thiscard.summary) {
        const summaryList = document.createElement("ul");
        summaryList.className = "summaryul";
        
        // Highlight keywords in the summary
        let highlightedText = highlightKeywords(thiscard.summary, thiscard.keys || []);
        
        // Split the summary into sentences, remove any empty ones, and trim them
        let sentences = highlightedText.split('.').filter(sentence => sentence.trim() !== "");

        // Create a bullet point for each sentence
        sentences.forEach(sentence => {
            const listItem = document.createElement("li");
            listItem.className = "summaryli";
            listItem.innerHTML = sentence.trim();  // Trim extra spaces
            summaryList.appendChild(listItem);
        });

        summarycontent.appendChild(summaryList);
    } else {
        const emptySummary = document.createElement("p");
        emptySummary.textContent = "No summary available.";
        summarycontent.appendChild(emptySummary);
    }

    // Add original content
    const originalParagraph = document.createElement("p");
    originalParagraph.textContent = thiscard.para || "No content available.";
    orignalcontent.appendChild(originalParagraph);

    contentdiv.appendChild(orignalcontent);
    contentdiv.appendChild(summarycontent);
};


function getOption(selectElement) {
    let option = selectElement.value;
    console.log(option);
    switch (option) {
        case "Delete":
            deleteCard();
            currentCardId=null;
            break;
        case "Quiz":
            hide(); 
            takeQuiz();  
        case "Vis":
            renderVisualMap(currentCardId);
            break;
        default:
            break;    
    }
}

function deleteCard() {
    
    if (!currentCardId) {
        console.error("No card selected to delete.");
        return;
    }

    const tempcards = JSON.parse(localStorage.getItem("cards")) || [];

    const cardIndex = tempcards.findIndex(element => String(element.id,10) === String(currentCardId));

    if (cardIndex === -1) {
        console.error("Card not found.");
        return;
    }

    tempcards.splice(cardIndex, 1);

    localStorage.setItem("cards", JSON.stringify(tempcards));

    location.reload();
}

function hide(){
    let x = document.querySelector(".innersidebar");
    x.classList.add("hidden");
    let y = document.querySelector(".visual");
    y.classList.toggle("hidden");
}


function takeQuiz() {
    const orignalElement = document.querySelector(".orignalcontent p"); 
    if (!orignalElement) {
        console.error("Paragraph inside original content not found");
        return;
    }

    const quizcontent = orignalElement.textContent; 
    if (!quizcontent) {
        console.error("Original content is empty or undefined");
        return;
    }

    const dupli = new Set();
    let quizcontentarr = quizcontent.split(/(\s|(?=[.,]))/).filter(item => item.trim());
    console.log("quizcontentarr  ", quizcontentarr);

    let arrlen = Math.max(Math.floor(quizcontentarr.length / 30), 1);

    // Randomly pick indices and ensure they're sorted
    while (dupli.size < arrlen) {
        const randomIndex = Math.floor(Math.random() * quizcontentarr.length);
        dupli.add(randomIndex);
    }

    // Convert the indices set to a sorted array
    const sortedIndices = Array.from(dupli).sort((a, b) => a - b);

    // Select quiz words in the same order as sorted indices
    const quizwords = sortedIndices.map(index => quizcontentarr[index]);

    console.log("quiz words  ", quizwords);

    // Transform the original content with <input> at the correct indices
    const transformedWords = quizcontentarr.map((word, index) => {
        if (sortedIndices.includes(index)) { // Match index precisely
            return `<input type="text" data-index="${index}" />`;
        }
        return word;
    });

    const transformedString = transformedWords.join(" ");

    const a = document.createElement("p");
    a.innerHTML = transformedString;

    let x = document.querySelector(".quiz .orignalcontent");
    if (x) {
        x.appendChild(a);
    } else {
        console.error("Quiz container not found");
    }

    let y = document.querySelector(".quiz");
    if (y) {
        y.classList.toggle("hidden"); 
    } else {
        console.error("Quiz container not found");
    }

    // Store quizwords and their indices for later validation
    globalquizwords = sortedIndices.map(index => ({
        word: quizcontentarr[index],
        index: index
    }));
}

quizenterbtn.addEventListener("click", () => { 
    let bool=true;
    console.log(globalquizwords);

    let allInput = document.querySelectorAll('input[type="text"]');

    allInput.forEach(input => {
        input.style.border = "1px solid #ccc"; 
    });

    for (let i = 0; i < globalquizwords.length; i++) {
        const input = Array.from(allInput).find(inp => 
            Number(inp.getAttribute("data-index")) === globalquizwords[i].index
        ); 
        const thisword = globalquizwords[i].word;

        if (input) {
            const userInput = input.value.trim().toLowerCase();
            const correctWord = thisword.trim().toLowerCase();

            if (userInput === correctWord) {
              bool=true;
                input.style.border = "1px solid green";  // Correct answer
            } else {
                bool=false;
                input.style.border = "1px solid red";    // Incorrect answer
            }
        }
    }

    if (bool) {
        let canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        let container = document.querySelector('.dropdownsidebardiv');
        container.appendChild(canvas);

        // Create confetti generator and trigger it
        const confettiInstance = confetti.create(canvas, {
            resize: true,
            useWorker: true // Improves performance
        });

        confettiInstance({
            particleCount: 100, // Number of confetti particles
            spread: 60, // Spread angle
            origin: { y: 0.6 } // Confetti starting point
        });

        // Remove canvas after a short delay
        setTimeout(() => {
            container.removeChild(canvas);
        }, 3000); // Adjust delay as needed
    }
});



// Listen for the "Enter" key press on the search bar
searchbar.addEventListener("keydown", function (event) {
    let arr = [];  
    if (event.key === "Enter" && !isEmpty(searchbar.value)) {
        arr = searchforsearchbar(searchbar.value);
        boxes.innerHTML = "";  

        if (arr.length > 0) {
            arr.forEach((card) => {
                createSingleCard(card);  
            });
        } else {
            const noResultsMessage = document.createElement("p");
            noResultsMessage.textContent = "No matching results found.";
            boxes.appendChild(noResultsMessage);  
        }
    }
});





tagstext.addEventListener("keydown", function(event){

    if(event.key=="Enter" && !isEmpty(tagstext.value)){
        var sp = document.createElement("span");
        tagstext.value[0]==="#"? sp.textContent = tagstext.value:sp.textContent = "#"+tagstext.value;
        sp.className = "tagcontainer";
        var div = document.querySelector(".wheretagsgo");
        div.appendChild(sp);
        tagstext.value ="";
    }

});

addNote.addEventListener("click", () =>{
    form.classList.toggle("hidden")
    tagstext.innerHTML="";
});

circles.forEach((circle, index) => {
   
    circle.addEventListener("click", () => {
        forms.style.backgroundColor = colorpick[index];
        colorchosen = index;
        circles.forEach((circle)=>{
            circle.classList.remove("selected");
        });
        circle.classList.add("selected");

        formnotetext.style.backgroundColor = colorpick[index];
        formheadingtext.style.backgroundColor = colorpick[index];
        tagstext.style.backgroundColor = colorpick[index];
    });
});


cancelBtn.addEventListener("click", () =>{
    const containValues = tagstext.value||formheadingtext.value||formnotetext.value;

    if(containValues){
        outererror.classList.toggle("hidden");
        outererror.showModal();
        
    }else{
        form.classList.toggle("hidden")
    }

    summaryoftext = "";
    keywordsofsumary = [];
    origparagraph="";
    pressedonce =false;
});

yesbtn.addEventListener("click",()=>{
    outererror.classList.toggle("hidden");
    form.classList.toggle("hidden");
    clearcontent();
    pressedonce =false;

});

nobtn.addEventListener("click",()=>
    outererror.classList.toggle("hidden")

);

savebtn.addEventListener("click", async () => {
    
    const title = formheadingtext.value.trim();
    const content = formnotetext.value;
    // Error handling for empty fields
    if (!title || !content) {
        savebtn.textContent = "EMPTY FIELDS!";
        formheadingtext.classList.toggle("requiredfield", !title);
        formnotetext.classList.toggle("requiredfield", !content);

        setTimeout(() => {
            savebtn.textContent = "SAVE";
            formheadingtext.classList.remove("requiredfield");
            formnotetext.classList.remove("requiredfield");
        }, 2000);
        return;
    }
    
    // Case 1: If the user selects to summarize
    if (savebtn.textContent === "Summarize") {
        origparagraph = formnotetext.value.trim();

        if(!pressedonce){
        let [su, ke] = await processText(); // Assume this function fetches summary & keywords
        summaryoftext = su || ""; // Use summary if available
        keywordsofsumary = ke || []; // Use keywords if available

        savebtn.textContent = "SAVE"; // Update save button text for next click
        }
    } else {
        if(!pressedonce){        origparagraph = formnotetext.value.trim();        }
        appendObject(origparagraph, summaryoftext, keywordsofsumary); // Save data
    }

    pressedonce = true;
});


multilevel.addEventListener('change', updateDropdownLabel);

function toggleTabs(activeBtn, inactiveBtn, showContent, hideContent) {
    // Add active styles to the clicked button
    activeBtn.classList.add("origandsummarybtnbgadd");
    activeBtn.classList.remove("origandsummarybtnbgremove");

    // Remove active styles from the other button
    inactiveBtn.classList.add("origandsummarybtnbgremove");
    inactiveBtn.classList.remove("origandsummarybtnbgadd");

    // Show the relevant content
    showContent.classList.remove("hidden");

    // Hide the other content
    hideContent.classList.add("hidden");
}

summarybtn.addEventListener("click", () => {
    toggleTabs(summarybtn, orignalbtn, summarycontent, orignalcontent);
});

orignalbtn.addEventListener("click", () => {
    toggleTabs(orignalbtn, summarybtn, orignalcontent, summarycontent);
});

cancelside.addEventListener("click", () => {
    outersidebar.classList.add("hidden");
    const nav = document.querySelector("nav");
    nav.classList.remove("hidden");
    const main = document.querySelector("main");
    main.style.flex = "1";
    main.style.columnGap = "22px";
    currentCardId=null;
});

quizcancel.addEventListener("click", () => {
    outersidebar.classList.add("hidden");
    const nav = document.querySelector("nav");
    nav.classList.remove("hidden");
    const main = document.querySelector("main");
    main.style.flex = "1";
    main.style.columnGap = "22px";
    currentCardId=null;
    let x = document.querySelector("quiz");
    x.classList.add("hidden");

});

selectenter.addEventListener("click", () => {
    const selectElement = document.getElementById("dropdownsidebar");
    getOption(selectElement);
});



function highlightKeywords(text, keywords) {
	let highlightedText = text;
	keywords.forEach(keyword => {
		const regex = new RegExp(`\\b(${keyword})\\b`, 'gi'); // Match whole words
		highlightedText = highlightedText.replace(regex, `<span class="highlight">$1</span>`);
	});
	return highlightedText;
}




filtersearch.addEventListener("change", () => {
    const options = filtersearch.querySelectorAll('option');
            
    options.forEach(option => {
        option.style.color = 'black'; 
    });
    
   filtersearch.style.backgroundImage = "none";

    const option = filtersearch.value;

    let tempCards = JSON.parse(localStorage.getItem("cards")) || [];
    let arr = [];

    if (tempCards.length === 0) {
        // If no cards in localStorage, show a message and return early
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No notes available.";
        boxes.innerHTML = "";
        boxes.appendChild(noResultsMessage);
        return;
    }

    switch (option) {
        case "asc":
            // Sort in ascending order by title
            arr = tempCards.sort((a, b) => {
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
            });
            break;

        case "des":
            // Sort in descending order by title
            arr = tempCards.sort((a, b) => {
                return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
            });
            break;

        case "newest":
            // Sort by ID to get the newest first
            arr = tempCards.sort((a, b) => b.id - a.id); 
            break;

        case "oldest":
            // Sort by ID to get the oldest first
            arr = tempCards.sort((a, b) => a.id - b.id);
            break;

        default:
            // If the filter option is invalid, just use the original order
            arr = tempCards;
            break;
    }

    // Clear existing notes from the DOM
    boxes.innerHTML = "";

    // Create new cards after sorting
    if (arr.length > 0) {
        arr.forEach((card) => {
            createSingleCard(card);  
        });
    } else {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No matching results found.";
        boxes.appendChild(noResultsMessage);
    }
});

async function generateVisualMapData(id) {
    try {
        // Fetch the notes from localStorage
        const notes = JSON.parse(localStorage.getItem("cards")) || [];
        const note = notes.find((card) => String(card.id) === String(id));

        if (!note) {
            console.warn(`No note found for ID: ${id}`);
            return { nodes: [], edges: [] };
        }

        let summary = note.summary;
        if (!summary) {
            console.log("No summary found, generating one...");
            const result = await processText(note.para || ""); // Use `para` or fallback to empty string
            summary = result.summary || "";
            if (!summary) {
                console.error("Failed to generate summary.");
                return { nodes: [], edges: [] };
            }
        }

        // Split summary into sentences and filter empty ones
        const sentences = summary.split(/[.?!]\s+/).filter(Boolean);
        if (sentences.length === 0) {
            console.warn("No sentences generated from summary.");
            return { nodes: [], edges: [] };
        }

        // Create nodes for each sentence
        const nodes = sentences.map((sentence, index) => ({
            id: index,
            label: sentence.trim(),
            title: sentence.trim(),
            value: sentence.length,
            group: note.tags && note.tags[0] ? note.tags[0] : "NoTag",
        }));

        // Create edges connecting sequential sentences
        const edges = sentences.slice(1).map((_, index) => ({
            from: index,
            to: index + 1,
        }));

        console.log("Generated nodes:", nodes);
        console.log("Generated edges:", edges);

        return { nodes, edges };
    } catch (error) {
        console.error("Error in generateVisualMapData:", error);
        return { nodes: [], edges: [] };
    }
}

async function renderVisualMap(id) {
    try {
        // Generate data for the visual map
        const data = await generateVisualMapData(id);

        if (data.nodes.length === 0 && data.edges.length === 0) {
            console.warn("No data to render.");
            return;
        }

        // Select the container for the visualization
        const container = document.getElementById("visualMap");
        if (!container) {
            console.error("No container found with ID 'visualMap'.");
            return;
        }

        // Prepare data for vis.js
        const visData = {
            nodes: new vis.DataSet(data.nodes),
            edges: new vis.DataSet(data.edges),
        };

        // Visualization options
        const options = {
            nodes: {
                shape: "box",
                font: {
                    size: 14,
                    align: "center",
                    multi: true,
                },
                scaling: {
                    label: {
                        enabled: true,
                        min: 14,
                        max: 24,
                    },
                },
            },
            edges: {
                arrows: "to",
                smooth: {
                    type: "cubicBezier",
                    roundness: 0.4,
                },
            },
            physics: {
                enabled: true,
            },
        };

        // Render the visualization
        let x = document.querySelector(".visual");
        x.classList.toggle("hidden");
        
        new vis.Network(container, visData, options);
    } catch (error) {
        console.error("Error in renderVisualMap:", error);
    }
}






// Helper function to generate random colors for groups
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

cancel3.addEventListener("click",()=>{
    let x = document.querySelector(".visual");
    x.classList.toggle("hidden");
})





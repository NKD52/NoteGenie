async function processText() {
	const apiKey = 'DrxJ3ruskXWuMpmF';
	const inputText = document.getElementById('inputText').value;
	// const sentnum = document.getElementById("sentnum").value;
	const multilevel = document.querySelector(".multilevel");
	const radios = multilevel.querySelectorAll('input[name="grp1"]');
	const selectedRadio = Array.from(radios).find(radio => radio.checked);
	const maxsentence = selectedRadio ? selectedRadio.value : '3'; // Default to 6   
	const formnotetext = document.querySelector(".notetext"); 

	if (!inputText) {
		alert('Please enter some text.');
		return;
	}

	// Step 1: Correct Text
	const correctedText = await correctText(inputText, apiKey);
	console.log(correctedText);

	// Step 2: Summarize and Extract Keywords
	const { summary, keywords } = await summarizeAndExtract(correctedText, apiKey,maxsentence);
	console.log("summary",summary);
	console.log("keywords",keywords);
	console.log(inputText);
	

	const summaryString = summary.join(' ');

	formnotetext.value = "";
	formnotetext.value =summaryString;

	// console.log("input text", inputText);
    // console.log("summarystring", summaryString);
    // console.log("keyword", keywords);

    return [summaryString, keywords ];

}

async function processText2(inputText) {
    const apiKey = "DrxJ3ruskXWuMpmF";
    const maxsentence = "5";

    if (!inputText) {
        throw new Error("Input text is empty.");
    }

    // Step 1: Correct Text
    const correctedText = await correctText(inputText, apiKey);

    // Step 2: Summarize and Extract Keywords
    const { summary, keywords } = await summarizeAndExtract(correctedText, apiKey, maxsentence);

    return summary.join(" ")
}


async function correctText(text, apiKey) {
	const url = `https://api.textgears.com/correct?text=${encodeURIComponent(text)}&language=en-GB&key=${apiKey}`;
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);

	if (data.status && data.response && data.response.corrected) {
		return data.response.corrected; // Use the corrected text from the response
	} else {
		console.error("Error in correction API:", data);
		return text; // Fallback to the original text
	}
}

async function summarizeAndExtract(text, apiKey,maxsentence = '6') {
	const sanitizedText = text.replace(/[\r\n\t]+/g, ' ').trim();

	const url = `https://api.textgears.com/summarize?text=${encodeURIComponent(sanitizedText)}&max_sentences=${maxsentence}&language=en-GB&key=${apiKey}`;
 

	const response = await fetch(url);
	try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Error: HTTP ${response.status} ${response.statusText}`);
            return { summary: [], keywords: [] };
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.status === false) {
            console.error(`API Error: ${data.description}`);
            return { summary: [], keywords: [] }; // Return fallback values
        }

        if (data.response) {
            return {
                summary: data.response.summary || [],
                keywords: data.response.keywords || []
            };
        }
    } catch (error) {
        console.error("Network or Fetch Error:", error);
    }

    return { summary: [], keywords: [] }; // Default fallback
}

function highlightKeywords(text, keywords) {
	let highlightedText = text;
	keywords.forEach(keyword => {
		const regex = new RegExp(`\\b(${keyword})\\b`, 'gi'); // Match whole words
		highlightedText = highlightedText.replace(regex, `<span class="highlight">$1</span>`);
	});
	return highlightedText;
}

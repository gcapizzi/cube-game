const mappings = {
	aH: "ɑː",
	AH: "ɑ́ː",
	aJ: "ɑj",
	AJ: "ɑ́j",
	aW: "aw",
	AW: "áw",
	eH: "ɛː",
	EH: "ɛ́ː",
	eJ: "ɛj",
	EJ: "ɛ́j",
	iH: "ɪː",
	IH: "ɪ́ː",
	iJ: "ɪj",
	IJ: "ɪ́j",
	oH: "oː",
	OH: "óː",
	oJ: "oj",
	uH: "ɵː",
	UH: "ɵ́ː",
	uW: "ʉw",
	UW: "ʉ́w",
	yH: "əː",
	YH: "ə́ː",
	yW: "əw",
	YW: "ə́w",
	a: "a",
	A: "á",
	b: "b",
	C: "ʧ",
	d: "d",
	D: "ð",
	e: "ɛ",
	E: "ɛ́",
	f: "f",
	g: "g",
	G: "ʤ",
	h: "h",
	i: "ɪ",
	I: "ɪ́",
	j: "j",
	k: "k",
	l: "l",
	m: "m",
	n: "n",
	N: "ŋ",
	o: "ɔ",
	O: "ɔ́",
	p: "p",
	r: "r",
	s: "s",
	S: "ʃ",
	t: "t",
	T: "θ",
	u: "ɵ",
	v: "v",
	w: "w",
	x: "ə",
	X: "ə́",
	y: "ʌ",
	Y: "ʌ́",
	z: "z",
	Z: "ʒ",
	"-": "",
	" ": "",
};

const sortedMappings = Object.entries(mappings).toSorted((a, b) => b[0].length - a[0].length);

function asciiToIpa(ascii) {
	let ipa = "";
	let i = 0;
	while (i < ascii.length) {
		let found = false;
		for (const [a, p] of sortedMappings) {
			if (ascii.substring(i).startsWith(a)) {
				ipa += p;
				i += a.length;
				found = true;
				break;
			}
		}

		if (!found) {
			throw new Error(`InvalidSyntax: ${ascii.substring(i)}`);
		}
	}

	return ipa;
}

let term = {};
let dict = {};

function init() {
	fetch("dict.json")
		.then((response) => response.json())
		.then((response) => {
			dict = response;
		}).then(() => refresh());
}

function refresh() {
	const words = Object.keys(dict);
	const randomWord = words[Math.floor(Math.random()*words.length)];
	term = dict[randomWord][0];
	document.querySelector("#word").value = term.text
	document.querySelector("#listen").setAttribute("href", term.youglish_link);
	document.querySelector("#guess-ascii").value = "";
	document.querySelector("#guess-ipa").textContent = "";
	document.querySelector("#result-ascii").textContent = "";
	document.querySelector("#result-ipa").textContent = "";
}

document.addEventListener("DOMContentLoaded", init);
document.querySelector("#refresh").addEventListener("click", refresh);

document.querySelector("#guess-ascii").addEventListener("input", (e) => {
	try {
		const ipa = asciiToIpa(e.target.value);
		document.querySelector("#guess-ipa").textContent = ipa;
		if (term.ipa === ipa) {
			document.querySelector("#guess-ipa").style = "color: green";
		} else {
			document.querySelector("#guess-ipa").style = "color: red";
		}
	} catch (e) {
		document.querySelector("#guess-ipa").textContent = e.message;
		document.querySelector("#guess-ipa").style = "color: red";
	}
});

document.querySelector("#guess form").addEventListener("submit", (e) => {
	e.preventDefault();

	document.querySelector("#result-ascii").textContent = term.ascii;
	document.querySelector("#result-ipa").textContent = term.ipa;
});

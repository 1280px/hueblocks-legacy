/* change JS error message to a loading message */
$('#colorPreviewText').html('Loading...');





/* colour picker with gradient preview */
let color1, color2;

function updateColors() {
	color1 = $('#colorSel1').val();
	color2 = $('#colorSel2').val();
	$('#colorPreviewText').html(color1 + '　→　' + color2);
	$('#colorPreview').css({'background': 'linear-gradient(90deg, ' + color1 + ', ' + color2 + ')'});
}

$('#colorSel1,#colorSel2').on('change', () => updateColors());

/* copy colour on right click */
$('#colorBtn1').bind('contextmenu', (cmenu) => {
    cmenu.preventDefault();
	navigator.clipboard.writeText(color1);
	$('#colorPreviewText').html('＊COPIED!＊' + '　→　' + color2);
	setTimeout(() => updateColors(), 500);
});
$('#colorBtn2').bind('contextmenu', (cmenu) => {
    cmenu.preventDefault();
	navigator.clipboard.writeText(color2);
	$('#colorPreviewText').html(color1 + '　→　' + '＊COPIED!＊');
	setTimeout(() => updateColors(), 500);
});





/* random colours */
function rndColors() {
	const hexNums = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];

	let rndColorValues = ['',''];

	/* count values for color1 and color2 at the same time */
	while (rndColorValues[0].length + rndColorValues[1].length < 12) {
		rndColorValues[0] += hexNums[Math.round( Math.random() * 15 )];
		rndColorValues[1] += hexNums[Math.round( Math.random() * 15 )];
	}
	$('#colorSel1').val('#' + rndColorValues[0]);
	$('#colorSel2').val('#' + rndColorValues[1]);

	updateColors();
}

$('#rndColorsBtn').on('click', () => rndColors());





/* swap colours */
function swapColors() {
	let swapColorsTemp = [color1,color2];

	$('#colorSel1').val(swapColorsTemp[1]);
	$('#colorSel2').val(swapColorsTemp[0]);

	updateColors();
}

$('#swapColorsBtn').on('click', () => swapColors());





/* compact HEX <--> RGB converter I found on stackoverflow */
function hexToRgb(h){return['0x'+h[1]+h[2]|0,'0x'+h[3]+h[4]|0,'0x'+h[5]+h[6]|0]}
function rgbToHex(r,g,b){return"#"+((1<<24)+(r<<16)+(g<<8)+ b).toString(16).slice(1);}





/* calculate steps */
let steps = [], stepLen = 5;

/* change cLength back to default value */
function cLengthDefaulter() {
	if ($('#cLength3').is(':checked')) {
		stepLen = 9;
		$('#cLength3').prop("checked", false);
		$('#cLength1').prop("checked", true);
		setTimeout(() => $('#cLengthBtn3').html('Custom...'), 1);
}}

/* make sure "Custom..." cLength btn is never selected at start to prevent errors */
cLengthDefaulter();

/* create a prompt when "Custom..." cLength btn is clicked */
$('#cLength3').on('click', () => {
	($('#cLengthBtn3').html() != "Custom...") ?
		stepLen = prompt('Please enter a custom length (any integer ≥ 3)', parseInt( $('#cLengthBtn3').html().replace("Custom (", "").replace(")", "") ))
		: stepLen = prompt('Please enter a custom length (any integer ≥ 3)', stepLen);

	/* process null */
	if (stepLen == null) cLengthDefaulter();

	/* process amogus */
	if (stepLen == 'amogus' | stepLen == 'sus') {
		alert('OH MY GOD THE CHAIN IS SUS HAHA :D :D LOL AMOGUS MEME SO FUNNY SUS SUS SUSSY LMAO HAHAHAHAHA :DDDDD');
		$("#ggBtn, label, h1, h2, a, em").html("ｓｕｓ");
		cLengthDefaulter();
	}

	/* process normal numbers */
	stepLen = parseInt(stepLen);

	/* process invalid non-numeral input values */
	if (isNaN(stepLen)) {
		alert('Enter a NUMBER you goof >_<');
		cLengthDefaulter();
	}

	/* process invalid numeral input values */
	if (stepLen < 3) {
		alert('The entered number is too small; please enter at least 3.');
		stepLen = 3;
	}
	if (stepLen > 999) {
		let stepLenWarning = confirm('Woah! ' + stepLen + ' is a really big number, are you sure your browser can handle it?\n\nPress "OK" to confirm or "Cancel" to change the number to 999.');
		if (stepLenWarning == false) {
			stepLen = 999;
	}}

	/* display value on cLength button */
	if (Number.isInteger(stepLen) == true) {
		$('#cLengthBtn3').html('Custom (' + stepLen + ')');

		/* handler for values more than 99999 to be displayed correctly */
		if (stepLen > 99999) {
			$('#cLengthBtn3').html('Custom (99999+)');
		}
	}
});

/* update steps */
function updateSteps() {
	console.log('[c] Calculating colours for every step... ');

	/* take steps count from non-custom button (must be at least 3, otherwise just makes no sense) */
	if ($('#cLength1').is(':checked')) stepLen = 9;
	if ($('#cLength2').is(':checked')) stepLen = 25;

	/* wipe previous steps */
	steps = [];

	/* the first step is just color1, no need to count it */
	steps.push(hexToRgb(color1));
	for (let bsCnt = 1; bsCnt < stepLen - 1; bsCnt++) {
		/* math sorcery goes here (daaamn i hate math >_<).
		in a nutshell: since we already know first and last steps, we're starting from the second (1) step and counting until the pre-last one (this is why we're substracting 1 from stepLen).

		since every step in a chain as a sum of color1 and color2 in some proportion (i.e. second step in 9-step-long chain has 87.5% of color1 and 12.5% of color2), we can calculate step X's formula as (color1*(L-X) + color2*X); L is the chain length.

		thus, we multiply first colour on its per-step percentage (i.e. 8-1/8 = 7/8 = 0.875) and add to it the second colour multiplied on its per-step percentage (i.e. 1/8 = 0.125). perform this for Red, Green and Blue values and voila! */
		steps.push([
			( hexToRgb(color1)[0] * (((stepLen - 1) - bsCnt) / (stepLen - 1)) )
			+ ( hexToRgb(color2)[0] * (bsCnt / (stepLen - 1)) ),
			( hexToRgb(color1)[1] * (((stepLen - 1) - bsCnt) / (stepLen - 1)) )
			+ ( hexToRgb(color2)[1] * (bsCnt / (stepLen - 1)) ),
			( hexToRgb(color1)[2] * (((stepLen - 1) - bsCnt) / (stepLen - 1)) )
			+ ( hexToRgb(color2)[2] * (bsCnt / (stepLen - 1)) )
		]);
	}
	/* and the last step is just color2, no need to count it either */
	steps.push(hexToRgb(color2));
}





/* block generation */
let stepLeaders = [], stepCount = 0;

function genBlocks() {
	console.log('[g] Starting blocks gradient generation... ');

	/* wipe all the blocks previously visualised if "optRKeep" is NOT enabled */
	if (! $('#optRKeep').is(':checked')) $( ".visImg" ).remove();

	/* wipe previous step leaders */
	stepLeaders = [];

	/* compare all the blocks from list to a given step */
	for (stepCount = 0; stepCount <= (stepLen - 1); stepCount += 1) {
		let currentStep = steps[stepCount], stepLeaderboard = ["missingNo", 0];

		for (let blockCount = blockData.length -1; blockCount >= 0; ) {
			let currentBlock = blockData[blockCount];

			/* count similarity for Red, Green and Blue */
			var calcR = ( 255 - Math.abs(currentStep[0] - currentBlock.rgb[0]) ) / 255,
				calcG = ( 255 - Math.abs(currentStep[1] - currentBlock.rgb[1]) ) / 255,
				calcB = ( 255 - Math.abs(currentStep[2] - currentBlock.rgb[2]) ) / 255;

			/* 0.0 means 'completely opposite colour', 1.0 means 'same colour';
			values <0.8 in 99% of cases are junk */
			var currentComparison = [currentBlock.id, (calcR + calcG + calcB) / 3];

			blockCount -= 1;

			/* update the "leaderboard" if results are higher than previous */
			if (currentComparison[1] > stepLeaderboard[1]) stepLeaderboard = currentComparison;
		}

	/* write current step leader to a corresponding stepLeaderX variable */
	stepLeaders.push(stepLeaderboard[0]);
	//console.log('[g -- step ' + stepCount + '] AAAND THE WINNER IS "' + stepLeaders[stepCount] + '" !!!');

	/* check for duplicates if "optNodub" is enabled and visualise block */
	if ($('#optNodub').is(':checked') && stepCount > 0)
		{ if (stepLeaders[stepCount] != stepLeaders[stepCount -1]) blockVis(); }
		else blockVis();
	}
	console.log('[v] Blocks gradient visualised.');
}





/* block visualisation */
function blockVis() {
	let stepVis = $('<img class="visImg" onclick="$(this).hide(200);" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">');
	const id = stepLeaders[stepCount];
	const item = blockData.find(i => i.id === id.replace(".png"));
	stepVis.attr('src', item?.imageData ? item.imageData : './data/blocksets/' + blockset + '/' + stepLeaders[stepCount]);
	stepVis.attr('blockname', stepLeaders[stepCount].replace('.png', '').replace(/[-._]/g, ' '));
	stepVis.css({'width': visSize + 'px', 'height': visSize + 'px'});

	stepVis.appendTo('#visResult');
}





/* visualisation upscale/downscale buttons */
let visSize = 64;

$('#visDownscale').on('click', () => { if (visSize > 16) {
	visSize /= 2;
	$('.visImg').css({'width': visSize + 'px', 'height': visSize + 'px'})
}});
$('#visUpscale').on('click', () => { if (visSize < 256) {
	visSize /= 0.5;
	$('.visImg').css({'width': visSize + 'px', 'height': visSize + 'px'})
}});

/* update and show popup when block is hovered */
function showPopup(block) {
	$('#visPopup').html($(block).attr('blockname'));
	$('#visPopup').css('left', block.x + 4).css('top', block.y + 4);
	$('#visPopup').show();
}

/* hide popup when block is not hovered */
function hidePopup() {
	$('#visPopup').html('MissingNo');
	$('#visPopup').hide();
}





/* default values for block types and data */
var blockset = 'blocks';
var blockData = eval('blocks');
var presetsLocation = eval('palettes');

/* palettes importer */
function presetImport() {
	/* wipe previous palettes */
	$("option").remove();

	/* create 'Default (1.21.4 blocks)' option if blockset = blocks */
	if (blockset == 'blocks') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks',
				text: 'Default (1.21.4 blocks)'
		}));
	$('#blocksPresetDD').val('blocks');
	blockData = eval( $('#blocksPresetDD').val() );
	}

	/* create 'Default (1.13.2 PA blocks)' option if blockset = blocks_pa */
	if (blockset == 'blocks_pa') {
		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: 'blocks_pa',
				text: 'Default (1.13.2 PA blocks)'
		}));
	$('#blocksPresetDD').val('blocks_pa');
	blockData = eval( $('#blocksPresetDD').val());
	}

	var presetImporter = 0;

	presetDefaulter();

	while (presetImporter < presetsLocation.length) {

		$('#blocksPresetDD').append(
			$(document.createElement('option')).prop({
				value: presetsLocation[presetImporter]['value'],
				text: presetsLocation[presetImporter]['text']
			}));
		presetImporter += 1;
	}

	/* add 'Custom palette...' option when all palettes are imported */
	$('#blocksPresetDD').append(
		$(document.createElement('option')).prop({
			value: 'customPreset',
			text: 'Custom palette...'
		})
	);
}
presetImport();

/* palette selector */
$('#blocksPresetDD').change( () => {
	if (!$('#blocksPresetDD').val().includes("custom")) {
		console.log(`[p] Changed preset to "${$('#blocksPresetDD').val()}"`);
		blockData = eval( $('#blocksPresetDD').val() );
}});

/* palette defaulter */
function presetDefaulter() {
	blockset == 'blocks_pa' ? $('#blocksPresetDD').val('blocks_pa') : $('#blocksPresetDD').val('blocks');
	blockData = eval( $('#blocksPresetDD').val() );
	if (blockset == 'blocks') presetsLocation = eval('palettes');
	if (blockset == 'blocks_pa') presetsLocation = eval('palettes_pa');
}





/* сustom blocksets (a huge thanks to @NobUwU for implementing this) */
const tempCanvas = document.createElement("canvas");

/* create temp canvas */
const tempContext = tempCanvas.getContext('2d');
//console.log('[b] Temporary context created');

function readFile(file) {
	return new Promise((r,j) => {
		const reader = new FileReader();
		reader.onload = function(e) { r(e) };
		reader.onerror = function(e) { j(e) };
		reader.readAsDataURL(file);
	});
}

let customBlocksetTemp = [], customBlockset = [];
async function onDirectoryChange(d) {
	/**
	 * @type {File[]}
	 */
	const files = Array.from(d.files).filter(i => /(image\/png|image\/jpeg)/.test(i.type) && !i.type.includes("gif"));

	if (!files.length) return;
	else {
		/* wipe current blockset only if at least 1 image was uploaded */
		if ($('#CBCustomBlocks').html() == []) { 
			//console.log('[b] Custom blockset wiped successfully.'); 
			blockData = [], customBlockset = []; 
		}

		async function wait(ms) {
			return new Promise((r) => setTimeout(() => r(), ms));
		}

		for (const file of files) {
			try {
				/* await read file */
				const f = await readFile(file);

				/* use base64 data to create new image */
				const image = new Image();
				image.src = f.target.result;

				/* once image is loaded continue */
				image.onload = function () {
					/* draw image to temporary context */
					tempContext.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

					//await wait(2);

					/* get RGBA of image */
					const rgba = tempContext.getImageData(0, 0, 1, 1).data;
					/* get RGB From RGBA */
					const rgb = [rgba[0], rgba[1], rgba[2]];

					/* append image custom blocks view */
					const img = $(`<img class="CBSelVisImg" src="${f.target.result}" alt="${file.name}"/>`);
					img.css({'width': visSize + 'px', 'height': visSize + 'px'});
					img.appendTo("#CBCustomBlocks");

					/* get name remove extension */
					let name = file.name.split(".");
					name.pop();
					name = name.join(".");
					//console.log('[b] Successfully read file "' + file.name + '"');

					/* push data to customBlockset array */
					customBlockset.push({id: name, rgb, imageData: f.target.result});
				}
			} catch(err) { console.log(`[b] Failed to read file "${file.name}" (error: "${err}")`); }
		}
		console.log(`[b] Generated custom blockset out of ${customBlockset.length + 1} block(s):`, customBlockset);

		/* allow confirm if 1 or more images are loaded;
		we add +1 because check happens before picture appends to list, 
		and the least amount possible to upload is 1 image */
		if (customBlockset.length + 1 >= 3) CBConfirmUpdater(false); 

	}
}

/* custom blocksets button */
$('#CBBtn').on('click', () => {
		//$('#blocksPresetDD').text() = '(unavailable for custom blocksets)';
		$('#CBSelScreen').fadeIn(300);
		$('#CBSelScreenVis').html('');

		CBConfirmUpdater(true);

		const CBInput = $('<div><input type="file" id="CBSelScreenDirectorySelector" onchange="onDirectoryChange(this)" accept="image/png, image/jpeg" multiple/></div>');
		CBInput.appendTo('#CBSelScreenVis');
		const CBBlock = $('<div id="CBCustomBlocks"></div>');
		CBBlock.appendTo('#CBSelScreenVis');
	}
);

/* custom blocksets confirm button */
$('#CBSelScreenConfirm').on('click', () => {
	$('#CBSelScreen').fadeOut(300);

	CBConfirmUpdater(true);

	blockData = customBlockset;
	console.log('[b] Custom blockset applied.')

	/* disable some stuff and add 'inuse' attr to CBBtn */
	$('#blocksPresetDD').prop('disabled', true);
	$('#blocksetSwitcher').prop('disabled', true);
	$('#CBBtn').attr('inuse', true);

	/* use special palette */
	$('#blocksPresetDD').html('');
	$('#blocksPresetDD').append(
		$(document.createElement('option')).prop({
			value: 'customBlockset',
			text: 'unavailable for custom blocksets'
	}));
});

/* custom blockset cancel button */
$('#CBSelScreenClose').on('click', () => {
	blockData = eval( $('#blocksPresetDD').val() );
	CBConfirmUpdater(true);
	$('#CBSelScreen').fadeOut(300);
	customBlockset = [];
});

/* custom blockset confirm button updater */
function CBConfirmUpdater(i) {
	$('#CBSelScreenConfirm').prop('disabled', i);
}

/* custom blockset reverter */
$('#blocksetSwitcherHandler').on('click', () => {
	if ($('#blocksetSwitcher').is(':disabled')) {
		/* re-import and re-default palettes */
		presetImport();
		presetDefaulter();
		customBlockset = [];

		/* enable everything back and remove 'inuse' attr from CBBtn */
		$('#blocksPresetDD').prop('disabled', false);
		$('#CBBtn').removeAttr('inuse');
		$('#blocksetSwitcher').prop('disabled', false);

		/* do not switch blockset selected before */
		return false;
	}
});





/* custom palette's blocks selection screen */
$('#blocksPresetDD').change(() => {
	if ($('#blocksPresetDD').val() == 'customPreset') {
		presetDefaulter();
		CPBlockUpdater();

		$('#CPSelScreen').fadeIn(300);
		$('#CPSelScreenVis').html('');

		/* visualise all the available blocks in alphabetic order */
		let CPselVisLetter = 'ибражы';

		for (let CPSelBlocksVis in blockData) {
			if (CPselVisLetter != blockData[CPSelBlocksVis].id[0]) {

				/* close letter separator */
				if (CPSelBlocksVis != blockData.length -1) {
					CPSelVis = $('</div>');
					CPSelVis.appendTo('#CPSelScreenVis');
				}

				/* create a letter separator */
				CPselVisLetter = blockData[CPSelBlocksVis].id[0];
				var CPSelVis = $('<div class="CPSelVisLetterSeparator" id="CPSelVisLetter' + blockData[CPSelBlocksVis].id[0] + '">');
				CPSelVis.appendTo('#CPSelScreenVis');
			}

			/* create a block selection checkbox */
			var CPSelVis = $('<input type="checkbox" name="' + blockData[CPSelBlocksVis].id + 'Checkbox" class="CPSelVis"]>');
			/* jQuery doesn't work properly with IDs that contains ".", so here's my workaround */
			CPSelVis.attr('id', blockData[CPSelBlocksVis].id.replace('.', '・'));
			CPSelVis.appendTo('#CPSelVisLetter' + blockData[CPSelBlocksVis].id[0]);

			/* create a label for the checkbox */
			var CPSelVis = $('<label for="' + blockData[CPSelBlocksVis].id.replace('.', '・') + '" class="CPSelVisBtn"></label>');
			CPSelVis.appendTo('#CPSelVisLetter' + blockData[CPSelBlocksVis].id[0]);

			/* add an image to the label */
			var CPSelVis2 = $('<img class="CPSelVisImg" id="' + blockData[CPSelBlocksVis].id.replace('.', '・') + 'Img" onclick="CPBlockUpdater(' + "this.getAttribute('blockid'), this.getAttribute('blockrgb')" + ');" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">')

			CPSelVis2.attr('src', './data/blocksets/' + blockset + '/' + blockData[CPSelBlocksVis].id);
			CPSelVis2.attr('blockname', blockData[CPSelBlocksVis].id.replace('.png', '').replace(/\_/g, ' '));
			CPSelVis2.attr('blockid', blockData[CPSelBlocksVis].id);
			CPSelVis2.attr('blockrgb', blockData[CPSelBlocksVis].rgb[0] + '|' + blockData[CPSelBlocksVis].rgb[1] + '|' + blockData[CPSelBlocksVis].rgb[2]);
			CPSelVis2.css({'width': visSize + 'px', 'height': visSize + 'px'});

			CPSelVis2.appendTo(CPSelVis);
}}});

/* check if at least one block is selected (used for confirm button activation/deactivation) */
function CPBlockUpdater() {
	setTimeout( () => {
		$('.CPSelVis:checked').length <= 0
		? $('#CPSelScreenConfirm').prop('disabled', true)
		: $('#CPSelScreenConfirm').prop('disabled', false)
	}, 20);
}



/* selected blocks parser */
function CPBlocksParser() {
	let CPParsedBlocks = [];

	/* get array of all checked blocks */
	let CPSelectedBlocks = $('.CPSelVis:checked'), CPSelectedBlocksPart = [];

	for (let currentCPSelectedBlock = 0; currentCPSelectedBlock <= CPSelectedBlocks.length -1; currentCPSelectedBlock++) {
		/* convert blockrgb and blockid to palette format */
		CPSelectedBlocksPart = {
			id: $('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockid'),
			rgb: [
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[0]),
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[1]),
			parseInt($('#' + CPSelectedBlocks[currentCPSelectedBlock].id + 'Img').attr('blockrgb').split('|')[2])
		]}
	CPParsedBlocks.push(CPSelectedBlocksPart);
	}
	console.log(`[p] Parsed ${CPParsedBlocks.length} block(s) as custom palette array: `, CPParsedBlocks);
	return CPParsedBlocks;
}

/* custom palettes confirm button */
$('#CPSelScreenConfirm').on('click', () => {
	$('#CPSelScreen').fadeOut(300);

	let CPBlocks = CPBlocksParser();

	/* push generated array to the custom palette */
	$('#blocksPresetDD').val('customPreset');
	blockData = CPBlocks;

	console.log(`[p] Custom palette generated, changed to "${$('#blocksPresetDD').val()}"`);
	//console.log('[p]', custom);
});

/* custom palettes cancel button */
$('#CPSelScreenClose').on('click', () => {
	console.log('[p] Custom palette cancelled.');
	$('#CPSelScreen').fadeOut(300);
	CPBlockUpdater();
});





/* blockset switcher */
function blocksetSwitch() {
	if ($('#blocksetSwitcher').is(':checked')) blockset = 'blocks_pa';
	if (! $('#blocksetSwitcher').is(':checked')) blockset = 'blocks';

	presetImport();

	console.log(`[p] Blockset changed to "${blockset}", reverted to "${$('#blocksPresetDD').val()}"`);
};

$('#blocksetSwitcher').on('click', () => blocksetSwitch());





/* BPick screen */
var BPickCSV = 'color1';

function colorBPick(color) {
	$('#BPickScreen').fadeIn(300);
	$('#BPickScreenVis').html('');

	/* store selected colour (color1 or color2) value */
	BPickCSV = color;

	/* visualise all the blocks available  */
	var BPickVisLetter = 'ибражы';

	for (let BPickBlocksVis in blockData) {
		if (BPickVisLetter != blockData[BPickBlocksVis].id[0]) {
			if (BPickBlocksVis != blockData.length -1) {
				BPickVis = $('</div>');
				BPickVis.appendTo('#BPickScreenVis');
			}
			BPickVisLetter = blockData[BPickBlocksVis].id[0];
			var BPickVis = $('<div class="BPickVisLetterSeparator" id="BPickVisLetter' + blockData[BPickBlocksVis].id[0] + '">');
			BPickVis.appendTo('#BPickScreenVis');
		}
		var BPickVis = $('<img class="BPickVisImg" onclick="' + "BPickSelect(this.getAttribute('blockid'));" + '" onmouseover="showPopup(this);" onmouseout="hidePopup(this);">');

		/* add essential attributes */
		BPickVis.attr('src', blockData[BPickBlocksVis].imageData ? blockData[BPickBlocksVis].imageData : './data/blocksets/' + blockset + '/' + blockData[BPickBlocksVis].id);
		BPickVis.attr('blockname', blockData[BPickBlocksVis].id.replace('.png', '').replace(/\_/g, ' '));
		BPickVis.attr('blockid', blockData[BPickBlocksVis].id);

		/* add size controls */
		BPickVis.css({'width': visSize + 'px', 'height': visSize + 'px'});

		BPickVis.appendTo('#BPickVisLetter' + blockData[BPickBlocksVis].id[0]);
}}

$('#colorBPick1').on('click', () => colorBPick('color1'));
$('#colorBPick2').on('click', () => colorBPick('color2'));

/* BPick screen block selection */
function BPickSelect(blockid) {
	var BPickSelectedBlockResult = blockData.filter((bdblock) => bdblock.id == blockid);

	if (BPickCSV == 'color1') $('#colorSel1').val(rgbToHex(BPickSelectedBlockResult[0].rgb[0],BPickSelectedBlockResult[0].rgb[1],BPickSelectedBlockResult[0].rgb[2]));
	if (BPickCSV == 'color2') $('#colorSel2').val(rgbToHex(BPickSelectedBlockResult[0].rgb[0],BPickSelectedBlockResult[0].rgb[1],BPickSelectedBlockResult[0].rgb[2]));

	updateColors();
	$('#BPickScreen').fadeOut(300);
}

/* BPick screen cancel button */
$('#BPickScreenClose').on('click', () => $('#BPickScreen').fadeOut(300) );





/* finally, process GG button */
function genGradient() {
	$('#ggBtn').prop('disabled', true);
	updateSteps();
	genBlocks();
	$('#ggBtn').prop('disabled', false);
}

$('#ggBtn').on('click', () => genGradient());





/* init console message */
console.log('*boop* main script initialized');

/* le final countdown */
$(document).ready(function() {
	/* randomize colours on startup if no cached colours available; otherwise just update colours */
	color1 = $('#colorSel1').val();
	color2 = $('#colorSel2').val();
	(color1 == '#000000', color2 == '#000000') ? rndColors() : updateColors();

	/* enable GG button when the script is ready */
	$("#ggBtn").prop("disabled", false);
})

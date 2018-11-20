function getSRGB(_8bitColor) {
	return _8bitColor / 255;
}

function getRGBForCalculateLuminance(rgb) {
	if (rgb <= 0.03928){
		return rgb / 12.92;
	} else {
		return Math.pow(((rgb + 0.055) / 1.055), 2.4);
	}
}

function getRelativeLuminance(r, g , b) {
	let R = getRGBForCalculateLuminance(getSRGB(r));
	let G = getRGBForCalculateLuminance(getSRGB(g));
	let B = getRGBForCalculateLuminance(getSRGB(b));
	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function getContrast(l1, l2) {
	let bright = (l1 > l2) ? l1 : l2; // 明るい方の相対輝度
	let dark   = (l1 < l2) ? l1 : l2; // 暗い方の相対輝度
	return (bright + 0.05) / (dark + 0.05);
}

function hex2rgb ( hex ) {
	if ( hex.slice(0, 1) == "#" ) hex = hex.slice(1) ;
	if ( hex.length == 3 ) hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3) ;

	return [ hex.slice( 0, 2 ), hex.slice( 2, 4 ), hex.slice( 4, 6 ) ].map( function ( str ) {
		return parseInt( str, 16 ) ;
	} ) ;
}

function calc(){
	let R = document.forms.calcContrastForm.r.value;
	let G = document.forms.calcContrastForm.g.value;
	let B = document.forms.calcContrastForm.b.value;
	let Hex = hex2rgb(document.forms.calcContrastForm.hex.value);
	console.log(Hex);
	let Hex_R = Hex[0];
	let Hex_G = Hex[1];
	let Hex_B = Hex[2];
	let luminance_Hex = getRelativeLuminance(Hex_R,Hex_G,Hex_B);
	let luminance_RGB = getRelativeLuminance(R,G,B);
	console.log(luminance_Hex);

	var result_hex = document.getElementById("result_hex"); 
	result_hex.innerHTML = luminance_Hex;

	var result_rgb = document.getElementById("result_rgb"); 
	result_rgb.innerHTML = luminance_RGB;

}


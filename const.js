function RandomWholeNumberRange(min, max)
{
    return Math.round(Math.random() * (max - min) + min);
}

function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}

let TILE_SIZE = 50;
let VIEW_DISTANCE = 44;

let WATER_COLOR = "#156c99";
let SAND_COLOR = "#e5cc82";
let GRASS_COLOR = "#7a9e38";
let DIRT_COLOR = "#a06439";
let STONE_COLOR = "#8b8d91";
let DARKWATER_COLOR = "#427d96";
let CARPET_COLOR = "#d33b23";
let SNOW_COLOR = "#dce6e7";

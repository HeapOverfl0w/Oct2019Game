let cvs = undefined;
let ctx = undefined;
let world = undefined;
let player = undefined;

window.onload = function(){
    cvs = document.getElementById("scene");
    ctx = cvs.getContext("2d");

    //document.addEventListener("keydown", KeyDown);
    //cvs.addEventListener("mouseup", MouseClick);
    StartGame();
}

function StartGame()
{
    world = new World(undefined, ctx);
    player = new Player(50, 50);
    while ( !world[player.positionX][player.positionY].pass )
    {
        player.positionX = RandomWholeNumberRange(11, map.length - 11);
        player.positionY = RandomWholeNumberRange(11, map[0].length - 11);
    }
    GameLoop();
    //UpdateLoop();
}

function GameLoop()
{
    setTimeout(Game, 1000/15);
}

function Game()
{
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    world.Draw(playerX - VIEW_DISTANCE / 2, playerY - VIEW_DISTANCE / 2, VIEW_DISTANCE);
}
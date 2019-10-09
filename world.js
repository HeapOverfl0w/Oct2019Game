class World
{
    constructor(map, ctx2d)
    {
        this.ctx = ctx2d;
        if (!map)
         this.Randomize();
    }

    Randomize()
    {
        let islandsCount = RandomWholeNumberRange(50, 80);
        this.mapSizeX = RandomWholeNumberRange(800, 1200);
        this.mapSizeY = RandomWholeNumberRange(800, 1200);
        let islandCreationsStarts = [];
        //Find starting areas and size of islands, evenly disperse them
        for (let i = 0; i < islandsCount; i++)
        {
            islandCreationsStarts.push({
                x : RandomWholeNumberRange(10, mapSizeX-10),
                y : RandomWholeNumberRange(10, mapSizeY-10),
                width : RandomWholeNumberRange(20, 80),
                height : RandomWholeNumberRange(20, 80),
            });
        }

        let forestCount = RandomWholeNumberRange(10, 20);
        let snowPlains = [];
        let forests = [];
        
        for (let f = 0; f < forestCount; f++)
        {
            snowPlains.push({
                x : RandomWholeNumberRange(1, mapSizeX-1),
                y : RandomWholeNumberRange(1, mapSizeY-1),
                radius : RandomWholeNumberRange(30, 120)
            })
            forests.push({
                x : RandomWholeNumberRange(1, mapSizeX-1),
                y : RandomWholeNumberRange(1, mapSizeY-1),
                radius : RandomWholeNumberRange(30, 120)
            })
        }

        let world = [];
        let worldActorMap = [];
        //create and fill map with grass
        for (let tX = 0; tX < mapSizeX; tX++)
        {
            world.push([]);
            worldActorMap.push([]);
            for (let tY = 0; tY < mapSizeY; tY++)
            {
                world[tX].push({color: GRASS_COLOR, pass: true, lum : RandomWholeNumberRange(-2, 2) * 0.1});
                for (let f = 0; f < forestCount; f++)
                {
                    if (InCircle(forests[f].radius, forests[f].x, forests[f].y, tX, tY) && Math.random() > 0.5)
                        world[tX][tY].item = "tree";
                    if (InCircle(snowPlains[f].radius, snowPlains[f].x, snowPlains[f].y, tX, tY))
                        world[tX][tY].color = SNOW_COLOR;
                }
                worldActorMap[tX].push(undefined);
            }
        }

        //add in islands line by line
        for (let i = 0; i < islandsCount; i++)
        {
            let islandEndY = islandCreationsStarts[i].y + islandCreationsStarts[i].height;
            for (let tY = islandCreationsStarts[i].y; tY < islandEndY; tY++)
            {
                let islandLength = islandEndY - islandCreationsStarts[i].y;
                let halfIslandLength =  islandLength / 2;
                let islandCenterY = islandCreationsStarts[i].y + halfIslandLength;
                let islandSliceWidth = Math.ceil(islandCreationsStarts[i].width * (tY > islandCenterY ? ((islandEndY - tY + 1)/halfIslandLength) : ((tY + 1 - islandCreationsStarts[i].y)/halfIslandLength)));
                let islandSliceStartDiff = RandomWholeNumberRange(-3, 3);
                let tXStart = islandCreationsStarts[i].x + islandSliceStartDiff;
                let tXStart = tXStart > 0 ? tXStart : 0;
                for (tX = tXStart; tX < (tXStart + islandSliceWidth); tX++)
                {
                    if (tX < mapSizeX && tY < mapSizeY)
                        world[tX][tY] = {color: WATER_COLOR, item: undefined, pass: false};
                }
            }
        }

        let townCount = RandomWholeNumberRange(4, 7);
        for (let t = 0; t < townCount; t++)
        {
            towns.push(CreateTown(towns, world));
            if (t > 0)
            {
                this.CreateConnector(towns[t-1].x, towns[t-1].y, towns[t].x, towns[t].y, DIRT_COLOR, world);
            }
        }


        //Replace sand with green if sand is not surrounded by water
        for (let tX = 0; tX < mapSizeX; tX++)
        {
            for (let tY = 0; tY < mapSizeY; tY++)
            {
                //If surrounding areas are inside the bounds of the map
                if (tX > 30 && tY > 30 &&
                    tY < mapSizeY - 30 && tX < mapSizeX - 30)
                {
                    if ((world[tX - 1][tY - 1].color == WATER_COLOR ||
                        world[tX][tY - 1].color == WATER_COLOR ||
                        world[tX + 1][tY - 1].color == WATER_COLOR ||
                        world[tX - 1][tY].color == WATER_COLOR ||
                        world[tX + 1][tY].color == WATER_COLOR ||
                        world[tX - 1][tY + 1].color == WATER_COLOR ||
                        world[tX][tY + 1].color == WATER_COLOR ||
                        world[tX + 1][tY - 1].color == WATER_COLOR) &&
                        (world[tX - 1][tY - 1].color == GRASS_COLOR ||
                        world[tX][tY - 1].color == GRASS_COLOR ||
                        world[tX + 1][tY - 1].color == GRASS_COLOR ||
                        world[tX - 1][tY].color == GRASS_COLOR ||
                        world[tX + 1][tY].color == GRASS_COLOR ||
                        world[tX - 1][tY + 1].color == GRASS_COLOR ||
                        world[tX][tY + 1].color == GRASS_COLOR ||
                        world[tX + 1][tY - 1].color == GRASS_COLOR))
                        {
                            world[tX][tY].color = SAND_COLOR;
                        }
                    else if (world[tX][tY].color == GRASS_COLOR)
                    {
                        let randomStaticObject = Math.random();
                        if (randomStaticObject < 0.01)
                            world[tX][tY].item = "rock";
                        else if (randomStaticObject > 0.98)
                            world[tX][tY].item = "tree";
                    }
                    else if (world[tX][tY].color == SNOW_COLOR)
                    {
                        let randomStaticObject = Math.random();
                        if (randomStaticObject < 0.01)
                            world[tX][tY].item = "snowrock";
                        else if (randomStaticObject > 0.98)
                            world[tX][tY].item = "snowtree";
                    }
                }
                else
                    world[tX][tY] = {color: WATER_COLOR, item: undefined, pass: false};
            }
        }
        

        this.actorMap = worldActorMap;
        this.actors = worldActors;
        this.map = world;
    }

    CreateConnector(startX, startY, endX, endY, tileColor, world)
    {
        let currentX = startX;
        let currentY = startY;

        while(currentX != endX && currentY != endY)
        {
            let xStartSearch = currentX - 1 < 0 ? 0 : currentX - 1;
            let yStartSearch = currentY - 1 < 0 ? 0 : currentY - 1;
            let xEndSearch = currentX + 1 > map.length ? map.length - 1 : currentX + 1;
            let yEndSearch = currentY + 1 > map[0].length ? map[0].length : currentY + 1;
            let minDistance = {x : xStartSearch, 
                        y : yStartSearch, 
                        distance : DistanceFormula(xStartSearch, yStartSearch, endX, endY)};
            for(let tX = xStartSearch; tX <= xEndSearch; tX++ )
            {
                for(let tY = yStartSearch; tY <= yEndSearch; tY++)
                {
                    if (map[tX][tY] === undefined || map[tX][tY].color != CARPET_COLOR)
                        map[tX][tY] = {color : tileColor, item : undefined, pass: true, lum: RandomWholeNumberRange(-2,2) * 0.1};
                    if ((tX == currentX && tY != currentY) || (tX != currentX && tY == currentY))
                    {
                        let currentDistance = DistanceFormula(tX, tY, endX, endY);
                        if (currentDistance < minDistance.distance)
                            minDistance = {x : tX, y : tY, distance : currentDistance};
                    }
                }
            }
            currentX = minDistance.x;
            currentY = minDistance.y;            
        }
    }

    CreateTown(otherTowns, world)
    {
        let housesCount = RandomWholeNumberRange(5, 10);
        let locX = RandomWholeNumberRange(31, world.length - 111);
        let locY = RandomWholeNumberRange(31, world[0].length - 111);
        let endX = 0;
        let endY = 0;
        let houses = [];
        let intersectsAnotherTown = true;
        while(intersectsAnotherTown)
        {
            intersectsAnotherTown = false;
            for (let ot = 0; ot < otherTowns.length; ot++)
            {
                if (IntersectRect(locX, locY, locX + 80, locY + 80, ot.x, ot.y, ot.endX, ot.endY))
                {
                    intersectsAnotherTown = true;
                    locX = RandomWholeNumberRange(31, world.length - 181);
                    locY = RandomWholeNumberRange(31, world[0].length - 181);
                }
            }
        }
        for (let h = 0; h < housesCount; h++)
        {
            let intersectsAnotherHouse = true;
            let house = {};
            while(intersectsAnotherHouse)
            {
                intersectsAnotherHouse = false;
                house = {
                    x : RandomWholeNumberRange(locX, locX + 80),
                    y : RandomWholeNumberRange(locY, locY + 80),
                    width : RandomWholeNumberRange(5, 20),
                    height : RandomWholeNumberRange(5, 20)
                };
                for (let i = 0; i < houses.length; i++)
                {
                    if (IntersectRect(house.x, house.y, house.x+house.width, house.y+house.height,
                                      houses[i].x, houses[i].y, houses[i].x+houses[i].width, houses[i].y+houses[i].height))
                    {
                        intersectsAnotherHouse = true;
                        break;
                    }
                }
            }
            houses.push(house);
            if (house.width + house.x > endX)
                endX = house.width + house.x;
            if (house.height + house.y > endY)
                endY = house.height + house.y;

            house.doorX = RandomWholeNumberRange(0, 1) * house.width;
            house.doorY = RandomWholeNumberRange(house.y+1, house.y + house.height -1);
        }

        for (let x = locX; x <= endX; x++)
        {
            for (let y = locY; y <= endY; y++)
            {
                world[x][y] = {color : Math.random() > 0.5 ? GRASS_COLOR : DIRT_COLOR, pass : true, item : undefined, lum : RandomWholeNumberRange(-2, 2) * 0.1};
                for (let h = 0; h < houses.length; h++)
                {
                    if (x > houses[h].x && y > houses[h].y &&
                        x < houses[h].x + houses[h].width &&
                        y < houses[h].y + houses[h].height)
                        world[x][y] = {color : CARPET_COLOR, pass : true, item : undefined};
                    else if ((x == houses[h].x || y == houses[h].y ||
                             x == houses[h].x + houses[h].width || y == houses[h].y + houses[h].height) && 
                             x != houses[h].doorX && y != houses[h].doorY && (
                            x >= houses[h].x && y >= houses[h].y &&
                            x <= houses[h].x + houses[h].width &&
                            y <= houses[h].y + houses[h].height))
                        world[x][y] = {color : CARPET_COLOR, pass : false, item : "wall"};
                    else if (x == houses[h].doorX || y == houses[h].doorY && (
                            x >= houses[h].x && y >= houses[h].y &&
                            x <= houses[h].x + houses[h].width &&
                            y <= houses[h].y + houses[h].height))
                        world[x][y] = {color : CARPET_COLOR, pass : true, item : "door"};
                }
            }
        }

        return { x: locX, y: locY, endX: endX, endY: endY };
    }

    Draw(cameraX, cameraY, viewDistance)
    {
        for (let x = cameraX; x < cameraX + viewDistance; x++)
        {
            for (let y = cameraY; y < cameraY + viewDistance; y++)
            {
                if (x < world.length && x >= 0 &&
                    y < world[0].length && y >= 0)
                {
                    if (world[x][y] !== undefined)
                        this.DrawTile(((x - cameraX) - (y - cameraY)) * TILE_SIZE/2 + cvs.width / 2, 
                                ((x-cameraX) + (y-cameraY)) * TILE_SIZE/4 - cvs.height/2, world[x][y], 
                                0, false);

                    //if (targetActor !== undefined && targetActor.x == x && targetActor.y == y)
                    //    DrawSelectionTile(((targetActor.x - cameraX) - (targetActor.y-cameraY)) * TILE_SIZE/2 + cvs.width / 2, ((targetActor.x-cameraX) + (targetActor.y-cameraY)) * TILE_SIZE/4 - cvs.height/2, targetActor);

                    //if (playerX == x && playerY == y )
                    //    DrawImage(((playerX - cameraX) - (playerY-cameraY)) * TILE_SIZE/2 + cvs.width / 2, ((playerX-cameraX) + (playerY-cameraY)) * TILE_SIZE/4 - cvs.height/2, "player");

                    if (actorMap[x][y] !== undefined)
                        this.DrawImage(((x - cameraX) - (y - cameraY)) * TILE_SIZE/2 + cvs.width / 2, 
                                ((x-cameraX) + (y-cameraY)) * TILE_SIZE/4 - cvs.height/2, actorMap[x][y].npc.name);

                    //DrawScreenText(x, y);
                }
            }
        }
    }

    DrawImage(x, y, imageDocId)
    {
        let image = document.getElementById(imageDocId);
        let adjustedX = x - image.width / 2;
        let adjustedY = y - (image.height - Math.ceil(tileSize/2));
        ctx.drawImage(image, adjustedX, adjustedY);
    }

    DrawTile(x, y, tile, illumModifier, drawGrid)
    {
        let tileSideLength = TILE_SIZE/2;
        if (tile.lum !== undefined)
            this.ctx.fillStyle = ColorLuminance(tile.color, tile.lum + illumModifier);
        else
            this.ctx.fillStyle = tile.color;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        let point2LineSlopeY = Math.sin(1/6 * Math.PI);
        let point2LineSlopeX = Math.cos(1/6 * Math.PI);
        this.ctx.lineTo(x + point2LineSlopeX * tileSideLength + 4, y + point2LineSlopeY * tileSideLength);
        this.ctx.lineTo(x, y + TILE_SIZE/2);
        let point4LineSlopeY = Math.sin(5/6 * Math.PI);
        let point4LineSlopeX = Math.cos(5/6 * Math.PI);
        this.ctx.lineTo(x + point4LineSlopeX * tileSideLength - 4, y + point4LineSlopeY * tileSideLength);
        this.ctx.closePath();
        this.ctx.fill();
        
        if (drawGrid && tile.pass)
        {
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + point2LineSlopeX * tileSideLength + 4, y + point2LineSlopeY * tileSideLength);
            this.ctx.lineTo(x, y + TILE_SIZE/2);
            this.ctx.lineTo(x + point4LineSlopeX * tileSideLength - 4, y + point4LineSlopeY * tileSideLength);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        if (tile.item !== undefined)
        {
            let image = document.getElementById(tile.item);
            let adjustedX = x - image.width / 2;
            let adjustedY = y - (image.height - Math.ceil(TILE_SIZE/2));
            this.ctx.drawImage(image, adjustedX, adjustedY);
        }
    }
}
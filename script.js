
let app = document.getElementById('app');
let gameScreen = document.getElementById('gameScreen');

let worldBackground;
let battleBackground;

let adventureText;
let onHoverText = "";

//Player stats
let playerClass;
let playerName;
let playerLevel = 1;
let playerHealth;
let playerMaxHealth;
let playerEnergy;
let playerMaxEnergy;
let playerDamage;
let playerMinDamage;
let playerMaxDamage;
let playerXP = 0;
let playerNextLevelXP = 27;
let excessXP;
let playerAbilities = "";

//Enemy stats
let enemyName;
let enemyLevel = 1;
let enemyHealth;
let enemyMaxHealth;
let enemyDamage;
let enemyMinDamage;
let enemyMaxDamage;
let enemyGold = 0;
let yieldXP;

//inventory
let playerGold = 70;
let stolenGoldAmount;

let hasApple1 = true;
let hasApple2 = false;
let hasApple3 = false;
let hasPotion = true;
let hasFishingRod = false;
let hasDesertRose = false;
let hasCopperKey = false;
let hasSilverKey = false;
let inventoryGoat;

let hasGoat1 = false;
let hasGoat2 = false;
let hasGoat3 = false;

let copperKeyUsed = false;
let silverKeyUsed = false;
let returnedGoat1 = false;
let returnedGoat2 = false;
let returnedGoat3 = false;

// Game states
let isGameRunning = false;
let inBattle = false;
let abilityWindow = false;
let playerAlive = true;

let areaHasWorldItem;
let worldItem;
let currentDialogue = 0;

let areaHasRandomEncounters = false;
let encounterChance;

let canGoUp;
let canGoLeft;
let canGoRight;
let canGoDown;

// Location variables
let mapLocationY;
let mapLocationX;

let inGrasslands = false;
let inForest = false;
let inDesert = false;
let inCave = false;
let inOasis = false;
let inMainCampsite = false;
let inCampsite = false;
let inShopWest = false;
let inShopEast = false;
let inGoatArea1 = false;
let inGoatArea2 = false;
let inGoatArea3 = false;
let inFishableArea = false;
let inFrontOfCopperDoor = false;
let inFrontOfSilverDoor = false;

let doorUnlocked = false;

// Combat states
let actionMenuCooldown = false;
let enemyStunned = false;
let stunCounter;
let searchBackpackAttempt;
let runAwayAttempt;
let psychedUp = false;
let stealChance;
let hasStolen = false;

//Required energy for ability
let searchBackpack = {
    requiredEnergy: 5,
    requiredLevel: 1,
}
let runAway = {
    requiredEnergy: 5,
    requiredLevel: 3,
}
let patchUp = {
    requiredEnergy: 5,
    requiredLevel: 5,
}
let guard = {
    requiredEnergy: 0,
    requiredLevel: 1,
}
let shieldSlam = {
    requiredEnergy: 10,
    requiredLevel: 3,
}
let mendWounds = {
    requiredEnergy: 15,
    requiredLevel: 5,
}
let steal = {
    requiredEnergy: 0,
    requiredLevel: 1,
}
let stabbyStab = {
    requiredEnergy: 10,
    requiredLevel: 3,
}
let vanish = {
    requiredEnergy: 5,
    requiredLevel: 5,
}
let chill = {
    requiredEnergy: 5,
    requiredLevel: 1,
}
let fireball = {
    requiredEnergy: 10,
    requiredLevel: 3,
}
let soothingWinds = {
    requiredEnergy: 20,
    requiredLevel: 5,
}

// Player states
let playerMale = true;
let goingLeft = false;
let passedOut = false;
let playerCombatSprite;

let lostInDesertNorth = false;
let lostInDesertSouth = false;
let lostInDesertEast = false;
let lostInDesertWest = false;

let nextStepOasis = false;

//UI
let buttonDisabled = false;
let healthBarColor = "lightgreen";
let energyBarColor = "lightgreen";
let enemyHealthBarColor = "lightgreen";

let adventurerSelected = true;
let warriorSelected = false;
let rogueSelected = false;
let mageSelected = false;

let muted = false;
let currentMusic;

//Music
let bgm_grasslands = new Audio("sfx/grasslands.ogg")
let bgm_forest = new Audio("sfx/forest.ogg")
let bgm_desert = new Audio("sfx/desert.ogg")
let bgm_cave = new Audio("sfx/cave.ogg")
let fadeInInterval;
let fadeOutInterval
bgm_grasslands.volume = 0.0001;
bgm_forest.volume = 0.0001;
bgm_desert.volume = 0.0001;
bgm_cave.volume = 0.0001;

//SFX
let coinsAudio = new Audio("sfx/Coins.mp3")
let unlockAudio = new Audio("sfx/Unlock.mp3")
let eatAudio = new Audio("sfx/Eat.mp3")
let drinkAudio = new Audio("sfx/Drink.mp3")
let goatAudio = new Audio("sfx/Goat.mp3")
let pickUpAudio = new Audio("sfx/Pickup.mp3")
let fishingAudio = new Audio("sfx/Fishing.mp3")

BGM('startScreen');
setUpCharacter();
setClass("adventurer");
setUpArea();
updateView();
function updateView() {

    app.innerHTML = isGameRunning ? /*HTML*/ `
    <div class="gameScreen" ${inBattle ? battleBackground : worldBackground}>

        ${inBattle ? /*HTML*/`       
        <div class="topBattleDiv">
        </div>
        <div class="middleBattleDiv">
            <img class="playerInCombat" src=${playerAlive ? playerCombatSprite : (playerMale ? "imgs/Character_Male_dead.png" : "imgs/Character_Female_dead.png")}>
            <img class="enemyInCombat" src=${enemySprite}>
        </div>
        <div class="bottomBattleDiv">
        </div> 
        <div class="adventureText">${adventureText}</div>
    </div>
        <div class="worldInfo_container">
            <div class="playerInfo">${playerName ?? "Dio"}
                <div>${playerClass ?? "Adventurer"} (Lv. ${playerLevel})</div>
                <div style="color:${healthBarColor}">Health: ${playerHealth + " / " + playerMaxHealth}</div>
                <div class="statusBarsBackground">
                <div class="statusBarsFront" style="width: ${(playerHealth / playerMaxHealth) * 100}%; background-color: ${healthBarColor};"></div>
                </div>
                <div style="color:${energyBarColor}">Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
                <div class="statusBarsBackground">
                <div class="statusBarsFront" style="width: ${(playerEnergy / playerMaxEnergy) * 100}%; background-color: ${energyBarColor};"></div>
                </div>
                <div style="color: rgb(85, 189, 175)">XP: ${playerXP + " / " + playerNextLevelXP}</div>
                <div class="statusBarsBackground">
                <div class="statusBarsFront" style="width: ${(playerXP / playerNextLevelXP) * 100}%; background-color: rgb(85, 189, 175);"></div>
                </div>
            </div>
            <div class="battleActionsContainer">            
            
                ${playerAlive ? /*HTML*/ `${actionMenuCooldown ? /*HTML*/ ``
                : /*HTML*/ `
                <div class="battleActions">
                <button class="attackButton" 
                onmouseenter="onHoverTooltip('attack')"
                onmouseleave="clearTooltip()" 
                ${!abilityWindow ? 'onclick="attack()"' : 'disabled, style="pointer-events: none; opacity: 0.5"'}>Attack</button>
                <button class="abilityButton"
                onmouseenter="onHoverTooltip('ability')"
                onmouseleave="clearTooltip()"
                ${inBattle ? 'onclick="ability()"' : 'disabled, style="opacity: 0"'}>${!abilityWindow ? 'Ability' : '<<'}</button>
                <button class="fleeButton" 
                onmouseenter="onHoverTooltip('flee')" 
                onmouseleave="clearTooltip()" 
                ${!abilityWindow ? 'onclick="flee()"' : 'disabled, style="pointer-events: none; opacity: 0.5"'}>Flee</button>
                </div>
                <div class="battleActions">
                ${abilityWindow ? playerAbilities : ''}
                </div>
            
                `}`
                : /*HTML*/ `<div class="battleActions">
                <button class="fleeButton"
                onmouseenter="onHoverTooltip('restart')" 
                onmouseleave="clearTooltip()" 
                ${!playerAlive ? 'onclick="restartGame()"' : 'disabled, style="opacity: 0"'}>Restart</button></div>`}
                
            </div>
        <div class="onHoverText">${onHoverText}</div>

        <div class="enemyInfo">${enemyName.charAt(0).toUpperCase() + enemyName.slice(1) ?? "???"}
        <div style="${playerLevel < enemyLevel ? 'color: red' : 'color: lightgreen'}">Enemy (Lv. ${enemyLevel})</div>  
        <div style="color:${enemyHealthBarColor}">Health: ${enemyHealth + " / " + enemyMaxHealth}</div>
        <div class="statusBarsBackground">
        <div class="statusBarsFront" style="width: ${(enemyHealth / enemyMaxHealth) * 100}%; background-color: ${enemyHealthBarColor};"></div>
        </div>               
    </div>
    </div>
    <button class="leftButton" onclick="muteAudio(), updateView()">Mute</button>
    `

            // NOT IN BATTLE:

            : /*HTML*/`       
        <div class="UpDiv">
            <button class="upButton" ${canGoUp ? 'onclick="moveCharacter(\'north\')"' : 'disabled'} style="${canGoUp ? '' : 'pointer-events: none; opacity: 0;'}">🡹</button>
        </div>
        <div class="LeftRightDiv">
            <button class="leftButton" ${canGoLeft ? 'onclick="moveCharacter(\'west\')"' : 'disabled'} style="${canGoLeft ? '' : 'pointer-events: none; opacity: 0;'}">🡸</button>
            <div class="playerContainer">
                <img class="player" src="${passedOut ? (playerMale ? "imgs/Character_Sleep.png" : "imgs/Character_Sleep_Female.png") : playerStates()}">
                ${areaHasWorldItem ? /*HTML*/`<img class="worldItem" src="${worldItem}">` : ``}
                ${inShopWest || inShopEast ? /*HTML*/`<img class="worldItem" src="imgs/world_items/NPC.png">` : ``}
                ${returnedGoat1 && inMainCampsite ? /*HTML*/`<img class="worldItem" src="imgs/world_items/Goat1_WorldItem.png">` : ``}
                ${returnedGoat2 && inMainCampsite ? /*HTML*/`<img class="worldItem" src="imgs/world_items/Goat2_WorldItem.png">` : ``}
                ${returnedGoat3 && inMainCampsite ? /*HTML*/`<img class="worldItem" src="imgs/world_items/Goat3_WorldItem.png">` : ``}
                </div>
                <button class="rightButton" ${canGoRight ? 'onclick="moveCharacter(\'east\')"' : 'disabled'} style="${canGoRight ? '' : 'pointer-events: none; opacity: 0;'}">🡺</button>
        </div>
        <div class="DownDiv">
            <button class="downButton" ${canGoDown ? 'onclick="moveCharacter(\'south\')"' : 'disabled'} style="${canGoDown ? '' : 'pointer-events: none; opacity: 0;'}">🡻</button>
        </div> 
        <div class="adventureText">${adventureText}</div>
    </div>
    <div class="worldInfo_container">
        <div class="playerInfo">${playerName ?? "Dio"}
            <div>${playerClass ?? "Adventurer"} (Lv. ${playerLevel})</div>
            <div style="color:${healthBarColor}">Health: ${playerHealth + " / " + playerMaxHealth}</div>
            <div class="statusBarsBackground">
            <div class="statusBarsFront" style="width: ${(playerHealth / playerMaxHealth) * 100}%; background-color: ${healthBarColor};"></div>
            </div>
            <div style="color:${energyBarColor}">Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>
            <div class="statusBarsBackground">
            <div class="statusBarsFront" style="width: ${(playerEnergy / playerMaxEnergy) * 100}%; background-color: ${energyBarColor};"></div>
            </div>
            <div style="color: rgb(85, 189, 175)">XP: ${playerXP + " / " + playerNextLevelXP}</div>
            <div class="statusBarsBackground">
            <div class="statusBarsFront" style="width: ${(playerXP / playerNextLevelXP) * 100}%; background-color: rgb(85, 189, 175);"></div>
            </div>
        </div>   
            <div class="worldActions">
                
                ${inCampsite ?
                /*HTML*/`<button
                ${inCampsite ? 'onclick="rest()"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('rest')}"
                onmouseleave="if(onHoverText == 'Rest in your tent?') {clearTooltip()}">Rest</button> 
                ` :
                    /*HTML*/``}

                ${inShopWest ?
                    /*HTML*/`<button
                ${inShopWest ? 'onclick="talkToNPC(\'shopWestNPC\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('talk')}"
                onmouseleave="if(onHoverText == 'Talk with shopkeeper?') {clearTooltip()}">Talk</button> 
                ` :
                    /*HTML*/``}

                ${inShopWest ?
                    /*HTML*/`<button
                ${inShopWest ? 'onclick="buyItem(\'apple\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('buyApple')}"
                onmouseleave="if(onHoverText == 'Buy an apple? (12 gold)') {clearTooltip()}">Buy apple</button>
                <button
                ${inShopWest ? 'onclick="buyItem(\'potion\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('buyPotion')}"
                onmouseleave="if(onHoverText == 'Buy a potion? (50 gold)') {clearTooltip()}">Buy potion</button>  
                
                ` :
                    /*HTML*/``}

                ${inShopEast ?
                    /*HTML*/`<button
                ${inShopEast ? 'onclick="talkToNPC(\'shopEastNPC\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('talk')}"
                onmouseleave="if(onHoverText == 'Talk with shopkeeper?') {clearTooltip()}">Talk</button> 
                ` :
                    /*HTML*/``}

                ${inShopEast ?
                    /*HTML*/`<button
                ${inShopEast ? 'onclick="buyItem(\'apple\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('buyApple')}"
                onmouseleave="if(onHoverText == 'Buy apple? (12 gold)') {clearTooltip()}">Buy apple</button> 
                ` :
                    /*HTML*/``}
                    
                ${inShopEast && !hasFishingRod ?
                    /*HTML*/`<button
                ${inShopEast && !hasFishingRod ? 'onclick="buyItem(\'fishingRod\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('buyFishingRod')}"
                onmouseleave="if(onHoverText == 'Buy fishing rod? (150 gold)') {clearTooltip()}">Buy fishing rod</button> 
                ` :
                    /*HTML*/``}

                ${inOasis ?
                        /*HTML*/`<button
                ${inOasis && !hasDesertRose && !hasSilverKey ? 'onclick="pickUpItem(\'desertRose\')"' : 'disabled="disabled"'}
                onmouseenter="{onHoverTooltip('pickUpDesertRose')}"
                onmouseleave="if(onHoverText == 'Pick up desert rose?') {clearTooltip()}">Take rose</button> 
                ` :
                    /*HTML*/``}

                ${inGoatArea1 && !hasGoat1 && !returnedGoat1 ?
                    /*HTML*/`<button
                onclick="pickUpItem('goat1')"
                onmouseenter="{onHoverTooltip('pickUpGoat')}"
                onmouseleave="if(onHoverText == 'Take goat?') {clearTooltip()}">Take goat</button> 
                ` :
                    /*HTML*/``}
                
                ${inGoatArea2 && !hasGoat2 && !returnedGoat2 ?
                    /*HTML*/`<button
                onclick="pickUpItem('goat2')"
                onmouseenter="{onHoverTooltip('pickUpGoat')}"
                onmouseleave="if(onHoverText == 'Take goat?') {clearTooltip()}">Take goat</button> 
                ` :
                /*HTML*/``}

                ${inGoatArea3 && !hasGoat3 && !returnedGoat3 ?
                    /*HTML*/`<button
                onclick="pickUpItem('goat3')"
                onmouseenter="{onHoverTooltip('pickUpGoat')}"
                onmouseleave="if(onHoverText == 'Take goat?') {clearTooltip()}">Take goat</button> 
                ` :
                    /*HTML*/``}
                    
            </div>
        


        <div class="onHoverText">${onHoverText}</div>

        <div>Inventory: <br>
        Gold: ${playerGold}
        </div>
        <div class="inventoryGrid">

        <div id="Inventory_Slot1" class="inventorySlots inventoryLeft inventoryTop"
        onclick="if(hasApple1){useItem('apple')}"><img src=${hasApple1 ? "imgs/inventory_items/Apple.png" : "imgs/inventory_items/Apple_Slot.png"}
        onmouseenter="if(hasApple1){onHoverTooltip('inventory_apple1')}"
        onmouseleave="if(hasApple1 && onHoverText == 'Eat apple? (+25 health)'){clearTooltip()}"
        style="${hasApple1 ? "cursor: pointer" : ""}">
        </div>

        <div id="Inventory_Slot2" class="inventorySlots inventoryTop" 
        onclick="if(hasApple2){useItem('apple')}"><img src=${hasApple2 ? "imgs/inventory_items/Apple.png" : "imgs/inventory_items/Apple_Slot.png"}
        onmouseenter="if(hasApple2){onHoverTooltip('inventory_apple2')}"
        onmouseleave="if(hasApple2 && onHoverText == 'Eat apple? (+25 health)'){clearTooltip()}"
        style="${hasApple2 ? "cursor: pointer" : ""}">
        </div>

        <div id="Inventory_Slot3" class="inventorySlots inventoryRight inventoryTop"
        onclick="if(hasApple3){useItem('apple')}"><img src=${hasApple3 ? "imgs/inventory_items/Apple.png" : "imgs/inventory_items/Apple_Slot.png"}
        onmouseenter="if(hasApple3){onHoverTooltip('inventory_apple3')}"
        onmouseleave="if(hasApple3 && onHoverText == 'Eat apple? (+25 health)'){clearTooltip()}"
        style="${hasApple3 ? "cursor: pointer" : ""}">
        </div>

        <div id="Inventory_Slot4" class="inventorySlots inventoryLeft"
        onclick="useItem('potion')">
        <img src=${hasPotion ? "imgs/inventory_items/Potion.png" : "imgs/inventory_items/Potion_Empty.png"}
        onmouseenter="onHoverTooltip('inventory_potion')"
        onmouseleave="clearTooltip()"
        style="${hasPotion ? "cursor: pointer" : ""}">
        </div>

        <div id="Inventory_Slot5" class="inventorySlots"
        onclick="useItem('fishingRod')">
        <img src=${hasFishingRod ? "imgs/inventory_items/Fishingrod.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_fishingRod')"
        onmouseleave="if(hasFishingRod){clearTooltip()}"
        style="${hasFishingRod ? "cursor: pointer" : ""}">
        </div>

        <div id="Inventory_Slot6" class="inventorySlots inventoryRight"
        onclick="useItem('desertRose')">
        <img src=${hasDesertRose ? "imgs/inventory_items/DesertRose.png" : (hasSilverKey ? "imgs/inventory_items/DesertRose_Slot.png" : "imgs/inventory_items/Empty_Slot.png")}                  
        onmouseenter="onHoverTooltip('inventory_desertRose')"
        onmouseleave="if(hasDesertRose){clearTooltip()}"
        style="${hasDesertRose ? "cursor: pointer" : ""}">
        </div>

        <div id="Inventory_Slot7" class="inventorySlots inventoryLeft inventoryBottom"
        onclick="useItem('copperKey')">
        <img src=${hasCopperKey ? "imgs/inventory_items/CopperKey.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_copperKey')"
        onmouseleave="if(hasCopperKey){clearTooltip()}"
        style="${hasCopperKey ? "cursor: pointer" : ""}">
        </div>

        <div id="Inventory_Slot8" class="inventorySlots inventoryBottom"
        onclick="useItem('silverKey')">
        <img src=${hasSilverKey ? "imgs/inventory_items/SilverKey.png" : "imgs/inventory_items/Empty_Slot.png"}
        onmouseenter="onHoverTooltip('inventory_silverKey')"
        onmouseleave="if(hasSilverKey){clearTooltip()}"
        style="${hasSilverKey ? "cursor: pointer" : ""}">
        </div>

        <div id="Inventory_Slot9" class="inventorySlots inventoryRight inventoryBottom"
        onclick="useItem('goat')">
        <img src=${hasGoat1 || hasGoat2 || hasGoat3 ? inventoryGoat : "imgs/inventory_items/Goat_Empty.png"} 
        onmouseenter="onHoverTooltip('inventory_goat')"
        onmouseleave="if((hasGoat1 || hasGoat2 || hasGoat3) || (returnedGoat1 || returnedGoat2 || returnedGoat3)){clearTooltip()}"
        style="${hasGoat1 || hasGoat2 || hasGoat3 ? "cursor: pointer" : ""}">
        </div>
        </div>
    </div>
    <button class="leftButton" onclick="muteAudio(), updateView()">Mute</button>
    `
        }
    `

        // START SCREEN:

        : /*HTML*/`       
            <div class="gameScreen" style="background-image: url(imgs/startScreen.png)">
            <div class="UpDiv">
            <button class="upButton" ${canGoUp ? 'onclick="moveCharacter(\'north\')"' : 'disabled, style="opacity: 0"'}>🡹</button>
            </div>
            <div class="inputDiv">
            <input id="nameInput" type="text" class="nameInput" placeholder="[Enter name]" max="12">
            <button class="nameButton" onclick="setName()">Confirm name</button>
            </div>
           
        <div class="LeftRightDiv">
            <button class="leftButton" onclick="playerMale = !playerMale, setUpCharacter(), updateView();">🡸</button>
            <div class="gameInfo">
                Select character
            </div>
            <img class="characterSelect" src=${playerMale ? playerCombatSprite ?? "imgs/Character_Male_inCombat.png" : playerCombatSprite ?? "imgs/Character_Female_inCombat.png"}>
            <button class="rightButton" onclick="playerMale = !playerMale, setUpCharacter(), updateView();">🡺</button>
        </div>
        <div class="DownDiv">
            <button class="classButtons"
            style="${adventurerSelected ? 'border: 5px solid orange;' : ''}" 
            onclick="setClass('adventurer'), classSelectButtons(); adventurerSelected = true;"
            onmouseenter="onHoverTooltip('adventurer')"
            onmouseleave="clearTooltip()">Adventurer</button>
            <button class="classButtons"
            style="${warriorSelected ? 'border: 5px solid orange;' : ''}"  
            onclick="setClass('warrior'), classSelectButtons(); warriorSelected = true;"
            onmouseenter="onHoverTooltip('warrior')"
            onmouseleave="clearTooltip()">Warrior</button>
            <button class="classButtons"
            style="${rogueSelected ? 'border: 5px solid orange;' : ''}"  
            onclick="setClass('rogue'), classSelectButtons(); rogueSelected = true;"
            onmouseenter="onHoverTooltip('rogue')"
            onmouseleave="clearTooltip()">Rogue</button>
            <button class="classButtons"
            style="${mageSelected ? 'border: 5px solid orange;' : ''}"  
            onclick="setClass('mage'), classSelectButtons(); mageSelected = true;"
            onmouseenter="onHoverTooltip('mage')"
            onmouseleave="clearTooltip()">Mage</button>
            </div> 
            <div class="adventureText">${adventureText}</div>
    </div>
    </div>
    <div class="worldInfo_container">
        <div class="playerInfo">Your name: ${playerName ?? "Dio"}
            <div>Your class: ${playerClass ?? "Adventurer"}</div>
                    <div>Health: ${playerHealth + " / " + playerMaxHealth}</div>
                    <div>Energy: ${playerEnergy + " / " + playerMaxEnergy}</div>

        </div>   
            <div class="worldActions">
                <button
                onclick="startGame()">Start game</button>
            </div>
            <div class="onHoverText">${onHoverText}</div>
        <div class="inventoryGrid"></div>
        </div>
        <button class="leftButton" onclick="muteAudio(), updateView()">Mute</button>
        `
}

function setName() {
    playerName = document.getElementById('nameInput').value;
    updateView();
}

function classSelectButtons() {
    adventurerSelected = false;
    warriorSelected = false;
    rogueSelected = false;
    mageSelected = false;
    updateView();
}

function setClass(selectedClass) {

    if (selectedClass == "adventurer") {
        playerClass = "Adventurer"

        playerHealth = 100;
        playerMaxHealth = 100;

        playerEnergy = 150;
        playerMaxEnergy = 150;

        playerMinDamage = 15;
        playerMaxDamage = 25;

    }
    else if (selectedClass == "warrior") {
        playerClass = "Warrior"

        playerHealth = 150;
        playerMaxHealth = 150;

        playerEnergy = 70;
        playerMaxEnergy = 70;

        playerMinDamage = 20;
        playerMaxDamage = 30;

    }
    else if (selectedClass == "rogue") {
        playerClass = "Rogue"

        playerHealth = 85;
        playerMaxHealth = 85;

        playerEnergy = 125;
        playerMaxEnergy = 125;

        playerMinDamage = 30;
        playerMaxDamage = 40;

    }
    else if (selectedClass == "mage") {
        playerClass = "Mage"

        playerHealth = 70;
        playerMaxHealth = 70;

        playerEnergy = 200;
        playerMaxEnergy = 200;

        playerMinDamage = 9;
        playerMaxDamage = 12;

    }
    adventureText = "Start game with the " + (playerClass ?? " Adventurer") + " class?"
    setUpCharacter();
    updateView();
}

function setUpCharacter() {
    if (playerClass == "Adventurer") {
        playerCombatSprite = playerMale ? "imgs/Character_Male_inCombat.png" : "imgs/Character_Female_inCombat.png";
    }
    else if (playerClass == "Warrior") {
        playerCombatSprite = playerMale ? "imgs/Character_Male_Warrior_inCombat.png" : "imgs/Character_Female_Warrior_inCombat.png";
    }
    else if (playerClass == "Rogue") {
        playerCombatSprite = playerMale ? "imgs/Character_Male_Rogue_inCombat.png" : "imgs/Character_Female_Rogue_inCombat.png";
    }
    else if (playerClass == "Mage") {
        playerCombatSprite = playerMale ? "imgs/Character_Male_Mage_inCombat.png" : "imgs/Character_Female_Mage_inCombat.png";
    }
    updateView();
}



function startGame() {
    if (playerName == null) {
        playerName = "Dio"
    }
    if (playerClass == null) {
        setClass("adventurer");
    }
    adventureText = "You step out of your tent only to see that your three goats are missing... You have to find them and bring them back here!";
    mapLocationY = 5;
    mapLocationX = 5;
    isGameRunning = true;
    inventoryGoat = "imgs/inventory_items/Empty_Slot.png"
    setUpCharacter();
    setUpArea();
    updateView();
}

function rest() {
    if (mapLocationY == 10 && mapLocationX == 5) {
        playerEnergy = playerMaxEnergy;
        adventureText = 'You recover and feel rested...';
        mapLocationY = 5;
        mapLocationX = 5;
        passedOut = false;
        setUpArea();
    }
    else {
        playerEnergy = playerMaxEnergy;
        adventureText = 'You take a moment to rest and recover your energy!';
    }
    statusBars();
    updateView();
}

function passOut() {

    if(playerEnergy <= 0){
        playerEnergy = 0;
        mapLocationY = 10;
        mapLocationX = 5;

        stolenGoldAmount = Math.floor(playerGold * 0.17);

        passedOut = true;
        areaHasWorldItem = false;
        nextStepOasis = false;
        inShopEast = false;
        inShopWest = false;
        inFrontOfCopperDoor = false;
        inFrontOfSilverDoor = false;
        doorUnlocked = false;
        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;
        inOasis = false;
        inGoatArea1 = false;
        inGoatArea2 = false;
        inGoatArea3 = false;
        inFishableArea = false;
        inGrasslands = false;
        inForest = false;
        inDesert = false;
        inCave = false;

        if (playerGold > stolenGoldAmount && stolenGoldAmount != 0) {
            adventureText = 'A stranger found you passed out in the dirt and helped you back to your campsite.. and also helped himself to ' + stolenGoldAmount + ' gold from your gold pouch..'
            playerGold -= stolenGoldAmount;
        } else if (playerGold <= stolenGoldAmount) {
            adventureText = 'A stranger found you passed out in the dirt and helped you back to your campsite.. and also ran off with your entire gold pouch!'
            playerGold = 0;
        } else if (stolenGoldAmount == 0) {
            adventureText = 'A stranger found you passed out in the dirt and helped you back to your campsite..'
        }
    }
    updateView();
}

function enterBattle() {
    setUpEnemy();
    enemyHealthBarColor = "lightgreen"
    adventureText = "A " + enemyName + " ambushed you!"

    if (inGrasslands) {
        battleBackground = `style="background-image: url(imgs/Arenas/grasslandsArena.png)"`;
    }
    else if (inForest) {
        battleBackground = `style="background-image: url(imgs/Arenas/forestArena.png)"`;
    }
    else if (inDesert) {
        battleBackground = `style="background-image: url(imgs/Arenas/desertArena.png)"`;
    }
    else if (inCave) {
        battleBackground = `style="background-image: url(imgs/Arenas/caveArena.png"`;
    }
    psychedUp = false;
    enemyStunned = false;
    stunCounter = 0;
    inBattle = true;
    actionMenuCooldown = false;
    updateView();
}

function setUpEnemy() {

    if (inGrasslands) {
        enemyName = "silly bandit"
        enemySprite = "imgs/Enemy_sillyBandit_inCombat.png"
        onHoverText = "Choose an action";
        enemyGold = Math.floor(Math.random() * 21) + 5;
        enemyLevel = 1;
        enemyHealth = 65;
        enemyMaxHealth = 65;
        enemyMinDamage = 5;
        enemyMaxDamage = 15;
        yieldXP = 11;

    }
    if (inForest) {
        enemyName = "forest goblin"
        enemySprite = "imgs/Enemy_forestGoblin_inCombat.png"
        onHoverText = "Choose an action";
        enemyGold = Math.floor(Math.random() * 27) + 7;
        enemyLevel = 3;
        enemyHealth = 85;
        enemyMaxHealth = 85;
        enemyMinDamage = 10;
        enemyMaxDamage = 20;
        yieldXP = 17;
    }
    if (inDesert) {
        enemyName = "skeleton warrior"
        enemySprite = "imgs/Enemy_skeleton_inCombat.png"
        onHoverText = "Choose an action";
        enemyGold = Math.floor(Math.random() * 30) + 12;
        enemyLevel = 6;
        enemyHealth = 105;
        enemyMaxHealth = 105;
        enemyMinDamage = 10;
        enemyMaxDamage = 25;
        yieldXP = 23;
    }
    if (inCave) {
        enemyName = "cave troll"
        enemySprite = "imgs/Enemy_caveTroll_inCombat.png"
        onHoverText = "Choose an action";
        enemyGold = Math.floor(Math.random() * 45) + 15;
        enemyLevel = 10;
        enemyHealth = 125;
        enemyMaxHealth = 125;
        enemyMinDamage = 20;
        enemyMaxDamage = 35;
        yieldXP = 35;
    }
}

function ability() {

    abilityWindow = !abilityWindow;

    if (playerClass == "Adventurer") {
        playerAbilities = abilityWindow ? /*HTML*/`
        <button class="abilityButton" 
        onmouseenter="onHoverTooltip(playerLevel >= searchBackpack.requiredLevel ? (playerEnergy >= searchBackpack.requiredEnergy ? 'searchBackpack' : 'notEnoughEnergy') : 'levelTooLow')" 
        onmouseleave="clearTooltip()" 
        ${playerLevel >= searchBackpack.requiredLevel && playerEnergy >= searchBackpack.requiredEnergy ? 'onclick="useAbility(\'searchBackpack\')"' : 'disabled, style="opacity: 0.5"'}>Search backpack</button>
        <button class="abilityButton" 
        onmouseenter="onHoverTooltip(playerLevel >= runAway.requiredLevel ? (playerEnergy >= runAway.requiredEnergy ? 'runAway' : 'notEnoughEnergy') : 'levelTooLow')"  
        onmouseleave="clearTooltip()" 
        ${playerLevel >= runAway.requiredLevel && playerEnergy >= runAway.requiredEnergy ? 'onclick="useAbility(\'runAway\')"' : 'disabled, style="opacity: 0.5"'}>Run away!</button>
        <button class="abilityButton"
        onmouseenter="onHoverTooltip(playerLevel >= patchUp.requiredLevel ? (playerEnergy >= patchUp.requiredEnergy ? 'patchUp' : 'notEnoughEnergy') : 'levelTooLow')" 
        onmouseleave="clearTooltip()"
        ${playerLevel >= patchUp.requiredLevel && playerEnergy >= patchUp.requiredEnergy ? 'onclick="useAbility(\'patchUp\')"' : 'disabled, style="opacity: 0.5"'}>Patch up</button>
        `
            : /*HTML*/``
    }
    else if (playerClass == "Warrior") {
        playerAbilities = abilityWindow ? /*HTML*/`
        <button class="abilityButton" 
        onmouseenter="onHoverTooltip(playerLevel >= guard.requiredLevel ? (playerEnergy >= guard.requiredEnergy ? 'guard' : 'notEnoughEnergy') : 'levelTooLow')" 
        onmouseleave="clearTooltip()" 
        ${playerLevel >= guard.requiredLevel && playerEnergy >= guard.requiredEnergy ? 'onclick="useAbility(\'guard\')"' : 'disabled, style="opacity: 0.5"'}>Psych up</button>
        <button class="abilityButton"
        onmouseenter="onHoverTooltip(playerLevel >= shieldSlam.requiredLevel ? (playerEnergy >= shieldSlam.requiredEnergy ? 'shieldSlam' : 'notEnoughEnergy') : 'levelTooLow')" 
        onmouseleave="clearTooltip()"
        ${playerLevel >= shieldSlam.requiredLevel && playerEnergy >= shieldSlam.requiredEnergy ? 'onclick="useAbility(\'shieldSlam\')"' : 'disabled, style="opacity: 0.5"'}>Shield slam</button>
        <button class="abilityButton" 
        onmouseenter="onHoverTooltip(playerLevel >= mendWounds.requiredLevel ? (playerEnergy >= mendWounds.requiredEnergy ? 'mendWounds' : 'notEnoughEnergy') : 'levelTooLow')"  
        onmouseleave="clearTooltip()" 
        ${playerLevel >= mendWounds.requiredLevel && playerEnergy >= mendWounds.requiredEnergy ? 'onclick="useAbility(\'mendWounds\')"' : 'disabled, style="opacity: 0.5"'}>Mend wounds</button>
        `
            : /*HTML*/``
    }
    else if (playerClass == "Rogue") {
        playerAbilities = abilityWindow ? /*HTML*/`
        <button class="abilityButton"
        onmouseenter="onHoverTooltip(playerLevel >= steal.requiredLevel ? 'steal' : 'levelTooLow')" 
        onmouseleave="clearTooltip()"
        ${playerLevel >= steal.requiredLevel && playerEnergy >= steal.requiredEnergy ? 'onclick="useAbility(\'steal\')"' : 'disabled, style="opacity: 0.5"'}>Steal</button>
        <button class="abilityButton" 
        onmouseenter="onHoverTooltip(playerLevel >= stabbyStab.requiredLevel ? 'stabbyStab' : 'levelTooLow')" 
        onmouseleave="clearTooltip()" 
        ${playerLevel >= stabbyStab.requiredLevel && playerEnergy >= stabbyStab.requiredEnergy ? 'onclick="useAbility(\'stabbyStab\')"' : 'disabled, style="opacity: 0.5"'}>Stabby stab</button>
        <button class="abilityButton" 
        onmouseenter="onHoverTooltip(playerLevel >= vanish.requiredLevel ? 'vanish' : 'levelTooLow')" 
        onmouseleave="clearTooltip()" 
        ${playerLevel >= vanish.requiredLevel && playerEnergy >= vanish.requiredEnergy ? 'onclick="useAbility(\'vanish\')"' : 'disabled, style="opacity: 0.5"'}>Vanish</button>
        `
            : /*HTML*/``
    }
    else if (playerClass == "Mage") {
        playerAbilities = abilityWindow ? /*HTML*/`
        <button class="abilityButton" 
        onmouseenter="onHoverTooltip(playerLevel >= chill.requiredLevel ? 'chill' : 'levelTooLow')" 
        onmouseleave="clearTooltip()" 
        ${playerLevel >= chill.requiredLevel && playerEnergy >= chill.requiredEnergy ? 'onclick="useAbility(\'chill\')"' : 'disabled, style="opacity: 0.5"'}>Chill</button>
        <button class="abilityButton"
        onmouseenter="onHoverTooltip(playerLevel >= fireball.requiredLevel ? 'fireball' : 'levelTooLow')" 
        onmouseleave="clearTooltip()"
        ${playerLevel >= fireball.requiredLevel && playerEnergy >= fireball.requiredEnergy ? 'onclick="useAbility(\'fireball\')"' : 'disabled, style="opacity: 0.5"'}>Fireball</button>
        <button class="abilityButton" 
        onmouseenter="onHoverTooltip(playerLevel >= soothingWinds.requiredLevel ? 'soothingWinds' : 'levelTooLow')" 
        onmouseleave="clearTooltip()" 
        ${playerLevel >= soothingWinds.requiredLevel && playerEnergy >= soothingWinds.requiredEnergy ? 'onclick="useAbility(\'soothingWinds\')"' : 'disabled, style="opacity: 0.5"'}>Soothing winds</button>
        `
            : /*HTML*/``
    }
    updateView();
}

function attack() {

    actionMenuCooldown = true;
    playerDamage = Math.floor(Math.random() * (playerMaxDamage - playerMinDamage + 1)) + playerMinDamage;
    adventureText = "You deal " + playerDamage + " damage to the " + enemyName + "!";
    dealDamage(playerDamage);
    updateView();
}

function useAbility(ability) {

    abilityWindow = !abilityWindow;
    //adventurer
    if (ability == 'searchBackpack') {
        playerEnergy -= searchBackpack.requiredEnergy;

        searchBackpackAttempt = Math.floor(Math.random() * 3) + 1;

        if(searchBackpackAttempt == 1){
            stunCounter = 3;
            enemyStunned = true;
            playerDamage = Math.floor(Math.random() * (playerMaxDamage - playerMinDamage + 1)) + playerMinDamage;
            modifiedPlayerDamage = Math.floor(playerDamage / 2.5);
            adventureText = "You pull out a frying pan and throw it at the " + enemyName + " and deal " + modifiedPlayerDamage + " damage and the " + enemyName + " is stunned!";
            dealDamage(modifiedPlayerDamage);
        }
        else if(searchBackpackAttempt == 2){
            playerDamage = Math.floor(Math.random() * (playerMaxDamage - playerMinDamage + 1)) + playerMinDamage;
            modifiedPlayerDamage = Math.floor(playerDamage / 3);
            adventureText = "You pull out a loaf of stale bread and throw it at the " + enemyName + " and deal " + modifiedPlayerDamage + " damage!";
            dealDamage(modifiedPlayerDamage);
        }
        else if(searchBackpackAttempt == 3){
            playerDamage = Math.floor(Math.random() * (playerMaxDamage - playerMinDamage + 1)) + playerMinDamage;
            modifiedPlayerDamage = Math.floor(playerDamage * 1.5);
            adventureText = "You pull out a dagger and throw it at the " + enemyName + " and deal " + modifiedPlayerDamage + " damage!";
            dealDamage(modifiedPlayerDamage);
        }
    }
    if (ability == 'runAway') {
        playerEnergy -= runAway.requiredEnergy;
        runAwayAttempt = Math.floor(Math.random() * 2) + 1;

            if(runAwayAttempt == 1){
                adventureText = "You ran away successfully!"
                leaveBattle();
            }else if(runAwayAttempt != 1){
                adventureText = "You attempt to run away but the " + enemyName + " gives chase!"
                setTimeout(enemyTurn, 1500);
            }
    }
    if (ability == 'patchUp') {
        playerEnergy -= patchUp.requiredEnergy;
        adventureText = "You quickly patch up recent wounds during combat and recover " + Math.floor(playerMaxHealth / 4) + " health!"
        heal(Math.floor(playerMaxHealth / 4))
        setTimeout(enemyTurn, 1500);
    }

    //warrior
    if (ability == 'guard') {
        playerEnergy -= guard.requiredEnergy;

        psychedUp = true;
        setTimeout(enemyTurn, 1500);
    }
    if (ability == 'shieldSlam') {
        playerEnergy -= shieldSlam.requiredEnergy;
        stunCounter = 3;
        enemyStunned = true;
        playerDamage = Math.floor(Math.random() * (playerMaxDamage - playerMinDamage + 1)) + playerMinDamage;
        modifiedPlayerDamage = Math.floor(playerDamage / 3);
        adventureText = "You shield slam the " + enemyName + " for " + modifiedPlayerDamage + " damage and the " + enemyName + " is stunned!";
        dealDamage(modifiedPlayerDamage);
    }
    if (ability == 'mendWounds') {
        playerEnergy -= mendWounds.requiredEnergy;
        adventureText = "You carefully tend to your wounds during battle and " + Math.floor(playerMaxHealth / 3) + " health!"
        heal(Math.floor(playerMaxHealth / 3))
        setTimeout(enemyTurn, 1500);
    }

    //rogue
    if (ability == 'steal') {
        playerEnergy -= steal.requiredEnergy;

        stealChance = Math.floor(Math.random() * 2) + 1;
        
        if (!hasStolen && stealChance == 1) {
            
            playerGold += (Math.floor(enemyGold * 1.7));
            adventureText = "You steal " + (Math.floor(enemyGold * 1.7)) + " gold from the " + enemyName + "!"
            hasStolen = true;
        }
        else if (!hasStolen && stealChance != 1) {
            adventureText = "Your attempt to steal from the " + enemyName + " failed!"
        }
        else if (hasStolen) {
            adventureText = "There is nothing more to steal from this " + enemyName + ".."
        }
        setTimeout(enemyTurn, 1500);
    }
    if (ability == 'stabbyStab') {
        playerEnergy -= stabbyStab.requiredEnergy;
        stunCounter = 3;
        enemyStunned = true;
        playerDamage = Math.floor(Math.random() * (playerMaxDamage - playerMinDamage + 1)) + playerMinDamage;
        modifiedPlayerDamage = Math.floor(playerDamage * 0.5);
        adventureText = "You exploit the " + enemyName + "'s weakness and deal " + modifiedPlayerDamage + " damage and the " + enemyName + " is stunned!";
        dealDamage(modifiedPlayerDamage);
    }
    if (ability == 'vanish') {
        playerEnergy -= vanish.requiredEnergy;
        adventureText = "You vanish into the shadows and escape.."
        leaveBattle();
    }

    //mage
    if (ability == 'chill') {
        playerEnergy -= chill.requiredEnergy;
        stunCounter = 3;
        enemyStunned = true;
        playerDamage = Math.floor(Math.random() * (playerMaxDamage - playerMinDamage + 1)) + playerMinDamage;
        modifiedPlayerDamage = Math.floor(playerDamage * 1.5);
        adventureText = "You cast a cold spell on the " + enemyName + " and deal " + modifiedPlayerDamage + " damage and the " + enemyName + " is frozen!";
        dealDamage(modifiedPlayerDamage);
    }
    if (ability == 'fireball') {
        playerEnergy -= fireball.requiredEnergy;
        playerDamage = Math.floor(Math.random() * (playerMaxDamage - playerMinDamage + 1)) + playerMinDamage;
        modifiedPlayerDamage = Math.floor(playerDamage * 3);
        adventureText = "You cast a fireball and deal " + modifiedPlayerDamage + " damage to the " + enemyName + "!";
        dealDamage(modifiedPlayerDamage);
    }
    if (ability == 'soothingWinds') {
        playerEnergy -= soothingWinds.requiredEnergy;
        adventureText = "You cast a soothing wind spell and recover " + Math.floor(playerMaxHealth / 1.5) + " health!"
        heal(Math.floor(playerMaxHealth / 1.5))
        setTimeout(enemyTurn, 1500);
    }
    actionMenuCooldown = true;
    clearTooltip();
    updateView();
}

function dealDamage(playerDamage) {

    enemyHealth -= playerDamage;
    statusBars();

    if (enemyHealth <= 0) {
        enemyHealth = 0;
        adventureText = "You deal " + playerDamage + " damage to the " + enemyName + ", and the " + enemyName + " dies!"
        setTimeout(winBattle, 2000);
    }
    else {
        setTimeout(enemyTurn, 1500);
    }
}

function enemyTurn() {

    stunCheck();
    if (enemyStunned) {
        adventureText = "The " + enemyName + " is stunned and cannot move."
    }
    else if (!enemyStunned) {

        if(psychedUp){

        enemyDamage = Math.floor(Math.random() * ((enemyMaxDamage - enemyMinDamage) / 2 + 1)) + enemyMinDamage;
        playerHealth -= enemyDamage;
        adventureText = "The " + enemyName + " attacks " + playerName + " for " + enemyDamage + " damage!";
            playerEnergy += enemyDamage;
            if(playerEnergy >= playerMaxEnergy){
                playerEnergy = playerMaxEnergy;
            }
            psychedUp = false;
        }
        else if(!psychedUp){

        enemyDamage = Math.floor(Math.random() * (enemyMaxDamage - enemyMinDamage + 1)) + enemyMinDamage;
        playerHealth -= enemyDamage;
        adventureText = "The " + enemyName + " attacks " + playerName + " for " + enemyDamage + " damage!";

        }

        if (playerHealth <= 0) {
            die();
        }
    }
    actionMenuCooldown = false;
    statusBars();
    updateView();
}

function stunCheck() {
    if (enemyStunned) {
        stunCounter--;
        if (stunCounter == 0) {
            enemyStunned = false;
        }
    }
}

function die() {
    playerHealth = 0;
    adventureText = "You died.."
    playerAlive = false;
}

function restartGame() {
    location.reload();
}

function winBattle() {
    adventureText = "You emerge victorious, gained " + yieldXP + " experience and looted " + enemyGold + " gold from the corpse... ";
    clearTooltip();
    playerGold += enemyGold;
    playerXP += yieldXP;

    if (playerXP >= playerNextLevelXP) {
        levelUp();
        adventureText = "LEVEL UP! You emerge victorious, gained " + yieldXP + " experience and looted " + enemyGold + " gold from the corpse... ";
    }
    leaveBattle();
    updateView();
}

function leaveBattle() {
    worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    inBattle = false;
    hasStolen = false;
    actionMenuCooldown = false;
    clearTooltip();
}

function levelUp() {
    playerLevel++;
    excessXP = playerXP - playerNextLevelXP;
    playerXP = 0;
    playerXP += excessXP;
    playerNextLevelXP = playerLevel * 27;

    if (playerClass == 'Adventurer') {
        playerMaxHealth += 5;
        playerMaxEnergy += 5;
        playerMinDamage += 3;
        playerMaxDamage += 5;
    }
    if (playerClass == 'Warrior') {
        playerMaxHealth += 10;
        playerMaxEnergy += 5;
        playerMinDamage += 2;
        playerMaxDamage += 6;
    }
    if (playerClass == 'Rogue') {
        playerMaxHealth += 7;
        playerMaxEnergy += 7;
        playerMinDamage += 2;
        playerMaxDamage += 7;
    }
    if (playerClass == 'Mage') {
        playerMaxHealth += 5;
        playerMaxEnergy += 10;
        playerMinDamage += 2;
        playerMaxDamage += 5;
    }

}

function flee() {

    droppedGold = Math.floor(playerGold * 0.12);

    if (playerGold > droppedGold && droppedGold != 0) {
        adventureText = 'You grab a handful of gold coins and toss it at your enemy as a distraction to escape... You lose ' + droppedGold + ' gold!'
        playerGold -= droppedGold;
    } else if (playerGold <= droppedGold) {
        adventureText = 'You grab all of your gold coins and toss it and toss it at your enemy as a distraction to escape...'
        playerGold = 0;
    } else if (droppedGold == 0) {
        adventureText = 'You escaped!'
    }
    leaveBattle();
    clearTooltip();
    updateView();
}

function talkToNPC(NPC) {


    if (NPC == "shopEastNPC") {
        let eastShopKeeperDialogue;

        if (!hasCopperKey && !hasFishingRod) {
            eastShopKeeperDialogue = [

                "Shopkeeper: I saw something sparkly in the lake up in the dark forest once but the goblins chased me away before I could get a closer look... ▾",
                "Shopkeeper: You'll need a fishing rod if you want to have a go at pulling whatever it is out of the lake yourself!",
                "..."
            ]
            adventureText = currentDialogue;
        }
        else if (!hasCopperKey && hasFishingRod) {
            eastShopKeeperDialogue = [
                "Shopkeeper: You won't regret buying that fishing rod! ▾",
                "Shopkeeper: ... or maybe you will, there's a reason I wanted to get rid of it after all.. ▾",
                "Shopkeeper: There has not been any fish in these waters for decades.. all dead! ▾",
                "Shopkeeper: But.. you might use the rod to fish out the splarkling object I saw in the dark forest if you can make it past the goblins lurking in there..",
                "..."
            ]
        }
        else if (hasCopperKey) {
            eastShopKeeperDialogue = [
                "Shopkeeper: That key! It is the key to the copper mines southeast from here! ▾",
                "Shopkeeper: The mines have been shut down ever since cave trolls started taking shelter from the sunlight in there.. ▾",
                "Shopkeeper: I don't know why you'd want to venture into the mines, but if you go, make sure to stock up on supplies first!",
                "..."
            ]
        }
        adventureText = eastShopKeeperDialogue[currentDialogue];
        currentDialogue++;
        if (currentDialogue == eastShopKeeperDialogue.length) {
            currentDialogue = 0;
        }
    }
    if (NPC == "shopWestNPC") {
        let westShopKeeperDialogue;

        if (!hasSilverKey && !hasDesertRose) {
            westShopKeeperDialogue = [
                "Shopkeeper: I've heard rumours of a hidden oasis somewhere in the desert... ▾",
                "Shopkeeper: Some even claim that if you keep going southwest in the desert you will eventually find the oasis.. ▾",
                "Shopkeeper: An oasis like that is sure to hold the very rare and hard to find desert rose! ▾",
                "Shopkeeper: If you can find me the desert rose, I'll trade you this silver key for it! ▾",
                "Shopkeeper: It is dangerous and easy to get lost out there, so make sure you stock up on supplies if you plan on exploring anywhere!",
                "..."
            ]
        }
        else if (!hasSilverKey && hasDesertRose) {
            westShopKeeperDialogue = [
                "Shopkeeper: That's the desert rose you have there! Would you please trade it with me for this silver key? ▾",
                "Shopkeeper: PLEASEEEE!!!!!",
                "..."
            ]
        }
        else if (hasSilverKey && !hasDesertRose) {
            westShopKeeperDialogue = [
                "Shopkeeper: Thanks you so much for trading with me! ▾",
                "Shopkeeper: I have no idea what that key is for, by the way...",
                "Shopkeeper: I'd cherish this rose more if not for the horrible smell!",
                "..."
            ]
        }
        adventureText = westShopKeeperDialogue[currentDialogue];
        currentDialogue++;
        if (currentDialogue == westShopKeeperDialogue.length) {
            currentDialogue = 0;
        }
    }
    updateView();
}

function buyItem(item) {

    if (item == "apple") {
        if (playerGold >= 12) {

            if (!hasApple1 && !hasApple2 && !hasApple3) {
                hasApple1 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
                coinsAudio.currentTime = 0;
                coinsAudio.play();
            }
            else if (hasApple1 && !hasApple2 && !hasApple3) {
                hasApple2 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
                coinsAudio.currentTime = 0;
                coinsAudio.play();
            }
            else if (hasApple1 && hasApple2 && !hasApple3) {
                hasApple3 = true;
                adventureText = "You bought an apple."
                playerGold -= 12;
                coinsAudio.currentTime = 0;
                coinsAudio.play();
            }
        } else if (playerGold < 12) {
            adventureText = "You do not have enough gold!"
        }
    }

    if (item == "potion") {
        if (playerGold >= 50) {

            if (!hasPotion) {
                hasPotion = true;
                adventureText = "You bought a potion."
                playerGold -= 50;
                coinsAudio.play();
            }
        } else if (playerGold < 50) {
            adventureText = "You do not have enough gold!"
        }
    }

    if (item == "fishingRod") {
        if (playerGold >= 150) {

            if (!hasFishingRod) {
                hasFishingRod = true;
                areaHasWorldItem = false;
                adventureText = "You bought a fishing rod."
                playerGold -= 150;
                coinsAudio.play();
            }
        } else if (playerGold < 150) {
            adventureText = "You do not have enough gold!"
        }

    }

    if (item == "silverKey") {
        if (hasDesertRose) {
            hasSilverKey = true;
            hasDesertRose = false;
            adventureText = "You traded the rose for a silver key!"
            pickUpAudio.play();
        } else if (!hasDesertRose) {
            adventureText = "You don't have the desert rose! There is a rumour it can be found if you keep heading south-east in the desert...."
        }
    }
    currentDialogue = 0;
    updateView();
}

function pickUpItem(item) {
    if (item == "desertRose") {
        if (!hasDesertRose && !hasSilverKey) {
            hasDesertRose = true;
            areaHasWorldItem = false;
            adventureText = "You carefully pluck the rare desert rose from the hidden oasis.."
            pickUpAudio.play();
        }
    }
    if (item == "goat1" && !hasGoat2 && !hasGoat3) {
        if (!hasGoat1 && !returnedGoat1) {
            hasGoat1 = true;
            areaHasWorldItem = false;
            adventureText = "You take the goat!"
            inventoryGoat = "imgs/inventory_items/Goat1.png"
            pickUpAudio.play();
        }
    }
    else if (item == "goat1" && (hasGoat2 || hasGoat3)) {
        adventureText = "You can only carry one goat at a time! Head back and drop off a goat first!"
    }
    if (item == "goat2" && !hasGoat1 && !hasGoat3) {
        if (!hasGoat2 && !returnedGoat2) {
            hasGoat2 = true;
            areaHasWorldItem = false;
            adventureText = "You take the goat!"
            inventoryGoat = "imgs/inventory_items/Goat2.png"
            pickUpAudio.play();
        }
    }
    else if (item == "goat2" && (hasGoat1 || hasGoat3)) {
        adventureText = "You can only carry one goat at a time! Head back and drop off a goat first!"
    }
    if (item == "goat3" && !hasGoat1 && !hasGoat2) {
        if (!hasGoat3 && !returnedGoat3) {
            hasGoat3 = true;
            areaHasWorldItem = false;
            adventureText = "You take the goat!"
            inventoryGoat = "imgs/inventory_items/Goat3.png"
            pickUpAudio.play();
        }
    }
    else if (item == "goat3" && (hasGoat1 || hasGoat2)) {
        adventureText = "You can only carry one goat at a time! Head back and drop off a goat first!"
    }
    updateView();
}

function useItem(item) {
    if (item == 'apple') {
        if (playerHealth < playerMaxHealth) {
            eatApple();
        } else {
            adventureText = "You are full!"
        }
    }
    if (item == 'potion' && hasPotion) {
        if (playerEnergy < playerMaxEnergy) {
            hasPotion = false;
            adventureText = "You drink the potion.. +50 energy!"
            playerEnergy += 50;
            if (playerEnergy >= playerMaxEnergy) {
                playerEnergy = playerMaxEnergy;
            }
            drinkAudio.play();
            clearTooltip();
            statusBars();
        } else {
            adventureText = "You already feel energized!"
        }
    }

    if (item == 'goat' && inMainCampsite && hasGoat1) {
        returnedGoat1 = true;
        hasGoat1 = false;
        adventureText = "You return the goat to your campsite!"
        goatAudio.play();
    }
    if (item == 'goat' && inMainCampsite && hasGoat2) {
        returnedGoat2 = true;
        hasGoat2 = false;
        adventureText = "You return the goat to your campsite!"
        goatAudio.play();
    }
    if (item == 'goat' && inMainCampsite && hasGoat3) {
        returnedGoat3 = true;
        hasGoat3 = false;
        adventureText = "You return the goat to your campsite!"
        goatAudio.play();
    }
    else if (item == 'goat' && !inMainCampsite && (hasGoat1 || hasGoat2 || hasGoat3)) {
        adventureText = "You should bring the goat back to your main campsite first!"
        goatAudio.play();
    }

    if (item == 'fishingRod' && inFishableArea && hasFishingRod) {
        if (!hasCopperKey) {
            hasCopperKey = true;
            adventureText = "You use your fishing rod to pull an old rusty key from the depths of the forest lake!"
            fishingAudio.play();
        }
        else if (hasCopperKey) {
            adventureText = "This water doesn't seem suitable for fish to live in..."
        }
    }
    else if (item == 'fishingRod' && !inFishableArea && hasFishingRod) {
        adventureText = "There's no fishable water in this area... You might try elsewhere!"
    }

    if (item == 'desertRose' && hasDesertRose && !inShopWest) {
        adventureText = "The rose has a vile stench! You did not expect that!"
    } else if (item == 'desertRose' && hasDesertRose && inShopWest) {
        hasSilverKey = true;
        hasDesertRose = false;
        adventureText = "You traded the rose for a silver key!"
        pickUpAudio.play();
    }


    if (item == 'copperKey' && hasCopperKey && inFrontOfCopperDoor && !copperKeyUsed) {
        copperKeyUsed = true;
        doorUnlocked = true;
        unlockAudio.play();
        canGoUp = true;
        changeLocation();
    }
    else if (item == 'copperKey' && hasCopperKey && !inFrontOfCopperDoor || item == 'copperKey' && copperKeyUsed) {
        adventureText = "There are no compatible locks for this key in the area..."
    }

    if (item == 'silverKey' && hasSilverKey && inFrontOfSilverDoor && !silverKeyUsed) {
        silverKeyUsed = true;
        doorUnlocked = true;
        unlockAudio.play();
        canGoUp = true;
        changeLocation();
    }
    else if (item == 'silverKey' && hasSilverKey && !inFrontOfSilverDoor || item == 'silverKey' && silverKeyUsed) {
        adventureText = "There are no compatible locks for this key in the area..."
    }
    currentDialogue = 0;

    updateView();
}

function eatApple() {
    if (hasApple1 && !hasApple2 && !hasApple3) {
        hasApple1 = false;
    }
    if (hasApple1 && hasApple2 && !hasApple3) {
        hasApple2 = false;
    }
    if (hasApple1 && hasApple2 && hasApple3) {
        hasApple3 = false;
    }
    adventureText = "You eat an apple.. +25 health!"
    eatAudio.play();
    heal(25);
    clearTooltip();
    updateView();
}

function heal(healAmount) {
    playerHealth += healAmount;
    if (playerHealth >= playerMaxHealth) {
        playerHealth = playerMaxHealth;
    }
    statusBars();
}


function onHoverTooltip(button) {

    //class selection
    if (button == 'adventurer' && onHoverText != "The adventurer is a balanced class.") {
        onHoverText = "The adventurer is a balanced class.";
        updateView();
    }
    if (button == 'warrior' && onHoverText != "The warrior can take a beating but tires easily from wearing heavy armour.") {
        onHoverText = "The warrior can take a beating but tires easily from wearing heavy armour."
        updateView();
    }
    if (button == 'rogue' && onHoverText != "Rogue flavour-text idk lol") {
        onHoverText = "Rogue flavour-text idk lol"
        updateView();
    }
    if (button == 'mage' && onHoverText != "While fragile in combat, the mage is the most powerful class and light armor lets them move around with ease.") {
        onHoverText = "While fragile in combat, the mage is the most powerful class and light armor lets them move around with ease.";
        updateView();
    }

    //interact buttons
    if (button == 'talk' && onHoverText != "Talk with shopkeeper?") {
        onHoverText = "Talk with shopkeeper?"
        updateView();
    }
    if (button == 'attack' && onHoverText != "Basic physical attack") {
        onHoverText = "Basic physical attack";
        updateView();
    }
    if (button == 'ability' && onHoverText != "Use a class ability") {
        onHoverText = "Use a class ability";
        updateView();
    }
    if (button == 'flee' && onHoverText != "Toss a handful of your gold coins as a distraction and run away") {
        onHoverText = "Toss a handful of your gold coins as a distraction and run away";
        updateView();
    }
    if (button == 'rest' && onHoverText != "Rest in your tent?") {
        onHoverText = "Rest in your tent?";
        updateView();
    }
    if (button == 'buyApple' && onHoverText != "Buy an apple? (12 gold)") {
        onHoverText = "Buy an apple? (12 gold)";
        updateView();
    }
    if (button == 'buyPotion' && onHoverText != "Buy a potion? (50 gold)") {
        onHoverText = "Buy a potion? (50 gold)";
        updateView();
    }
    if (button == 'buyFishingRod' && onHoverText != "Buy fishing rod? (150 gold)") {
        onHoverText = "Buy fishing rod? (150 gold)"
        updateView();
    }
    if (button == 'restart' && onHoverText != "Restart game?") {
        onHoverText = "Restart game?"
        updateView();
    }

    //abilities
    //adventurer
    if (button == 'searchBackpack' && onHoverText != "Desperately rummage through your backpack for any object, sharp or blunt, to throw at your enemy! (Cost: " + searchBackpack.requiredEnergy + " energy)") {
        onHoverText = "Desperately rummage through your backpack for any object, sharp or blunt, to throw at your enemy! (Cost: " + searchBackpack.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'runAway' && onHoverText != "Attempt to run away! (Cost: " + runAway.requiredEnergy + " energy)") {
        onHoverText = "Attempt to run away! (Cost: " + runAway.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'patchUp' && onHoverText != "Take a moment to patch yourself up! (Cost: " + patchUp.requiredEnergy + " energy)") {
        onHoverText = "Take a moment to patch yourself up! (Cost: " + patchUp.requiredEnergy + " energy)"
        updateView();
    }
    //warrior
    if (button == 'guard' && onHoverText != "Raise your shield to take less damage from the next attack and recover energy based on the reduced damage. (Cost: " + guard.requiredEnergy + " energy)") {
        onHoverText = "Raise your shield to take less damage from the next attack and recover energy based on the reduced damage. (Cost: " + guard.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'shieldSlam' && onHoverText != "Slam your target with your shield to stun them and deal a small amount of damage (Cost: " + shieldSlam.requiredEnergy + " energy)") {
        onHoverText = "Slam your target with your shield to stun them and deal a small amount of damage (Cost: " + shieldSlam.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'mendWounds' && onHoverText != "Take a moment to clean any wounds sustained in combat (Cost: " + mendWounds.requiredEnergy + " energy)") {
        onHoverText = "Take a moment to clean any wounds sustained in combat (Cost: " + mendWounds.requiredEnergy + " energy)"
        updateView();
    }
    //rogue
    if (button == 'steal' && onHoverText != "Attempt to steal gold from your target (Cost: " + steal.requiredEnergy + " energy)") {
        onHoverText = "Attempt to steal gold from your target (Cost: " + steal.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'stabbyStab' && onHoverText != "Exploit your target's weak point with your daggers to deal double the damage of your regular attack (Cost: " + stabbyStab.requiredEnergy + " energy)") {
        onHoverText = "Exploit your target's weak point with your daggers to deal double the damage of your regular attack (Cost: " + stabbyStab.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'vanish' && onHoverText != "Step into the shadows and hide from your enemy to retreat from the battle (Cost: " + vanish.requiredEnergy + " energy)") {
        onHoverText = "Step into the shadows and hide from your enemy to retreat from the battle (Cost: " + vanish.requiredEnergy + " energy)"
        updateView();
    }
    //mage
    if (button == 'chill' && onHoverText != "Deals a small amount of damage and freezes your enemy for 2 turns (Cost: " + chill.requiredEnergy + " energy)") {
        onHoverText = "Deals a small amount of damage and freezes your enemy for 2 turns (Cost: " + chill.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'fireball' && onHoverText != "Deals a moderate amount of fire damage to enemy (Cost: " + fireball.requiredEnergy + " energy)") {
        onHoverText = "Deals a moderate amount of fire damage to enemy (Cost: " + fireball.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'soothingWinds' && onHoverText != "Call on soothing winds to restore a large amount of your own health (Cost: " + soothingWinds.requiredEnergy + " energy)") {
        onHoverText = "Call on soothing winds to restore a large amount of your own health (Cost: " + soothingWinds.requiredEnergy + " energy)"
        updateView();
    }
    if (button == 'levelTooLow' && onHoverText != "Your level is too low to use this ability!") {
        onHoverText = "Your level is too low to use this ability!"
        updateView();
    }
    if (button == 'notEnoughEnergy' && onHoverText != "You don't have enough energy to use this ability!"){
        onHoverText = "You don't have enough energy to use this ability!"
        updateView();
    }

    //inventory items
    if (button == 'inventory_apple1' && hasApple1 && onHoverText != "Eat apple? (+25 health)") {
        onHoverText = "Eat apple? (+25 health)"
        updateView();
    }
    if (button == 'inventory_apple2' && hasApple1 && onHoverText != "Eat apple? (+25 health)") {
        onHoverText = "Eat apple? (+25 health)"
        updateView();
    }
    if (button == 'inventory_apple3' && hasApple1 && onHoverText != "Eat apple? (+25 health)") {
        onHoverText = "Eat apple? (+25 health)"
        updateView();
    }
    if (button == 'inventory_potion' && hasPotion && onHoverText != "Drink potion? (+50 energy)") {
        onHoverText = "Drink potion? (+50 energy)"
        updateView();
    }
    if (button == 'inventory_potion' && !hasPotion && onHoverText != "Your empty potion flask..") {
        onHoverText = "Your empty potion flask.."
        updateView();
    }
    if (button == 'inventory_fishingRod' && hasFishingRod && onHoverText != "Use fishing rod?") {
        onHoverText = "Use fishing rod?"
        updateView();
    }
    if (button == 'inventory_desertRose' && hasDesertRose && !inShopWest && onHoverText != "Smell rose?") {
        onHoverText = "Smell rose?"
        updateView();
    }
    if (button == 'inventory_desertRose' && hasDesertRose && inShopWest && onHoverText != "Trade rose?") {
        onHoverText = "Trade rose?"
        updateView();
    }
    if (button == 'inventory_copperKey' && hasCopperKey && onHoverText != "Use copper key?") {
        onHoverText = "Use copper key?"
        updateView();
    }
    if (button == 'inventory_silverKey' && hasSilverKey && onHoverText != "Use silver key?") {
        onHoverText = "Use silver key?"
        updateView();
    }
    if (button == 'inventory_goat' && (hasGoat1 || hasGoat2 || hasGoat3) && onHoverText != "Leave the goat here?") {
        onHoverText = "Leave the goat here?"
        updateView();
    }

}

function clearTooltip() {
    onHoverText = "";
    updateView();
}


function playerStates() {
    if (goingLeft) {

        if (playerMale) {
            return "imgs/Character_L.png"
        }
        else if (!playerMale) {
            return "imgs/Character_Female_L.png"
        }
    }
    else {

        if (playerMale) {
            return "imgs/Character_R.png"
        }
        else if (!playerMale) {
            return "imgs/Character_Female_R.png"
        }

    }
    // return "imgs/worlditemstest.png"
}

function moveCharacter(direction) {

    if (direction == 'north') {
        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 1;
            mapLocationX = 3;
        }
        else if (canGoUp && !lostInDesertNorth && !nextStepOasis && playerEnergy > 0) {
            mapLocationY++;
            adventureText = "You walk north...";
            playerEnergy -= 5;
        }
        else if (canGoUp && lostInDesertNorth && playerEnergy >= 5) {
            mapLocationY--;
            adventureText = "You walk north...?";
            playerEnergy -= 5;
        }
        else if (canGoUp && nextStepOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }

    if (direction == 'south') {
        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 3;
            mapLocationX = 3;
        }
        else if (canGoDown && !lostInDesertSouth && !nextStepOasis && playerEnergy > 0) {
            mapLocationY--;
            adventureText = "You walk south...";
            playerEnergy -= 5;
        }
        else if (canGoDown && lostInDesertSouth) {
            mapLocationY++;
            adventureText = "You walk south...?";
            playerEnergy -= 5;
        }
        else if (canGoDown && nextStepOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }

    if (direction == 'east') {

        goingLeft = false;

        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 2;
            mapLocationX = 2;
        }
        else if (canGoRight && !lostInDesertEast && !nextStepOasis && playerEnergy > 0) {
            mapLocationX++;
            adventureText = "You walk east...";
            playerEnergy -= 5;
        }
        else if (canGoRight && lostInDesertEast) {
            mapLocationX--;
            adventureText = "You walk east...?";
            playerEnergy -= 5;
        }
        else if (canGoRight && nextStepOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }

    if (direction == 'west') {

        goingLeft = true;

        if (canGoRight && mapLocationY == 10 && mapLocationX == 0) {
            mapLocationY = 2;
            mapLocationX = 4;
        }
        else if (canGoLeft && !lostInDesertWest && !nextStepOasis && playerEnergy > 0) {
            mapLocationX--;
            adventureText = "You walk west...";
            playerEnergy -= 5;
        }
        else if (canGoLeft && lostInDesertWest) {
            mapLocationX++;
            adventureText = "You walk west...?";
            playerEnergy -= 5;
        }
        else if (canGoLeft && nextStepOasis) {
            mapLocationY = 10;
            mapLocationX = 0;
        }
    }
    passOut();
    statusBars();
    setUpArea();
    updateView();
}



function setUpArea() {

    // Y: 0
    if (mapLocationY == 0 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;
        nextStepOasis = true;
    }
    if (mapLocationY == 0 && mapLocationX == 1) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertSouth = true;
        lostInDesertWest = false;
    }
    if (mapLocationY == 0 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertSouth = true;
        lostInDesertEast = false;
    }
    if (mapLocationY == 0 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertSouth = true;
        lostInDesertEast = true;
    }
    // if(mapLocationY == 0 && mapLocationX == 4){

    // }
    // if(mapLocationY == 0 && mapLocationX == 5){

    // }
    // if(mapLocationY == 0 && mapLocationX == 6){

    // }
    if (mapLocationY == 0 && mapLocationX == 7) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;
        playMusic('grasslands_area')

    }
    if (mapLocationY == 0 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;
        playMusic('grasslands_area')
    }
    // if(mapLocationY == 0 && mapLocationX == 9){

    // }
    // if(mapLocationY == 0 && mapLocationX == 10){

    // }

    // Y: 1
    if (mapLocationY == 1 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertWest = true;
        lostInDesertSouth = false;
    }
    if (mapLocationY == 1 && mapLocationX == 1) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertWest = false;
        lostInDesertSouth = false;
    }
    if (mapLocationY == 1 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertSouth = false;
        lostInDesertEast = false;
    }
    if (mapLocationY == 1 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertEast = true;
        lostInDesertSouth = false;
    }
    if (mapLocationY == 1 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 1 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 1 && mapLocationX == 6) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 1 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 1 && mapLocationX == 8) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        doorUnlocked = false;
        inFrontOfCopperDoor = false;
        areaHasRandomEncounters = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 1 && mapLocationX == 9) {

        inFrontOfCopperDoor = true;

        if (copperKeyUsed) {
            doorUnlocked = true;
        }
        if (doorUnlocked) {
            canGoUp = true;
        } else {
            canGoUp = false;
        }

        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;


        inGrasslands = true;
        inCave = false;
        areaHasRandomEncounters = false;

        playMusic('grasslands_area')
        currentMusic = bgm_grasslands;
    }
    if (mapLocationY == 1 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        doorUnlocked = false;
        inCampsite = false;
        inFrontOfCopperDoor = false;
        areaHasRandomEncounters = true;

        playMusic('grasslands_area')
    }

    // Y: 2
    if (mapLocationY == 2 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertWest = true;
        lostInDesertNorth = false;
    }
    if (mapLocationY == 2 && mapLocationX == 1) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertWest = false;
        lostInDesertNorth = false;
    }
    if (mapLocationY == 2 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = false;
    }
    if (mapLocationY == 2 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = false;
        inDesert = true;
        inOasis = false;

        areaHasWorldItem = false;

        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;

        currentMusic = bgm_desert;
        playMusic('desert_area')
    }
    if (mapLocationY == 2 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        inGrasslands = true;
        inDesert = false;

        currentMusic = bgm_grasslands;
        playMusic('grasslands_area')
    }
    if (mapLocationY == 2 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 2 && mapLocationX == 6) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 2 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        playMusic('cave_area')
    }
    if (mapLocationY == 2 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('cave_area')
    }
    if (mapLocationY == 2 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        doorUnlocked = false;
        inGrasslands = false;
        inCave = true;
        inFrontOfCopperDoor = false;
        areaHasRandomEncounters = true;

        currentMusic = bgm_cave;
        playMusic('cave_area')
    }
    if (mapLocationY == 2 && mapLocationX == 10) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inCampsite = true;
        areaHasRandomEncounters = false;

        playMusic('grasslands_area')
    }

    // Y: 3
    if (mapLocationY == 3 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = true;
        lostInDesertWest = true;

        playMusic('desert_area')
    }
    if (mapLocationY == 3 && mapLocationX == 1) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = true;
        lostInDesertWest = false;

        playMusic('desert_area')
    }
    if (mapLocationY == 3 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = true;
        lostInDesertEast = false;

        playMusic('desert_area')
    }
    if (mapLocationY == 3 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        lostInDesertNorth = true;
        lostInDesertEast = true;

        playMusic('desert_area')
    }
    if (mapLocationY == 3 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 3 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 3 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 3 && mapLocationX == 7) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 3 && mapLocationX == 8) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        playMusic('cave_area')
    }
    if (mapLocationY == 3 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('cave_area')
    }
    if (mapLocationY == 3 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        inFrontOfSilverDoor = false;
        areaHasRandomEncounters = true;
        doorUnlocked = false;

        playMusic('cave_area')
    }

    // Y: 4
    if (mapLocationY == 4 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        inGoatArea1 = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 1) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 3) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 5) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 6) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        inShopEast = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 4 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        inFrontOfSilverDoor = false;
        areaHasRandomEncounters = true;
        doorUnlocked = false;

        playMusic('cave_area')
    }
    if (mapLocationY == 4 && mapLocationX == 10) {
        inFrontOfSilverDoor = true;
        areaHasRandomEncounters = false;

        if (silverKeyUsed) {
            doorUnlocked = true;
        }
        if (doorUnlocked) {
            canGoUp = true;
        } else {
            canGoUp = false;
        }
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        playMusic('cave_area')
    }

    // Y: 5
    if (mapLocationY == 5 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inGoatArea1 = true;
        areaHasRandomEncounters = false;

        if (!hasGoat1 || !returnedGoat1) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/Goat1_WorldItem.png'
        }
        if (hasGoat1 || returnedGoat1) {
            areaHasWorldItem = false;
        }

        playMusic('grasslands_area')
    }
    // if(mapLocationY == 5 && mapLocationX == 1){

    // }
    if (mapLocationY == 5 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    // if(mapLocationY == 5 && mapLocationX == 3){

    // }
    if (mapLocationY == 5 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        areaHasRandomEncounters = true;
        inGrasslands = true;
        inMainCampsite = false;
        inCampsite = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 5 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inMainCampsite = true;
        inCampsite = true;
        areaHasRandomEncounters = false;

        currentMusic = bgm_grasslands;
        playMusic('grasslands_area')
    }
    if (mapLocationY == 5 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = true;
        inGrasslands = true;
        inMainCampsite = false;
        inCampsite = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 5 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 5 && mapLocationX == 8) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inShopEast = true;
        currentDialogue = 0;

        if (!hasFishingRod) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/FishingRod_WorldItem.png'
        }
        if (hasFishingRod) {
            areaHasWorldItem = false;
        }

        playMusic('grasslands_area')
    }
    if (mapLocationY == 5 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        playMusic('cave_area')
    }
    if (mapLocationY == 5 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inGoatArea3 = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = true;

        inFrontOfSilverDoor = false;
        doorUnlocked = false;

        playMusic('cave_area')
    }

    // Y: 6
    if (mapLocationY == 6 && mapLocationX == 0) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        inGoatArea1 = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 6 && mapLocationX == 1) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 6 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 6 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inShopWest = false;
        areaHasRandomEncounters = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 6 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 6 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        inGrasslands = true;
        areaHasRandomEncounters = true;

        inMainCampsite = false;
        inCampsite = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 6 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        inGoatArea2 = true;
        areaHasRandomEncounters = false;

        if (!hasGoat2 || !returnedGoat2) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/Goat2_WorldItem.png'
        }
        if (hasGoat2 || returnedGoat2) {
            areaHasWorldItem = false;
        }

        playMusic('forest_area')
    }
    if (mapLocationY == 6 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inGoatArea2 = false;
        areaHasWorldItem = false;
        areaHasRandomEncounters = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 6 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        playMusic('forest_area')
    }
    if (mapLocationY == 6 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = false;

        inFishableArea = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 6 && mapLocationX == 10) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inGoatArea3 = true;
        areaHasRandomEncounters = false;

        if (!hasGoat3 || !returnedGoat3) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/Goat3_WorldItem.png'
        }
        if (hasGoat3 || returnedGoat3) {
            areaHasWorldItem = false;
        }

        playMusic('cave_area')
    }

    // Y: 7
    // if(mapLocationY == 7 && mapLocationX == 0){

    // }
    // if(mapLocationY == 7 && mapLocationX == 1){

    // }
    if (mapLocationY == 7 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 7 && mapLocationX == 3) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;

        inShopWest = true;
        currentDialogue = 0;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 7 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = false;
    }
    if (mapLocationY == 7 && mapLocationX == 5) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        inGrasslands = true;
        inForest = false;

        currentMusic = bgm_grasslands;
        playMusic('grasslands_area')
    }
    if (mapLocationY == 7 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = false;
        inForest = true;

        currentMusic = bgm_forest;
        playMusic('forest_area')

    }
    if (mapLocationY == 7 && mapLocationX == 7) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        playMusic('forest_area')
    }
    if (mapLocationY == 7 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 7 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inFishableArea = false;

        playMusic('forest_area')
    }
    if (mapLocationY == 7 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = false;

        playMusic('forest_area')
    }

    // Y: 8
    // if(mapLocationY == 8 && mapLocationX == 0){

    // }
    // if(mapLocationY == 8 && mapLocationX == 1){

    // }
    if (mapLocationY == 8 && mapLocationX == 2) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 8 && mapLocationX == 3) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 8 && mapLocationX == 4) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = true;
        inForest = false;

        currentMusic = bgm_grasslands;
        playMusic('grasslands_area')
    }
    if (mapLocationY == 8 && mapLocationX == 5) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 8 && mapLocationX == 6) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 8 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 8 && mapLocationX == 8) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        playMusic('forest_area')
    }
    if (mapLocationY == 8 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = true;

        inCampsite = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 8 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        inCampsite = false;

        playMusic('forest_area')
    }

    // Y: 9
    // if(mapLocationY == 9 && mapLocationX == 0){

    // }
    // if(mapLocationY == 9 && mapLocationX == 1){

    // }
    if (mapLocationY == 9 && mapLocationX == 2) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        playMusic('grasslands_area')
    }
    if (mapLocationY == 9 && mapLocationX == 3) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = true;
        inForest = false;

        currentMusic = bgm_grasslands;
        playMusic('grasslands_area')
    }
    if (mapLocationY == 9 && mapLocationX == 4) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        inGrasslands = false;
        inForest = true;

        currentMusic = bgm_forest;
        playMusic('forest_area')
    }
    if (mapLocationY == 9 && mapLocationX == 5) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 9 && mapLocationX == 6) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 9 && mapLocationX == 7) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = true;
        canGoRight = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 9 && mapLocationX == 8) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        playMusic('forest_area')
    }
    if (mapLocationY == 9 && mapLocationX == 9) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        inCampsite = false;

        playMusic('forest_area')
    }
    if (mapLocationY == 9 && mapLocationX == 10) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        playMusic('forest_area')
    }

    // Y: 10
    if (mapLocationY == 10 && mapLocationX == 0) {
        canGoUp = true;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = true;

        areaHasRandomEncounters = false;

        adventureText = "You have found a hidden oasis" + (hasDesertRose || hasSilverKey ? "!" : "! There is a rare desert rose growing here!")

        if (!hasDesertRose || !hasSilverKey) {
            areaHasWorldItem = true;
            worldItem = 'imgs/world_items/DesertRose_WorldItem.png'
        }
        if (hasDesertRose || hasSilverKey) {
            areaHasWorldItem = false;
        }

        lostInDesertNorth = false;
        lostInDesertSouth = false;
        lostInDesertEast = false;
        lostInDesertWest = false;

        nextStepOasis = false;
        inOasis = true;

        playMusic('desert_area')
    }
    // if(mapLocationY == 10 && mapLocationX == 1){

    // }
    // if(mapLocationY == 10 && mapLocationX == 2){

    // }
    // if(mapLocationY == 10 && mapLocationX == 3){

    // }
    // if(mapLocationY == 10 && mapLocationX == 4){

    // }
    if (mapLocationY == 10 && mapLocationX == 5) {
        canGoUp = false;
        canGoDown = false;
        canGoLeft = false;
        canGoRight = false;

        areaHasRandomEncounters = false;
        inCampsite = true;
    }
    // if(mapLocationY == 10 && mapLocationX == 6){

    // }
    // if(mapLocationY == 10 && mapLocationX == 7){

    // }
    // if(mapLocationY == 10 && mapLocationX == 8){

    // }
    if (mapLocationY == 10 && mapLocationX == 9) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = false;
        canGoRight = true;

        playMusic('forest_area')
    }
    if (mapLocationY == 10 && mapLocationX == 10) {
        canGoUp = false;
        canGoDown = true;
        canGoLeft = true;
        canGoRight = false;

        playMusic('forest_area')
    }

    changeLocation();

    if (areaHasRandomEncounters) {
        encounterChance = Math.floor(Math.random() * (10 - 1) + 1);
        if (encounterChance == 5) {
            enterBattle();
        }
    }
}

function changeLocation() {
    if (doorUnlocked) {
        worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}` + `-unlocked` + `.png)"`
    }
    else {
        worldBackground = `style="background-image: url(imgs/TB_Map/${mapLocationY}-${mapLocationX}.png)"`
    }
}

function statusBars() {

    if (playerHealth > (0.5 * playerMaxHealth)) {
        healthBarColor = 'lightgreen'
    }
    if (playerHealth > (0.25 * playerMaxHealth) && playerHealth <= (0.5 * playerMaxHealth)) {
        healthBarColor = 'yellow'
    }
    if (playerHealth <= (0.25 * playerMaxHealth)) {
        healthBarColor = 'red'
    }

    if (playerEnergy > (0.5 * playerMaxEnergy)) {
        energyBarColor = 'lightgreen'
    }
    if (playerEnergy > (0.25 * playerMaxEnergy) && playerEnergy <= (0.5 * playerMaxEnergy)) {
        energyBarColor = 'yellow'
    }
    if (playerEnergy <= (0.25 * playerMaxEnergy)) {
        energyBarColor = 'red'
    }

    if (enemyHealth > (0.5 * enemyMaxHealth)) {
        enemyHealthBarColor = 'lightgreen'
    }
    if (enemyHealth > (0.25 * enemyMaxHealth) && enemyHealth <= (0.5 * enemyMaxHealth)) {
        enemyHealthBarColor = 'yellow'
    }
    if (enemyHealth <= (0.25 * enemyMaxHealth)) {
        enemyHealthBarColor = 'red'
    }
}


function BGM(area) {
    clearInterval(fadeInInterval);
    clearInterval(fadeOutInterval);

    if (muted) {
        return;
    }

    else if (!muted) {

        if (area == 'grasslands') {
            if (!bgm_grasslands.paused) {
                bgm_grasslands.pause();
                bgm_grasslands.currentTime = 0;
            }
            bgm_grasslands.loop = true;
            bgm_grasslands.play();
            fadeInInterval = setInterval(function () { audioFadeIn('grasslands') }, 200);
            if (bgm_forest.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('forest') }, 200);
            }
            if (bgm_desert.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('desert') }, 200);
            }
            if (bgm_cave.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('cave') }, 200);
            }

        }
        else if (area == 'forest') {
            if (!bgm_forest.paused) {
                bgm_forest.pause();
                bgm_forest.currentTime = 0;
            }
            bgm_forest.loop = true;
            bgm_forest.play();
            fadeInInterval = setInterval(function () { audioFadeIn('forest') }, 200);
            if (bgm_grasslands.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('grasslands') }, 200);
            }
            if (bgm_desert.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('desert') }, 200);
            }
            if (bgm_cave.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('cave') }, 200);
            }
        }
        else if (area == 'desert') {
            if (!bgm_desert.paused) {
                bgm_desert.pause();
                bgm_desert.currentTime = 0;
            }
            bgm_desert.loop = true;
            bgm_desert.play();
            fadeInInterval = setInterval(function () { audioFadeIn('desert') }, 200);
            if (bgm_grasslands.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('grasslands') }, 200);
            }
            if (bgm_forest.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('forest') }, 200);
            }
            if (bgm_cave.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('cave') }, 200);
            }
        }
        else if (area == 'cave') {
            if (!bgm_cave.paused) {
                bgm_cave.pause();
                bgm_cave.currentTime = 0;
            }
            bgm_cave.loop = true;
            bgm_cave.play();
            fadeInInterval = setInterval(function () { audioFadeIn('cave') }, 200);
            if (bgm_grasslands.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('grasslands') }, 200);
            }
            if (bgm_desert.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('desert') }, 200);
            }
            if (bgm_forest.volume > 0.1) {
                fadeOutInterval = setInterval(function () { audioFadeOut('forest') }, 200);
            }
        }
    }


}

function audioFadeIn(area) {
    if (area == 'grasslands') {
        if (bgm_grasslands.volume < 0.3) {
            bgm_grasslands.volume += 0.05;
        }
        if (bgm_grasslands.volume >= 0.3) {
            clearInterval(fadeInInterval);
        }
    }
    if (area == 'forest') {
        if (bgm_forest.volume < 0.3) {
            bgm_forest.volume += 0.05;
        }
        if (bgm_forest.volume >= 0.3) {
            clearInterval(fadeInInterval);
        }
    }
    if (area == 'desert') {
        if (bgm_desert.volume < 0.3) {
            bgm_desert.volume += 0.05;
        }
        if (bgm_desert.volume >= 0.3) {
            clearInterval(fadeInInterval);
        }
    }
    if (area == 'cave') {
        if (bgm_cave.volume < 0.3) {
            bgm_cave.volume += 0.05;
        }
        if (bgm_cave.volume >= 0.3) {
            clearInterval(fadeInInterval);
        }
    }
}

function audioFadeOut(area) {
    if (area == 'grasslands' || area == 'campsite') {
        if (bgm_grasslands.volume > 0.1) {
            bgm_grasslands.volume -= 0.05;
        }
        if (bgm_grasslands.volume <= 0.1) {
            clearInterval(fadeOutInterval);
            bgm_grasslands.volume = 0.0;
            bgm_grasslands.pause();
            bgm_grasslands.currentTime = 0;
        }
    }
    if (area == 'forest') {
        if (bgm_forest.volume > 0.1) {
            bgm_forest.volume -= 0.05;
        }
        if (bgm_forest.volume <= 0.1) {
            clearInterval(fadeOutInterval);
            bgm_forest.volume = 0.0;
            bgm_forest.pause();
            bgm_forest.currentTime = 0;
        }
    }
    if (area == 'desert') {
        if (bgm_desert.volume > 0.1) {
            bgm_desert.volume -= 0.05;
        }
        if (bgm_desert.volume <= 0.1) {
            clearInterval(fadeOutInterval);
            bgm_desert.volume = 0.0;
            bgm_desert.pause();
            bgm_desert.currentTime = 0;
        }
    }
    if (area == 'cave') {
        if (bgm_cave.volume > 0.1) {
            bgm_cave.volume -= 0.05;
        }
        if (bgm_cave.volume <= 0.1) {
            clearInterval(fadeOutInterval);
            bgm_cave.volume = 0.0;
            bgm_cave.pause();
            bgm_cave.currentTime = 0;
        }
    }

}

function muteAudio() {
    muted = !muted;
    if (muted) {
        bgm_grasslands.volume = 0;
        bgm_forest.volume = 0;
        bgm_desert.volume = 0;
        bgm_cave.volume = 0;

        coinsAudio.volume = 0;
        unlockAudio.volume = 0;
        eatAudio.volume = 0;
        drinkAudio.volume = 0;
        goatAudio.volume = 0;
        pickUpAudio.volume = 0;
        fishingAudio.volume = 0;
    }
    else if (!muted) {
        bgm_grasslands.volume = 0.0001;
        bgm_forest.volume = 0.0001;
        bgm_desert.volume = 0.0001;
        bgm_cave.volume = 0.0001;


        coinsAudio.volume = 1;
        unlockAudio.volume = 1;
        eatAudio.volume = 1;
        drinkAudio.volume = 1;
        goatAudio.volume = 1;
        pickUpAudio.volume = 1;
        fishingAudio.volume = 1;

        currentMusic.volume = 0.3;
        currentMusic.play();
    }
}

function playMusic(music) {

    if (music == 'grasslands_area' && bgm_grasslands.volume <= 0.050) {
        clearInterval(fadeInInterval)
        clearInterval(fadeOutInterval)
        BGM('grasslands');
    }
    else if (music == 'forest_area' && bgm_forest.volume <= 0.050) {
        clearInterval(fadeInInterval)
        clearInterval(fadeOutInterval)
        BGM('forest');
    }
    else if (music == 'desert_area' && bgm_desert.volume <= 0.050) {
        clearInterval(fadeInInterval)
        clearInterval(fadeOutInterval)
        BGM('desert');
    }
    else if (music == 'cave_area' && bgm_cave.volume <= 0.050) {
        clearInterval(fadeInInterval)
        clearInterval(fadeOutInterval)
        BGM('cave');
    }
}
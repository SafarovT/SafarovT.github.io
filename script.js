var LAVA = {
    width: 300,
    height: 300,
    x: 100,
    y: 0,
    background: new Image(),
}

var CHARACTER = {
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    xMove: 0,
    yMove: 0,

    equipment: '',
    hpMax: 20,
    hp: 20,
    dmg: 4,
    dmgAdd: 5,
    def: 10,
    aim: 2,
    distance: 1,

    outfit: new Image(),
}

var WARRIOR = {
    width: 100,
    height: 100,
    x: 800,
    y: 300,
    xMove: 0,
    yMove: 0,

    hpMax: 9,
    hp: 9,
    dmg: 4,
    def: 12,
    aim: -1,
    distance: 1,

    outfit: new Image(),
    str: "Воин",
}

var HEALER = {
    width: 100,
    height: 100,
    x: 1000,
    y: 200,

    hpMax: 3,
    hp: 3,
    heal: 2,
    def: 6,

    outfit: new Image(),
    str: "Лекарь"
}

var ARCHER = {
    width: 100,
    height: 100,
    x: 1000,
    y: 400,

    hpMax: 4,
    hp: 4,
    dmg: 2,
    def: 8,
    aim: 2,
    distance: 3,

    outfit: new Image(),
    str: "Лучник",
}

var DRAGON = {
    width: 300,
    height: 300,
    x: 900,
    y: 300,
    xMove: 0,
    yMove: 0,

    hpMax: 200, 
    hp: 200,
    dmg: 40,
    def: 25,
    aim: 8,
    distance: 3,
    
    outfit: new Image(),
    str: "Дракон",
}

var GAME = {
    width: 1200,
    height: 700,
    canvasContext: null,
    background: new Image(),
    enemies: [WARRIOR, HEALER, ARCHER],
    fight: false,
    report: '',
    stage: 'game',
	log: true,
}

var SHOPKEEPER = {
    width: 100,
    height: 100,

    x: 0,
    y: 600,

    outfit: new Image(),
}

var STORE = {
    width: 1200,
    height: 700,

    background: new Image(),
}

function rollDice(max) {
    min = 1;
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function init() {
    GAME.background.src = "img/background.png";
    LAVA.background.src = "img/lava.png";
    STORE.background.src = "img/store.png";

    CHARACTER.outfit.src = "img/default_outfit.png";
    WARRIOR.outfit.src = "img/warrior.png";
    HEALER.outfit.src = "img/healer.png";
    ARCHER.outfit.src = "img/archer.png";
    SHOPKEEPER.outfit.src = "img/shopkeeper.png";
    DRAGON.outfit.src = "img/dragon.png";

    var canvas = document.getElementById("canvas");
    _initCanvas(canvas);
    _initEventsListeners(canvas);

    GAME.background.onload = function () {
        play();
    }
}

function play() {
    draw();
}

function draw() {
    GAME.canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    if (GAME.stage == 'game') {
        GAME.canvasContext.drawImage(GAME.background, 0, 0, GAME.width, GAME.height);
    }
    GAME.canvasContext.drawImage(LAVA.background, LAVA.x, LAVA.y, LAVA.width, LAVA.height * 2 + 100);
    
    if (!GAME.fight && CHARACTER.equipment == '') {
        GAME.canvasContext.drawImage(SHOPKEEPER.outfit, SHOPKEEPER.x, SHOPKEEPER.y, SHOPKEEPER.width, SHOPKEEPER.height);
    }
    GAME.canvasContext.drawImage(CHARACTER.outfit, CHARACTER.x, CHARACTER.y, CHARACTER.width, CHARACTER.height);
    for (let i = 0; i < GAME.enemies.length; i++) {
        if (GAME.enemies[i] == DRAGON) {
            GAME.canvasContext.drawImage(GAME.enemies[i].outfit, GAME.enemies[i].x - 100, GAME.enemies[i].y - 100, GAME.enemies[i].width, GAME.enemies[i].height);
        }
        else
        {
            GAME.canvasContext.drawImage(GAME.enemies[i].outfit, GAME.enemies[i].x, GAME.enemies[i].y, GAME.enemies[i].width, GAME.enemies[i].height);
        }
    }   
    if (!GAME.fight && CHARACTER.equipment == '' && CHARACTER.x == SHOPKEEPER.x && CHARACTER.y == SHOPKEEPER.y) {
        GAME.canvasContext.drawImage(STORE.background, 0, 0, STORE.width, STORE.height);
    }
    if (GAME.stage == 'final') {
        GAME.canvasContext.drawImage(GAME.background, 0, 0, GAME.width, GAME.height);
    }
}

function update() {
    let xCharacterMove = CHARACTER.x + CHARACTER.xMove;
    let yCharacterMove = CHARACTER.y + CHARACTER.yMove;
	
	if(GAME.stage == 'game') {
		if (checkCollision(CHARACTER)) {
			CHARACTER.xMove = 0;
			CHARACTER.yMove = 0;
		}
	
		for (let i = 0; i < GAME.enemies.length; i++) {
			if ((xCharacterMove == GAME.enemies[i].x) && (yCharacterMove == GAME.enemies[i].y)) {
				fight(GAME.enemies[i]);
			}
		}

		CHARACTER.x += CHARACTER.xMove;
		CHARACTER.y += CHARACTER.yMove;

		if (CHARACTER.x >= 500)
		{
			GAME.fight = true;
		}
	}

    if (GAME.fight) {
        enemyTurn();  
    }

    switchPhase();

    play();
}

function restartGame() {
    window.location.reload();
}

function switchPhase() {
    if (WARRIOR.hp <= 0 && HEALER.hp <= 0 && ARCHER.hp <= 0 && GAME.enemies[0] != DRAGON && DRAGON.hp > 0 && GAME.stage == "game") {
        GAME.enemies.push(DRAGON);
        GAME.fight = false;
        CHARACTER.x = 0;
        CHARACTER.y = 300;
        CHARACTER.hp = CHARACTER.hpMax;
        GAME.background.src = "img/final_background.png";
        alert('Вы успешно расправились с каждым из противников в этой комнате, как вдруг от грохота прогнившие доски под вами проваливаются и вы падаете на этаж ниже. Он выглядит в точности как этот, только потолки в несколько раз выше.\nВ темной комнате вы видите разъяренного дракона. Впрочем вам повезло, он вас пока не заметил. Его глаза потеряли возможность видеть за долгое нахождение здесь. Вы же понимаете, что вам такое не грозит, так как вы уже чувствутете ветерок снаружи, и затхлость в воздухе начинает постепенно пропадать.\nТак же вы нашли склянку с лечебным зельем, испив которое, излечили свои раны.');
    }
    if (CHARACTER.x == 0 && CHARACTER.y == 0 && GAME.enemies[0] == DRAGON && GAME.stage == "game") {
        GAME.stage = 'final';
        GAME.background.src = "img/outdoor_background.png";
        draw();
        alert('Поздравляю, тебе удалось выйти из этого ужасного подземелья, теперь перед тобой открыт весь мир, но это уже совсем другая история.');
        setTimeout(restartGame, 2500);
    }
    if (DRAGON.hp == 0 && GAME.stage == "game") {
        GAME.stage = 'final';
        GAME.background.src = "img/dungeon_background.png";
        draw();
        alert('Ты - поистине великий герой, ну или скорее очень везучий. Что-ж, поздовляю, теперь ты волен делать с этим подземельем все, что захочешь, но это уже совсем другая история.');
        setTimeout(restartGame, 5000);
    }
}

function enemyTurn() {
    GAME.report = 'В этом ходу: \n';
    for (let i = 0; i < GAME.enemies.length; i++) {
        if (GAME.enemies[i] == WARRIOR || GAME.enemies[i] == DRAGON) {
            GAME.enemies[i].xMove = 0;
            GAME.enemies[i].yMove = 0;
            if (near(GAME.enemies[i], CHARACTER)) {
                attack(GAME.enemies[i], CHARACTER);
            }
            else {
                generateBotDirection(GAME.enemies[i]); 
            }
            GAME.enemies[i].x += GAME.enemies[i].xMove;
            GAME.enemies[i].y += GAME.enemies[i].yMove;
        }
        if (GAME.enemies[i] == HEALER) {
           heal(); 
        }
        if (GAME.enemies[i] == ARCHER && near(ARCHER, CHARACTER)) {
            attack(ARCHER, CHARACTER);
        }
    }
    if (CHARACTER.hp <= 0) {
        GAME.stage = 'final';
        GAME.background.src = "img/death_background.png";
        draw();
        if (GAME.enemies[0] == DRAGON) {
            alert('Ну... вы умерли. Чего еще вы ожидали нападая на дракона? Геройской славы? Что-ж, видимо не в этот раз.');
        }
        else {            
            alert('Вы чувствуете боль где-то в груди, конечности начинают неметь и вы падаете навзничь. Перед смертью вы видите лишь вечно мокрый, весь в плесени, потолок подземелья.\nИгра окончена.');
        }
        setTimeout(restartGame, 5000);
    }
    else {
		if(GAME.log) {
			alert(GAME.report + 'Здоровье вашего персонажа после этого хода = ' + CHARACTER.hp);
		}
	}
}

function heal() {
    let restored = 0;
    if (HEALER.hp < HEALER.hpMax) {
        restored = rollDice(HEALER.heal);
        HEALER.hp += restored;
        if (HEALER.hp > HEALER.hpMax) {
            HEALER.hp = HEALER.hpMax;
            GAME.report += HEALER.str + ' исцелил все свои раны одним мощным заклинанием\n';
        }
        else {
            GAME.report += HEALER.str + ' восстановил исцелил часть своих ран\n';
        }
    }
    else if (WARRIOR.hp < WARRIOR.hpMax && GAME.enemies.indexOf(WARRIOR) != -1) {
        restored = rollDice(HEALER.heal);
        WARRIOR.hp += restored;
        if (WARRIOR.hp > WARRIOR.hpMax) {
            WARRIOR.hp = WARRIOR.hpMax;
            GAME.report += HEALER.str + ' исцелил все раны воина одним мощным заклинанием\n';
        }
        else { 
            GAME.report += HEALER.str + ' восстановил исцелил воину часть его ран\n'; 
        }
    }
    else if (ARCHER.hp < ARCHER.hpMax && GAME.enemies.indexOf(ARCHER) != -1) {
        restored = rollDice(HEALER.heal);
        ARCHER.hp += restored;
        if (ARCHER.hp > ARCHER.hpMax) {
            ARCHER.hp = ARCHER.hpMax;
            GAME.report += HEALER.str + ' исцелил все раны лучника одним мощным заклинанием\n';
        }
        else { 
            GAME.report += HEALER.str + ' восстановил исцелил лучнику часть его ран\n';
        }
    }
    if (restored == 0) {
        GAME.report += HEALER.str + ' бездействовал на этом ходу, лишь наблюдая за ходом боя\n';
    }
}

function near(attacking, target) {
    return ((target.x >= attacking.x - attacking.distance * 100) && (target.x <= attacking.x + attacking.distance * 100)) &&
        ((target.y >= attacking.y - attacking.distance * 100) && (target.y <= attacking.y + attacking.distance * 100))
}

function generateBotDirection(bot) {
    if (rollDice(2) == 1) {
        if (bot.x > CHARACTER.x) { bot.xMove = -100 }
        else if (bot.x < CHARACTER.x) { bot.xMove = 100 }
        else if (bot.y > CHARACTER.y) { bot.yMove = -100 }
        else { bot.yMove = 100 }
    }
    else {
        if (bot.y > CHARACTER.y) { bot.yMove = -100 }
        else if (bot.y < CHARACTER.y) { bot.yMove = 100 }
        else if (bot.x > CHARACTER.x) { bot.xMove = -100 }
        else { bot.xMove = 100 }
    }
    if (checkCollision(bot)) {
        bot.yMove = 0;
        bot.xMove = 0;
    }
}

function checkCollision(object) {
    let xObjectMove = object.x + object.xMove;
    let yObjectMove = object.y + object.yMove;
    let withBarriers = xObjectMove < 0 ||
        xObjectMove >= GAME.width ||
        yObjectMove < 0 ||
        yObjectMove >= GAME.height ||
        (xObjectMove >= LAVA.x && (object.y < LAVA.height || object.y >= LAVA.height + 100) && (xObjectMove < LAVA.x + LAVA.width)) ||
        ((yObjectMove < LAVA.height || yObjectMove >= LAVA.height + 100) && (object.x < LAVA.x + LAVA.width && object.x >= LAVA.x));
    let withCreatures = false;
    for (let i = 0; i < GAME.enemies.length; i++) {
        if ((xObjectMove == GAME.enemies[i].x) && (yObjectMove == GAME.enemies[i].y)) {
            withCreatures = true;
        }
    }
    return withCreatures || withBarriers

}

function fight(enemy) {
    let result = rollDice(20);
    let dmg = 0;
    if (result + CHARACTER.aim >= enemy.def && result != 20) {
        result += CHARACTER.aim;
        dmg = rollDice(CHARACTER.dmg) + CHARACTER.dmgAdd;
        enemy.hp -= dmg;
    }
    if (result == 20) {
        dmg = (rollDice(CHARACTER.dmg) + CHARACTER.dmgAdd)* 2;
        enemy.hp -= dmg;
    }
		if (dmg == 0) {
			if (GAME.log) {alert('Выкинув ' + result + ', вы промахнулись своей атакой.');}
		}
		else if (enemy.hp <= 0) {
			GAME.enemies.splice(GAME.enemies.indexOf(enemy), 1);
			if (GAME.log) {alert('Вы сразили противника своим мощным ударом.');}
		}
		else if (result == 20) {
			if (GAME.log) {alert('Вы выкинули 20, это критический успех: вы наносите двойной урон (' + dmg + ').');}
		}
		else {
			if (GAME.log) {alert('Вы попали по противнику, выкинув ' + result + ', и нанесли ' + dmg + ' урона.');}
		}
}

function attack(attacking, defending) {
    let result = rollDice(20);
    let dmg = 0;
    if (result + attacking.aim >= defending.def && result != 20) {
        result += attacking.aim;
        dmg = rollDice(attacking.dmg);
        defending.hp -= dmg;
    }
    if (result == 20) {
        dmg = rollDice(attacking.dmg) * 2;
        defending.hp -= dmg;
    }
    
    if (dmg == 0) {
        GAME.report += 'Выкинув ' + result + ', ' + attacking.str + ' промахнулся своей атакой.\n';
    }
    else if (result == 20) {
        GAME.report += attacking.str + ' выкинул 20, это критический успех: вы получайте двойной урон (' + dmg + ').\n';
    }
    else {
        GAME.report += attacking.str + ' попал по вам, выкинув ' + result + ', и нанес ' + dmg + ' урона.\n';
    }
}

function _initCanvas(canvas) {
    canvas.width = GAME.width;
    canvas.height = GAME.height;
    GAME.canvasContext = canvas.getContext("2d");
}

function _initEventsListeners(canvas) {
    document.addEventListener("keydown", _onDocumentKeyDown);
}

function _onDocumentKeyDown(event) {
    CHARACTER.xMove = 0;
    CHARACTER.yMove = 0;
    if (event.key == "ArrowUp") {
        CHARACTER.yMove = -100; update();
    }
    else if (event.key == "ArrowDown") {
        CHARACTER.yMove = 100; update();
    }
    else if (event.key == "ArrowLeft") {
        CHARACTER.xMove = -100; update();
    }
    else if (event.key == "ArrowRight") {
        CHARACTER.xMove = 100; update();
    }
    if (!GAME.fight && CHARACTER.equipment == '' && CHARACTER.x == SHOPKEEPER.x && CHARACTER.y == SHOPKEEPER.y) {
        if (event.key == "1") {
            CHARACTER.equipment = 'iron sword';
            CHARACTER.dmgAdd += 5;
            CHARACTER.outfit.src = "img/strength_outfit.png";
	    draw();
            update();
        }
        else if (event.key == "2") {
            CHARACTER.equipment = 'armor';
            CHARACTER.def += 5;
            CHARACTER.outfit.src = "img/armored_outfit.png";
	    draw();
            update();
        }
        else if (event.key == "3") {
            CHARACTER.equipment = 'elf sword';
            CHARACTER.aim += 5;
            CHARACTER.outfit.src = "img/agility_outfit.png";
	    draw();
            update();
        }
	}
	if (event.key == "Control" && !GAME.fight)
	{
		if (GAME.log) {
			GAME.log = false;
		}
		else {
			GAME.log = true;
		}		
    }
}

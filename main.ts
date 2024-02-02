namespace SpriteKind {
    export const spawner = SpriteKind.create()
    export const burner = SpriteKind.create()
    export const projectile2 = SpriteKind.create()
    export const Boss = SpriteKind.create()
    export const projectile3 = SpriteKind.create()
}
namespace StatusBarKind {
    export const stamina = StatusBarKind.create()
}
mp.onButtonEvent(mp.MultiplayerButton.Right, ControllerButtonEvent.Released, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        currentPlayer = 0
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        currentPlayer = 1
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        currentPlayer = 2
    } else {
        currentPlayer = 3
    }
    animationHandler(mp.getPlayerSprite(player2), false, currentPlayer, 3, animationSpeed)
})
// Sprites and Sprite animations are all by Makecode Arcade by Microsoft
function setUpEnemy (_type: number, posX: number, posY: number) {
    if (_type == 0) {
        enemySprite = sprites.create(assets.image`myImage0`, SpriteKind.Enemy)
        sprites.setDataNumber(enemySprite, "health", 50)
        sprites.setDataNumber(enemySprite, "speed", 15)
        sprites.setDataNumber(enemySprite, "level", 5)
    } else if (_type == 1) {
        enemySprite = sprites.create(assets.image`myImage`, SpriteKind.Enemy)
        sprites.setDataNumber(enemySprite, "health", 100)
        sprites.setDataNumber(enemySprite, "speed", 30)
        sprites.setDataNumber(enemySprite, "level", 15)
    } else if (_type == 2) {
        enemySprite = sprites.create(assets.image`Enemy3`, SpriteKind.Enemy)
        sprites.setDataNumber(enemySprite, "health", 150)
        sprites.setDataNumber(enemySprite, "speed", 45)
        sprites.setDataNumber(enemySprite, "level", 20)
    }
    enemySprite.setPosition(posX, posY)
}
mp.onButtonEvent(mp.MultiplayerButton.Left, ControllerButtonEvent.Released, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        currentPlayer = 0
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        currentPlayer = 1
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        currentPlayer = 2
    } else {
        currentPlayer = 3
    }
    animationHandler(mp.getPlayerSprite(player2), false, currentPlayer, 2, animationSpeed)
})
function spawnItemSpawners () {
    for (let itemSpawnerLocations of tiles.getTilesByType(assets.tile`myTile26`)) {
        setUpPowerUpSpawners(itemSpawnerLocations.x, itemSpawnerLocations.y, randint(2, 4))
    }
}
// Multiplayer Extension by Microsoft Makecode Arcade
mp.onControllerEvent(ControllerEvent.Connected, function (player2) {
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    playerArray = mp.allPlayers()
    mp.setPlayerSprite(player2, playerSpriteList[spriteIndex])
    spriteIndex += 1
    mp.setPlayerState(player2, MultiplayerState.life, 3)
    mp.setPlayerState(mp.playerSelector(mp.PlayerNumber.One), MultiplayerState.score, 0)
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        mp.getPlayerSprite(player2).setPosition(250, 825)
    } else {
        mp.getPlayerSprite(player2).setPosition(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y)
    }
    sprites.setDataBoolean(mp.getPlayerSprite(player2), "canAttk", true)
    // Sprite Data Extension By Microsoft Makecode Arcade
    sprites.setDataNumber(mp.getPlayerSprite(player2), "projDirX", 1)
    sprites.setDataNumber(mp.getPlayerSprite(player2), "projDirY", 1)
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        scene.cameraFollowSprite(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)))
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        scene.cameraFollowSprite(null)
        // Split Screen Extension by riknoll
        splitScreen.setSplitScreenEnabled(true)
        splitScreen.cameraFollowSprite(splitScreen.Camera.Camera1, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)))
        splitScreen.cameraFollowSprite(splitScreen.Camera.Camera2, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)))
        splitScreen.setCameraRegion(splitScreen.Camera.Camera1, splitScreen.CameraRegion.VerticalLeftHalf)
        splitScreen.setCameraRegion(splitScreen.Camera.Camera2, splitScreen.CameraRegion.VerticalRightHalf)
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        splitScreen.cameraFollowSprite(splitScreen.Camera.Camera3, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Three)))
        splitScreen.setCameraRegion(splitScreen.Camera.Camera1, splitScreen.CameraRegion.TopLeft)
        splitScreen.setCameraRegion(splitScreen.Camera.Camera2, splitScreen.CameraRegion.TopRight)
        splitScreen.setCameraRegion(splitScreen.Camera.Camera3, splitScreen.CameraRegion.BottomLeft)
    } else {
        splitScreen.cameraFollowSprite(splitScreen.Camera.Camera4, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)))
        splitScreen.setCameraRegion(splitScreen.Camera.Camera1, splitScreen.CameraRegion.TopLeft)
        splitScreen.setCameraRegion(splitScreen.Camera.Camera2, splitScreen.CameraRegion.TopRight)
        splitScreen.setCameraRegion(splitScreen.Camera.Camera3, splitScreen.CameraRegion.BottomLeft)
        splitScreen.setCameraRegion(splitScreen.Camera.Camera4, splitScreen.CameraRegion.BottomRight)
    }
    startFollow = true
})
function setUpCombatVars () {
    canHurtPlayers = true
    projectileSpeedConst = 5
    meleeHitRange = 37.5
    enemySight = 125
    meleeCooldown = 2500
    rangedCooldown = 1500
    summonCondition = randint(3000, 10000)
}
mp.onButtonEvent(mp.MultiplayerButton.A, ControllerButtonEvent.Pressed, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.Two) || player2 == mp.playerSelector(mp.PlayerNumber.Four)) {
        if (sprites.readDataBoolean(mp.getPlayerSprite(player2), "canAttk")) {
            projectile = sprites.createProjectileFromSprite(assets.image`myImage1`, mp.getPlayerSprite(player2), sprites.readDataNumber(mp.getPlayerSprite(player2), "projDirX") * projectileSpeedConst, sprites.readDataNumber(mp.getPlayerSprite(player2), "projDirY") * projectileSpeedConst)
            projectile.setFlag(SpriteFlag.AutoDestroy, false)
            music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
            sprites.setDataBoolean(mp.getPlayerSprite(player2), "canAttk", false)
            // Timer Extension by Microsoft Makecode
            // 
            timer.after(rangedCooldown, function () {
                sprites.setDataBoolean(mp.getPlayerSprite(player2), "canAttk", true)
            })
        }
    }
    if (player2 == mp.playerSelector(mp.PlayerNumber.One) || player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        if (sprites.readDataBoolean(mp.getPlayerSprite(player2), "canAttk")) {
            music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground)
            for (let index = 0; index < 25; index++) {
                mp.getPlayerSprite(player2).startEffect(effects.fire, 100)
            }
            for (let enemiesArray of sprites.allOfKind(SpriteKind.Enemy)) {
                if (distance(mp.getPlayerSprite(player2), enemiesArray) < meleeHitRange) {
                    sprites.destroy(enemiesArray, effects.spray, 100)
                    mp.changePlayerStateBy(player2, MultiplayerState.score, 100 * mp.getPlayerState(player2, MultiplayerState.life))
                }
            }
            if (bossCanAttack || bossStunned) {
                if (distance(mp.getPlayerSprite(player2), Florczak) < meleeHitRange) {
                    statusbar.value += -20
                    mp.changePlayerStateBy(player2, MultiplayerState.score, 100 * mp.getPlayerState(player2, MultiplayerState.life))
                }
            }
            sprites.setDataBoolean(mp.getPlayerSprite(player2), "canAttk", false)
            // Timer Extension by Microsoft Makecode
            // 
            timer.after(meleeCooldown, function () {
                sprites.setDataBoolean(mp.getPlayerSprite(player2), "canAttk", true)
            })
            summonBoss()
        }
    }
})
function sprintfunction2 (sprite: Sprite) {
    if (sprintBar2.value > 0) {
        sprintBar2.attachToSprite(sprite, 5, 0)
        sprintBar2.setColor(4, 5)
        statEffect2 = true
    }
}
function setUpPowerUpSpawners (spawnerX: number, spawnerY: number, numOfPowerups: number) {
    spawnerSprite = sprites.create(assets.image`EnemyGrass4S`, SpriteKind.spawner)
    spawnerSprite.setPosition(spawnerX, spawnerY)
    for (let index = 0; index < numOfPowerups; index++) {
        sprites.setDataNumber(spawnerSprite, "radius", randint(25, 50))
        sprites.setDataNumber(spawnerSprite, "angle", randint(0, 360))
        sprites.setDataNumber(spawnerSprite, "spawnItemType", randint(0, 2))
        sprites.setDataNumber(spawnerSprite, "spriteX", spawnerSprite.x + sprites.readDataNumber(spawnerSprite, "radius") * Math.cos(sprites.readDataNumber(spawnerSprite, "angle")))
        sprites.setDataNumber(spawnerSprite, "spriteY", spawnerSprite.y + sprites.readDataNumber(spawnerSprite, "radius") * Math.sin(sprites.readDataNumber(spawnerSprite, "angle")))
        burnerSprite.setPosition(sprites.readDataNumber(spawnerSprite, "spriteX"), sprites.readDataNumber(spawnerSprite, "spriteY"))
        // Tilemaps are by Microsoft makecode ARcade
        while (tiles.tileAtLocationIsWall(tiles.getTileLocation(burnerSprite.tilemapLocation().column, burnerSprite.tilemapLocation().row))) {
            sprites.setDataNumber(spawnerSprite, "radius", randint(25, 50))
            sprites.setDataNumber(spawnerSprite, "angle", randint(0, 360))
            sprites.setDataNumber(spawnerSprite, "spriteX", spawnerSprite.x + sprites.readDataNumber(spawnerSprite, "radius") * Math.cos(sprites.readDataNumber(spawnerSprite, "angle")))
            sprites.setDataNumber(spawnerSprite, "spriteY", spawnerSprite.y + sprites.readDataNumber(spawnerSprite, "radius") * Math.sin(sprites.readDataNumber(spawnerSprite, "angle")))
            burnerSprite.setPosition(sprites.readDataNumber(spawnerSprite, "spriteX"), sprites.readDataNumber(spawnerSprite, "spriteY"))
        }
        setUpPowerups(sprites.readDataNumber(spawnerSprite, "spawnItemType"), sprites.readDataNumber(spawnerSprite, "spriteX"), sprites.readDataNumber(spawnerSprite, "spriteY"))
    }
}
mp.onButtonEvent(mp.MultiplayerButton.Down, ControllerButtonEvent.Released, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        currentPlayer = 0
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        currentPlayer = 1
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        currentPlayer = 2
    } else {
        currentPlayer = 3
    }
    animationHandler(mp.getPlayerSprite(player2), false, currentPlayer, 1, animationSpeed)
})
function initializeSpritesList () {
    playerSpriteList = [
    sprites.create(img`
        . . . . f f f f . . . . . 
        . . f f f f f f f f . . . 
        . f f f f f f c f f f . . 
        f f f f f f c c f f f c . 
        f f f c f f f f f f f c . 
        c c c f f f e e f f c c . 
        f f f f f e e f f c c f . 
        f f f b f e e f b f f f . 
        . f 4 1 f 4 4 f 1 4 f . . 
        . f e 4 4 4 4 4 4 e f . . 
        . f f f e e e e f f f . . 
        f e f b 7 7 7 7 b f e f . 
        e 4 f 7 7 7 7 7 7 f 4 e . 
        e e f 6 6 6 6 6 6 f e e . 
        . . . f f f f f f . . . . 
        . . . f f . . f f . . . . 
        `, SpriteKind.Player),
    sprites.create(img`
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f c c c c 4 4 c c c c f . 
        . f f c c 4 4 4 4 c c f f . 
        . f f f b f 4 4 f b f f f . 
        . f f 4 1 f d d f 1 4 f f . 
        . . f f d d d d d d f f . . 
        . . e f e 4 4 4 4 e f e . . 
        . e 4 f b 3 3 3 3 b f 4 e . 
        . 4 d f 3 3 3 3 3 3 c d 4 . 
        . 4 4 f 6 6 6 6 6 6 f 4 4 . 
        . . . . f f f f f f . . . . 
        . . . . f f . . f f . . . . 
        `, SpriteKind.Player),
    sprites.create(img`
        . . . . f f f f . . . . 
        . . f f e e e e f f . . 
        . f f e e e e e e f f . 
        f f f f 4 e e e f f f f 
        f f f 4 4 4 e e f f f f 
        f f f 4 4 4 4 e e f f f 
        f 4 e 4 4 4 4 4 4 e 4 f 
        f 4 4 f f 4 4 f f 4 4 f 
        f e 4 d d d d d d 4 e f 
        . f e d d b b d d e f . 
        . f f e 4 4 4 4 e f f . 
        e 4 f b 1 1 1 1 b f 4 e 
        4 d f 1 1 1 1 1 1 f d 4 
        4 4 f 6 6 6 6 6 6 f 4 4 
        . . . f f f f f f . . . 
        . . . f f . . f f . . . 
        `, SpriteKind.Player),
    sprites.create(img`
        . . . . . f f f f . . . . . 
        . . . f f 5 5 5 5 f f . . . 
        . . f 5 5 5 5 5 5 5 5 f . . 
        . f 5 5 5 5 5 5 5 5 5 5 f . 
        . f 5 5 5 d b b d 5 5 5 f . 
        f 5 5 5 b 4 4 4 4 b 5 5 5 f 
        f 5 5 c c 4 4 4 4 c c 5 5 f 
        f b b f b f 4 4 f b f b b f 
        f b b 4 1 f d d f 1 4 b b f 
        . f b f d d d d d d f b f . 
        . f e f e 4 4 4 4 e f e f . 
        . e 4 f 6 9 9 9 9 6 f 4 e . 
        . 4 d c 9 9 9 9 9 9 c d 4 . 
        . 4 f b 3 b 3 b 3 b b f 4 . 
        . . f f 3 b 3 b 3 3 f f . . 
        . . . . f f b b f f . . . . 
        `, SpriteKind.Player)
    ]
    for (let value of playerSpriteList) {
        value.setPosition(-20, -20)
    }
}
function sprintfunction (sprite: Sprite) {
    if (sprintBar.value > 0) {
        sprintBar.attachToSprite(sprite, 5, 0)
        sprintBar.setColor(4, 5)
        statEffect = true
    }
}
function animSetup () {
    // Sprites and Sprite animations are all by Makecode Arcade by Microsoft
    animList = [
    [
    [img`
        . . . . f f f f . . . . . 
        . . f f c c c c f f . . . 
        . f f c c c c c c f f . . 
        f f c c c c c c c c f f . 
        f f c c f c c c c c c f . 
        f f f f f c c c f c c f . 
        f f f f c c c f c c f f . 
        f f f f f f f f f f f f . 
        f f f f f f f f f f f f . 
        . f f f f f f f f f f . . 
        . f f f f f f f f f f . . 
        f e f f f f f f f f e f . 
        e 4 f 7 7 7 7 7 7 c 4 e . 
        e e f 6 6 6 6 6 6 f e e . 
        . . . f f f f f f . . . . 
        . . . f f . . f f . . . . 
        `, img`
        . . . . . . . . . . . . . 
        . . . . . f f f f . . . . 
        . . . f f c c c c f f . . 
        . f f f c c c c c c f f . 
        f f c c c c c c c c c f f 
        f c c c c f c c c c c c f 
        . f f f f c c c c f c c f 
        . f f f f c c f c c c f f 
        . f f f f f f f f f f f f 
        . f f f f f f f f f f f f 
        . . f f f f f f f f f f . 
        . . e f f f f f f f f f . 
        . . e f f f f f f f f e f 
        . . 4 c 7 7 7 7 7 e 4 4 e 
        . . e f f f f f f f e e . 
        . . . f f f . . . . . . . 
        `, img`
        . . . . . . . . . . . . . 
        . . . . . f f f f . . . . 
        . . . f f c c c c f f . . 
        . . f f c c c c c c f f . 
        . f f f c c c c c c c f f 
        f f f c c c c c c c c c f 
        f f c c c f c c c c c c f 
        . f f f f f c c c f c f f 
        . f f f f c c f f c f f f 
        . . f f f f f f f f f f f 
        . . f f f f f f f f f f . 
        . . f f f f f f f f f e . 
        . f e f f f f f f f f e . 
        . e 4 4 e 7 7 7 7 7 c 4 . 
        . . e e f f f f f f f e . 
        . . . . . . . . f f f . . 
        `],
    [img`
        . . . . f f f f . . . . . 
        . . f f f f f f f f . . . 
        . f f f f f f c f f f . . 
        f f f f f f c c f f f c . 
        f f f c f f f f f f f c . 
        c c c f f f e e f f c c . 
        f f f f f e e f f c c f . 
        f f f b f e e f b f f f . 
        . f 4 1 f 4 4 f 1 4 f . . 
        . f e 4 4 4 4 4 4 e f . . 
        . f f f e e e e f f f . . 
        f e f b 7 7 7 7 b f e f . 
        e 4 f 7 7 7 7 7 7 f 4 e . 
        e e f 6 6 6 6 6 6 f e e . 
        . . . f f f f f f . . . . 
        . . . f f . . f f . . . . 
        `, img`
        . . . . . . . . . . . . . 
        . . . . . f f f f . . . . 
        . . . f f f f f f f f . . 
        . . f f f f f f c f f f . 
        f f f f f f f c c f f f c 
        f f f f c f f f f f f f c 
        . c c c f f f e e f f c c 
        . f f f f f e e f f c c f 
        . f f f b f e e f b f f f 
        . f f 4 1 f 4 4 f 1 4 f f 
        . . f e 4 4 4 4 4 e e f e 
        . f e f b 7 7 7 e 4 4 4 e 
        . e 4 f 7 7 7 7 e 4 4 e . 
        . . . f 6 6 6 6 6 e e . . 
        . . . f f f f f f f . . . 
        . . . f f f . . . . . . . 
        `, img`
        . . . . . . . . . . . . . 
        . . . . f f f f . . . . . 
        . . f f f f f f f f . . . 
        . f f f c f f f f f f . . 
        c f f f c c f f f f f f f 
        c f f f f f f f c f f f f 
        c c f f e e f f f c c c . 
        f c c f f e e f f f f f . 
        f f f b f e e f b f f f . 
        f f 4 1 f 4 4 f 1 4 f f . 
        e f e e 4 4 4 4 4 e f . . 
        e 4 4 4 e 7 7 7 b f e f . 
        . e 4 4 e 7 7 7 7 f 4 e . 
        . . e e 6 6 6 6 6 f . . . 
        . . . f f f f f f f . . . 
        . . . . . . . f f f . . . 
        `],
    [img`
        . . . . . f f f f f . . . 
        . . . f f f f f f f f f . 
        . . f f f c f f f f f f . 
        . . f f c f f f c f f f f 
        f f c c f f f c c f f c f 
        f f f f f e f f f f c c f 
        . f f f e e f f f f f f f 
        . . f f e e f b f e e f f 
        . . . f 4 4 f 1 e 4 e f . 
        . . . f 4 4 4 4 e f f f . 
        . . . f f e e e e e f . . 
        . . . f 7 7 7 e 4 4 e . . 
        . . . f 7 7 7 e 4 4 e . . 
        . . . f 6 6 6 f e e f . . 
        . . . . f f f f f f . . . 
        . . . . . . f f f . . . . 
        `, img`
        . . . . . . . . . . . . . 
        . . . . f f f f f f . . . 
        . . . f f f f f f f f f . 
        . . f f f c f f f f f f . 
        . f f f c f f f c f f f f 
        f f c c f f f c c f f c f 
        f f f f f e f f f f c c f 
        . f f f e e f f f f f f f 
        . . f f e e f b f e e f f 
        . . f f 4 4 f 1 e 4 e f . 
        . . . f 4 4 4 e e f f f . 
        . . . f f e e 4 4 e f . . 
        . . . f 7 7 e 4 4 e f . . 
        . . f f 6 6 f e e f f f . 
        . . f f f f f f f f f f . 
        . . . f f f . . . f f . . 
        `, img`
        . . . . . . . . . . . . . 
        . . . . f f f f f f . . . 
        . . . f f f f f f f f f . 
        . . f f f c f f f f f f . 
        . f f f c f f f c f f f f 
        f f c c f f f c c f f c f 
        f f f f f e f f f f c c f 
        . f f f e e f f f f f f f 
        . f f f e e f b f e e f f 
        . . f f 4 4 f 1 e 4 e f f 
        . . . f 4 4 4 4 e f f f . 
        . . . f f e e e e 4 4 4 . 
        . . . f 7 7 7 7 e 4 4 e . 
        . . f f 6 6 6 6 f e e f . 
        . . f f f f f f f f f f . 
        . . . f f f . . . f f . . 
        `],
    [img`
        . . . . . . . . . . . . . 
        . . . f f f f f f . . . . 
        . f f f f f f f f f . . . 
        . f f f f f f c f f f . . 
        f f f f c f f f c f f f . 
        f c f f c c f f f c c f f 
        f c c f f f f e f f f f f 
        f f f f f f f e e f f f . 
        f f e e f b f e e f f f . 
        f f e 4 e 1 f 4 4 f f . . 
        . f f f e 4 4 4 4 f . . . 
        . 4 4 4 e e e e f f . . . 
        . e 4 4 e 7 7 7 7 f . . . 
        . f e e f 6 6 6 6 f f . . 
        . f f f f f f f f f f . . 
        . . f f . . . f f f . . . 
        `, img`
        . . . . . . . . . . . . . 
        . . . f f f f f f . . . . 
        . f f f f f f f f f . . . 
        . f f f f f f c f f f . . 
        f f f f c f f f c f f f . 
        f c f f c c f f f c c f f 
        f c c f f f f e f f f f f 
        f f f f f f f e e f f f . 
        f f e e f b f e e f f . . 
        . f e 4 e 1 f 4 4 f f . . 
        . f f f e e 4 4 4 f . . . 
        . . f e 4 4 e e f f . . . 
        . . f e 4 4 e 7 7 f . . . 
        . f f f e e f 6 6 f f . . 
        . f f f f f f f f f f . . 
        . . f f . . . f f f . . . 
        `, img`
        . . . f f f f f . . . . . 
        . f f f f f f f f f . . . 
        . f f f f f f c f f f . . 
        f f f f c f f f c f f . . 
        f c f f c c f f f c c f f 
        f c c f f f f e f f f f f 
        f f f f f f f e e f f f . 
        f f e e f b f e e f f . . 
        . f e 4 e 1 f 4 4 f . . . 
        . f f f e 4 4 4 4 f . . . 
        . . f e e e e e f f . . . 
        . . e 4 4 e 7 7 7 f . . . 
        . . e 4 4 e 7 7 7 f . . . 
        . . f e e f 6 6 6 f . . . 
        . . . f f f f f f . . . . 
        . . . . f f f . . . . . . 
        `]
    ],
    [
    [img`
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f c c c c c c c c c c f . 
        . f f c c c c c c c c f f . 
        . f f f c c c c c c f f f . 
        . f f f f f f f f f f f f . 
        . . f f f f f f f f f f . . 
        . . e f f f f f f f f e . . 
        . e 4 f f f f f f f f 4 e . 
        . 4 d f 3 3 3 3 3 3 c d 4 . 
        . 4 4 f 6 6 6 6 6 6 f 4 4 . 
        . . . . f f f f f f . . . . 
        . . . . f f . . f f . . . . 
        `, img`
        . . . . . . . . . . . . . . 
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f c c c c c c c c c f f . 
        . f f c c c c c c c c f f . 
        . f f c c c c c c f f f f . 
        . f f f f f f f f f f f f . 
        . . f f f f f f f f f f . . 
        . . e f f f f f f f f e . . 
        . . e f f f f f f f f 4 e . 
        . . 4 f 3 3 3 3 3 e d d 4 . 
        . . e f f f f f f e e 4 . . 
        . . . f f f . . . . . . . . 
        `, img`
        . . . . . . . . . . . . . . 
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f f c c c c c c c c c f . 
        . f f c c c c c c c c f f . 
        . f f f f c c c c c c f f . 
        . f f f f f f f f f f f f . 
        . . f f f f f f f f f f . . 
        . . e f f f f f f f f e . . 
        . e 4 f f f f f f f f e . . 
        . 4 d d e 3 3 3 3 3 f 4 . . 
        . . 4 e e f f f f f f e . . 
        . . . . . . . . f f f . . . 
        `],
    [img`
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f c c c c 4 4 c c c c f . 
        . f f c c 4 4 4 4 c c f f . 
        . f f f b f 4 4 f b f f f . 
        . f f 4 1 f d d f 1 4 f f . 
        . . f f d d d d d d f f . . 
        . . e f e 4 4 4 4 e f e . . 
        . e 4 f b 3 3 3 3 b f 4 e . 
        . 4 d f 3 3 3 3 3 3 c d 4 . 
        . 4 4 f 6 6 6 6 6 6 f 4 4 . 
        . . . . f f f f f f . . . . 
        . . . . f f . . f f . . . . 
        `, img`
        . . . . . . . . . . . . . . 
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f c c c c 4 4 c c c c f . 
        . f f c c 4 4 4 4 c c f f . 
        . f f f b f 4 4 f b f f f . 
        . f f 4 1 f d d f 1 4 f f . 
        . . f f d d d d d 4 e f e . 
        . f e f f b b b e d d 4 e . 
        . e 4 f b 3 3 3 e d d e . . 
        . . . f 6 6 6 6 f e e . . . 
        . . . f f f f f f f . . . . 
        . . . f f f . . . . . . . . 
        `, img`
        . . . . . . . . . . . . . . 
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f c c c c 4 4 c c c c f . 
        . f f c c 4 4 4 4 c c f f . 
        . f f f b f 4 4 f b f f f . 
        . f f 4 1 f d d f 1 4 f f . 
        . e f e 4 d d d d d f f . . 
        . e 4 d d e b b b f f e f . 
        . . e d d e 3 3 b e f 4 e . 
        . . . e e f 6 6 6 6 f . . . 
        . . . . f f f f f f f . . . 
        . . . . . . . . f f f . . . 
        `],
    [img`
        . . . . f f f f f . f f f . 
        . . . f f c c c c f f f f f 
        . . f c c c c c c b f f f f 
        . . f c c c c c c 3 c f f f 
        . f c c c c c c c c 3 3 f . 
        . f c c 4 c c c c c f f f . 
        . f f e 4 4 c c c f f f f . 
        . f f e 4 4 f b f 4 4 f f . 
        . . f f d d f 1 4 d 4 f . . 
        . . . f d d d d 4 f f f . . 
        . . . f e 4 4 4 e e f . . . 
        . . . f 3 3 3 e d d 4 . . . 
        . . . f 3 3 3 e d d e . . . 
        . . . f 6 6 6 f e e f . . . 
        . . . . f f f f f f . . . . 
        . . . . . . f f f . . . . . 
        `, img`
        . . . . . . . . . . . . . . 
        . . . . f f f f f . f f f . 
        . . . f f c c c c f f f f f 
        . . f c c c c c c b f f f f 
        . . f c c c c c c 3 c f f f 
        . f c c c c c c c c 3 3 f . 
        . f c c 4 c c c c c f f f . 
        . f f c 4 4 c c c f f f f . 
        . f f f 4 4 f b f 4 4 f f . 
        . . f f d d f 1 4 d 4 f . . 
        . . . f d d d e e f f f . . 
        . . . f e 4 e d d 4 f . . . 
        . . . f 3 3 e d d e f . . . 
        . . f f 6 6 f e e f f f . . 
        . . f f f f f f f f f f . . 
        . . . f f f . . . f f . . . 
        `, img`
        . . . . . . . . . . . . . . 
        . . . . f f f f f . f f f . 
        . . . f f c c c c f f f f f 
        . . f c c c c c c b f f f f 
        . . f c c c c c c 3 c f f f 
        . f c c c c c c c c 3 3 f . 
        . f c c 4 c c c c c f f f . 
        . f f c 4 4 c c c f f f f . 
        . f f f 4 4 f b f 4 4 f f . 
        . . f c d d f 1 4 d 4 f f . 
        . . . f d d d d 4 f f f . . 
        . . . f e 4 4 4 e d d 4 . . 
        . . . f 3 3 3 3 e d d e . . 
        . . f f 6 6 6 6 f e e f . . 
        . . f f f f f f f f f f . . 
        . . . f f f . . . f f . . . 
        `],
    [img`
        . . . . . . . . . . . . . . 
        . f f f . f f f f f . . . . 
        f f f f f c c c c f f . . . 
        f f f f b c c c c c c f . . 
        f f f c 3 c c c c c c f . . 
        . f 3 3 c c c c c c c c f . 
        . f f f c c c c c 4 c c f . 
        . f f f f c c c 4 4 c f f . 
        . f f 4 4 f b f 4 4 f f f . 
        . f f 4 d 4 1 f d d c f . . 
        . . f f f 4 d d d d f . . . 
        . . 4 d d e 4 4 4 e f . . . 
        . . e d d e 3 3 3 3 f . . . 
        . . f e e f 6 6 6 6 f f . . 
        . . f f f f f f f f f f . . 
        . . . f f . . . f f f . . . 
        `, img`
        . . . . . . . . . . . . . . 
        . f f f . f f f f f . . . . 
        f f f f f c c c c f f . . . 
        f f f f b c c c c c c f . . 
        f f f c 3 c c c c c c f . . 
        . f 3 3 c c c c c c c c f . 
        . f f f c c c c c 4 c c f . 
        . f f f f c c c 4 4 c f f . 
        . f f 4 4 f b f 4 4 f f f . 
        . . f 4 d 4 1 f d d f f . . 
        . . f f f e e d d d f . . . 
        . . . f 4 d d e 4 e f . . . 
        . . . f e d d e 3 3 f . . . 
        . . f f f e e f 6 6 f f . . 
        . . f f f f f f f f f f . . 
        . . . f f . . . f f f . . . 
        `, img`
        . f f f . f f f f f . . . . 
        f f f f f c c c c f f . . . 
        f f f f b c c c c c c f . . 
        f f f c 3 c c c c c c f . . 
        . f 3 3 c c c c c c c c f . 
        . f f f c c c c c 4 c c f . 
        . f f f f c c c 4 4 e f f . 
        . f f 4 4 f b f 4 4 e f f . 
        . . f 4 d 4 1 f d d f f . . 
        . . f f f 4 d d d d f . . . 
        . . . f e e 4 4 4 e f . . . 
        . . . 4 d d e 3 3 3 f . . . 
        . . . e d d e 3 3 3 f . . . 
        . . . f e e f 6 6 6 f . . . 
        . . . . f f f f f f . . . . 
        . . . . . f f f . . . . . . 
        `]
    ],
    [
    [img`
        . . . . f f f f . . . . 
        . . f f e e e e f f . . 
        . f e e e e e e e f f . 
        f f e f e e e e e e f f 
        f f f e e e e e e e e f 
        f f f e e e e e e f e f 
        f f f f e e e e f f f f 
        f f f f f f f f f f f f 
        f f f f f f f f f f f f 
        . f f f f f f f f f f . 
        . e f f f f f f f f e . 
        e 4 f b b b b b b f 4 e 
        4 d f d d d d d d c d 4 
        4 4 f 6 6 6 6 6 6 f 4 4 
        . . . f f f f f f . . . 
        . . . f f . . f f . . . 
        `, img`
        . . . . . . . . . . . . 
        . . . . f f f f . . . . 
        . . f f e e e e f f . . 
        . f e e e e e e e f f . 
        f e e f e e e e e e f f 
        f f f e e e e e e e e f 
        f f e e e e e e e f e f 
        f f f e e e e f f f f f 
        f f f f f f f f f f f f 
        f f f f f f f f f f f f 
        . f f f f f f f f f f . 
        . e f f f f f f f f e . 
        . 4 f b b b b b f e 4 e 
        . 4 f d d d d d e d d 4 
        . e f f f f f f e e 4 . 
        . . f f f . . . . . . . 
        `, img`
        . . . . . . . . . . . . 
        . . . . f f f f . . . . 
        . . f f e e e e f f . . 
        . f e e e e e e e f f . 
        f f e f e e e e e e f f 
        f f f e e e e e e e e f 
        f f f f e e e e e f e f 
        f f f f f e e e e f f f 
        f f f f f f f f f f f f 
        f f f f f f f f f f f f 
        . f f f f f f f f f f . 
        . e f f f f f f f f e . 
        e 4 e f b b b b b f 4 . 
        4 d d e d d d d d f 4 . 
        . 4 e e f f f f f f e . 
        . . . . . . . f f f . . 
        `],
    [img`
        . . . . f f f f . . . . 
        . . f f e e e e f f . . 
        . f f e e e e e e f f . 
        f f f f 4 e e e f f f f 
        f f f 4 4 4 e e f f f f 
        f f f 4 4 4 4 e e f f f 
        f 4 e 4 4 4 4 4 4 e 4 f 
        f 4 4 f f 4 4 f f 4 4 f 
        f e 4 d d d d d d 4 e f 
        . f e d d b b d d e f . 
        . f f e 4 4 4 4 e f f . 
        e 4 f b 1 1 1 1 b f 4 e 
        4 d f 1 1 1 1 1 1 f d 4 
        4 4 f 6 6 6 6 6 6 f 4 4 
        . . . f f f f f f . . . 
        . . . f f . . f f . . . 
        `, img`
        . . . . . . . . . . . . 
        . . . f f f f f f . . . 
        . f f f e e e e f f f . 
        f f f e e e e e e f f f 
        f f f f 4 e e e f f f f 
        f f f 4 4 4 e e f f f f 
        f f f 4 4 4 4 e e f f f 
        f 4 e 4 4 4 4 4 4 e 4 f 
        f 4 4 f f 4 4 f f 4 4 f 
        f e 4 d d d d d d 4 e f 
        . f e d d b b d 4 e f e 
        f f f e 4 4 4 4 d d 4 e 
        e 4 f b 1 1 1 e d d e . 
        . . f 6 6 6 6 f e e . . 
        . . f f f f f f f . . . 
        . . f f f . . . . . . . 
        `, img`
        . . . . . . . . . . . . 
        . . . f f f f f f . . . 
        . f f f e e e e f f f . 
        f f f e e e e e e f f f 
        f f f f 4 e e e f f f f 
        f f f 4 4 4 e e f f f f 
        f f f 4 4 4 4 e e f f f 
        f 4 e 4 4 4 4 4 4 e 4 f 
        f 4 4 f f 4 4 f f 4 4 f 
        f e 4 d d d d d d 4 e f 
        e f e 4 d b b d d e f . 
        e 4 d d 4 4 4 4 e f f f 
        . e d d e 1 1 1 b f 4 e 
        . . e e f 6 6 6 6 f . . 
        . . . f f f f f f f . . 
        . . . . . . . f f f . . 
        `],
    [img`
        . . . f f f f f . . . . 
        . . f e e e e e f f . . 
        . f e e e e e e e f f . 
        f e e e e e e e f f f f 
        f e e 4 e e e f f f f f 
        f e e 4 4 e e e f f f f 
        f f e 4 4 4 4 4 f f f f 
        f f e 4 4 f f 4 e 4 f f 
        . f f d d d d 4 d 4 f . 
        . . f b b d d 4 f f f . 
        . . f e 4 4 4 e e f . . 
        . . f 1 1 1 e d d 4 . . 
        . . f 1 1 1 e d d e . . 
        . . f 6 6 6 f e e f . . 
        . . . f f f f f f . . . 
        . . . . . f f f . . . . 
        `, img`
        . . . . . . . . . . . . 
        . . . f f f f f f . . . 
        . . f e e e e e f f f . 
        . f e e e e e e e f f f 
        f e e e e e e e f f f f 
        f e e 4 e e e f f f f f 
        f e e 4 4 e e e f f f f 
        f f e 4 4 4 4 4 f f f f 
        . f e 4 4 f f 4 e 4 f f 
        . . f d d d d 4 d 4 f . 
        . . f b b d e e f f f . 
        . . f e 4 e d d 4 f . . 
        . . f 1 1 e d d e f . . 
        . f f 6 6 f e e f f f . 
        . f f f f f f f f f f . 
        . . f f f . . . f f . . 
        `, img`
        . . . . . . . . . . . . 
        . . . f f f f f f . . . 
        . . f e e e e e f f f . 
        . f e e e e e e e f f f 
        f e e e e e e e f f f f 
        f e e 4 e e e f f f f f 
        f e e 4 4 e e e f f f f 
        f f e 4 4 4 4 4 f f f f 
        . f e 4 4 f f 4 e 4 f f 
        . . f d d d d 4 d 4 f f 
        . . f b b d d 4 f f f . 
        . . f e 4 4 4 e d d 4 . 
        . . f 1 1 1 1 e d d e . 
        . f f 6 6 6 6 f e e f . 
        . f f f f f f f f f f . 
        . . f f f . . . f f . . 
        `],
    [img`
        . . . . . . . . . . . . 
        . . . f f f f f f . . . 
        . f f f e e e e e f . . 
        f f f e e e e e e e f . 
        f f f f e e e e e e e f 
        f f f f f e e e 4 e e f 
        f f f f e e e 4 4 e e f 
        f f f f 4 4 4 4 4 e f f 
        f f 4 e 4 f f 4 4 e f . 
        f f 4 d 4 d d d d f . . 
        . f f f 4 d d b b f . . 
        . 4 d d e 4 4 4 e f . . 
        . e d d e 1 1 1 1 f . . 
        . f e e f 6 6 6 6 f f . 
        . f f f f f f f f f f . 
        . . f f . . . f f f . . 
        `, img`
        . . . . . . . . . . . . 
        . . . f f f f f f . . . 
        . f f f e e e e e f . . 
        f f f e e e e e e e f . 
        f f f f e e e e e e e f 
        f f f f f e e e 4 e e f 
        f f f f e e e 4 4 e e f 
        f f f f 4 4 4 4 4 e f f 
        f f 4 e 4 f f 4 4 e f . 
        . f 4 d 4 d d d d f . . 
        . f f f e e d b b f . . 
        . . f 4 d d e 4 e f . . 
        . . f e d d e 1 1 f . . 
        . f f f e e f 6 6 f f . 
        . f f f f f f f f f f . 
        . . f f . . . f f f . . 
        `, img`
        . . . . f f f f f . . . 
        . . f f e e e e e f . . 
        . f f e e e e e e e f . 
        f f f f e e e e e e e f 
        f f f f f e e e 4 e e f 
        f f f f e e e 4 4 e e f 
        f f f f 4 4 4 4 4 e f f 
        f f 4 e 4 f f 4 4 e f f 
        . f 4 d 4 d d d d f f . 
        . f f f 4 d d b b f . . 
        . . f e e 4 4 4 e f . . 
        . . 4 d d e 1 1 1 f . . 
        . . e d d e 1 1 1 f . . 
        . . f e e f 6 6 6 f . . 
        . . . f f f f f f . . . 
        . . . . f f f . . . . . 
        `]
    ],
    [
    [
    img`
        . . . . . . f f f f . . . . . . 
        . . . . f f e e e e f f . . . . 
        . . . f e e e f f e e e f . . . 
        . . f f f f f 2 2 f f f f f . . 
        . . f f e 2 e 2 2 e 2 e f f . . 
        . . f e 2 f 2 f f 2 f 2 e f . . 
        . . f f f 2 2 e e 2 2 f f f . . 
        . f f e f 2 f e e f 2 f e f f . 
        . f e e f f e e e e f e e e f . 
        . . f e e e e e e e e e e f . . 
        . . . f e e e e e e e e f . . . 
        . . e 4 f f f f f f f f 4 e . . 
        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
        . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . f f e e e e f f . . . . 
        . . . f e e e f f e e e f . . . 
        . . . f f f f 2 2 f f f f . . . 
        . . f f e 2 e 2 2 e 2 e f f . . 
        . . f e 2 f 2 f f f 2 f e f . . 
        . . f f f 2 f e e 2 2 f f f . . 
        . . f e 2 f f e e 2 f e e f . . 
        . f f e f f e e e f e e e f f . 
        . f f e e e e e e e e e e f f . 
        . . . f e e e e e e e e f . . . 
        . . . e f f f f f f f f 4 e . . 
        . . . 4 f 2 2 2 2 2 e d d 4 . . 
        . . . e f f f f f f e e 4 . . . 
        . . . . f f f . . . . . . . . . 
        `,
    img`
        . . . . . . f f f f . . . . . . 
        . . . . f f e e e e f f . . . . 
        . . . f e e e f f e e e f . . . 
        . . f f f f f 2 2 f f f f f . . 
        . . f f e 2 e 2 2 e 2 e f f . . 
        . . f e 2 f 2 f f 2 f 2 e f . . 
        . . f f f 2 2 e e 2 2 f f f . . 
        . f f e f 2 f e e f 2 f e f f . 
        . f e e f f e e e e f e e e f . 
        . . f e e e e e e e e e e f . . 
        . . . f e e e e e e e e f . . . 
        . . e 4 f f f f f f f f 4 e . . 
        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
        . . 4 4 f 4 4 4 4 4 4 f 4 4 . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . f f e e e e f f . . . . 
        . . . f e e e f f e e e f . . . 
        . . . f f f f 2 2 f f f f . . . 
        . . f f e 2 e 2 2 e 2 e f f . . 
        . . f e f 2 f f f 2 f 2 e f . . 
        . . f f f 2 2 e e f 2 f f f . . 
        . . f e e f 2 e e f f 2 e f . . 
        . f f e e e f e e e f f e f f . 
        . f f e e e e e e e e e e f f . 
        . . . f e e e e e e e e f . . . 
        . . e 4 f f f f f f f f e . . . 
        . . 4 d d e 2 2 2 2 2 f 4 . . . 
        . . . 4 e e f f f f f f e . . . 
        . . . . . . . . . f f f . . . . 
        `
    ],
    [
    img`
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f f e 2 2 2 2 2 2 e e f . . 
        . . f e 2 f f f f f f 2 e f . . 
        . . f f f f e e e e f f f f . . 
        . f f e f b f 4 4 f b f e f f . 
        . f e e 4 1 f d d f 1 4 e e f . 
        . . f e e d d d d d d e e f . . 
        . . . f e e 4 4 4 4 e e f . . . 
        . . e 4 f 2 2 2 2 2 2 f 4 e . . 
        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
        . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f f e 2 2 2 2 2 2 e e f . . 
        . f f e 2 f f f f f f 2 e f f . 
        . f f f f f e e e e f f f f f . 
        . . f e f b f 4 4 f b f e f . . 
        . . f e 4 1 f d d f 1 4 e f . . 
        . . . f e 4 d d d d 4 e f e . . 
        . . f e f 2 2 2 2 e d d 4 e . . 
        . . e 4 f 2 2 2 2 e d d e . . . 
        . . . . f 4 4 5 5 f e e . . . . 
        . . . . f f f f f f f . . . . . 
        . . . . f f f . . . . . . . . . 
        `,
    img`
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f f e 2 2 2 2 2 2 e e f . . 
        . . f e 2 f f f f f f 2 e f . . 
        . . f f f f e e e e f f f f . . 
        . f f e f b f 4 4 f b f e f f . 
        . f e e 4 1 f d d f 1 4 e e f . 
        . . f e e d d d d d d e e f . . 
        . . . f e e 4 4 4 4 e e f . . . 
        . . e 4 f 2 2 2 2 2 2 f 4 e . . 
        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
        . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f e e 2 2 2 2 2 2 e f f . . 
        . f f e 2 f f f f f f 2 e f f . 
        . f f f f f e e e e f f f f f . 
        . . f e f b f 4 4 f b f e f . . 
        . . f e 4 1 f d d f 1 4 e f . . 
        . . e f e 4 d d d d 4 e f . . . 
        . . e 4 d d e 2 2 2 2 f e f . . 
        . . . e d d e 2 2 2 2 f 4 e . . 
        . . . . e e f 5 5 4 4 f . . . . 
        . . . . . f f f f f f f . . . . 
        . . . . . . . . . f f f . . . . 
        `
    ],
    [
    img`
        . . . . f f f f f f . . . . . . 
        . . . f 2 f e e e e f f . . . . 
        . . f 2 2 2 f e e e e f f . . . 
        . . f e e e e f f e e e f . . . 
        . f e 2 2 2 2 e e f f f f . . . 
        . f 2 e f f f f 2 2 2 e f . . . 
        . f f f e e e f f f f f f f . . 
        . f e e 4 4 f b e 4 4 e f f . . 
        . . f e d d f 1 4 d 4 e e f . . 
        . . . f d d d d 4 e e e f . . . 
        . . . f e 4 4 4 e e f f . . . . 
        . . . f 2 2 2 e d d 4 . . . . . 
        . . . f 2 2 2 e d d e . . . . . 
        . . . f 5 5 4 f e e f . . . . . 
        . . . . f f f f f f . . . . . . 
        . . . . . . f f f . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . f f f f f f . . . . . . 
        . . . f 2 f e e e e f f . . . . 
        . . f 2 2 2 f e e e e f f . . . 
        . . f e e e e f f e e e f . . . 
        . f e 2 2 2 2 e e f f f f . . . 
        . f 2 e f f f f 2 2 2 e f . . . 
        . f f f e e e f f f f f f f . . 
        . f e e 4 4 f b e 4 4 e f f . . 
        . . f e d d f 1 4 d 4 e e f . . 
        . . . f d d d e e e e e f . . . 
        . . . f e 4 e d d 4 f . . . . . 
        . . . f 2 2 e d d e f . . . . . 
        . . f f 5 5 f e e f f f . . . . 
        . . f f f f f f f f f f . . . . 
        . . . f f f . . . f f . . . . . 
        `,
    img`
        . . . . f f f f f f . . . . . . 
        . . . f 2 f e e e e f f . . . . 
        . . f 2 2 2 f e e e e f f . . . 
        . . f e e e e f f e e e f . . . 
        . f e 2 2 2 2 e e f f f f . . . 
        . f 2 e f f f f 2 2 2 e f . . . 
        . f f f e e e f f f f f f f . . 
        . f e e 4 4 f b e 4 4 e f f . . 
        . . f e d d f 1 4 d 4 e e f . . 
        . . . f d d d d 4 e e e f . . . 
        . . . f e 4 4 4 e e f f . . . . 
        . . . f 2 2 2 e d d 4 . . . . . 
        . . . f 2 2 2 e d d e . . . . . 
        . . . f 5 5 4 f e e f . . . . . 
        . . . . f f f f f f . . . . . . 
        . . . . . . f f f . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . f f f f f f . . . . . . 
        . . . f 2 f e e e e f f . . . . 
        . . f 2 2 2 f e e e e f f . . . 
        . . f e e e e f f e e e f . . . 
        . f e 2 2 2 2 e e f f f f . . . 
        . f 2 e f f f f 2 2 2 e f . . . 
        . f f f e e e f f f f f f f . . 
        . f e e 4 4 f b e 4 4 e f f . . 
        . . f e d d f 1 4 d 4 e e f . . 
        . . . f d d d d 4 e e e f . . . 
        . . . f e 4 4 4 e d d 4 . . . . 
        . . . f 2 2 2 2 e d d e . . . . 
        . . f f 5 5 4 4 f e e f . . . . 
        . . f f f f f f f f f f . . . . 
        . . . f f f . . . f f . . . . . 
        `
    ],
    [
    img`
        . . . . . . f f f f f f . . . . 
        . . . . f f e e e e f 2 f . . . 
        . . . f f e e e e f 2 2 2 f . . 
        . . . f e e e f f e e e e f . . 
        . . . f f f f e e 2 2 2 2 e f . 
        . . . f e 2 2 2 f f f f e 2 f . 
        . . f f f f f f f e e e f f f . 
        . . f f e 4 4 e b f 4 4 e e f . 
        . . f e e 4 d 4 1 f d d e f . . 
        . . . f e e e 4 d d d d f . . . 
        . . . . f f e e 4 4 4 e f . . . 
        . . . . . 4 d d e 2 2 2 f . . . 
        . . . . . e d d e 2 2 2 f . . . 
        . . . . . f e e f 4 5 5 f . . . 
        . . . . . . f f f f f f . . . . 
        . . . . . . . f f f . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f f f . . . . 
        . . . . f f e e e e f 2 f . . . 
        . . . f f e e e e f 2 2 2 f . . 
        . . . f e e e f f e e e e f . . 
        . . . f f f f e e 2 2 2 2 e f . 
        . . . f e 2 2 2 f f f f e 2 f . 
        . . f f f f f f f e e e f f f . 
        . . f f e 4 4 e b f 4 4 e e f . 
        . . f e e 4 d 4 1 f d d e f . . 
        . . . f e e e e e d d d f . . . 
        . . . . . f 4 d d e 4 e f . . . 
        . . . . . f e d d e 2 2 f . . . 
        . . . . f f f e e f 5 5 f f . . 
        . . . . f f f f f f f f f f . . 
        . . . . . f f . . . f f f . . . 
        `,
    img`
        . . . . . . f f f f f f . . . . 
        . . . . f f e e e e f 2 f . . . 
        . . . f f e e e e f 2 2 2 f . . 
        . . . f e e e f f e e e e f . . 
        . . . f f f f e e 2 2 2 2 e f . 
        . . . f e 2 2 2 f f f f e 2 f . 
        . . f f f f f f f e e e f f f . 
        . . f f e 4 4 e b f 4 4 e e f . 
        . . f e e 4 d 4 1 f d d e f . . 
        . . . f e e e 4 d d d d f . . . 
        . . . . f f e e 4 4 4 e f . . . 
        . . . . . 4 d d e 2 2 2 f . . . 
        . . . . . e d d e 2 2 2 f . . . 
        . . . . . f e e f 4 5 5 f . . . 
        . . . . . . f f f f f f . . . . 
        . . . . . . . f f f . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f f f . . . . 
        . . . . f f e e e e f 2 f . . . 
        . . . f f e e e e f 2 2 2 f . . 
        . . . f e e e f f e e e e f . . 
        . . . f f f f e e 2 2 2 2 e f . 
        . . . f e 2 2 2 f f f f e 2 f . 
        . . f f f f f f f e e e f f f . 
        . . f f e 4 4 e b f 4 4 e e f . 
        . . f e e 4 d 4 1 f d d e f . . 
        . . . f e e e 4 d d d d f . . . 
        . . . . 4 d d e 4 4 4 e f . . . 
        . . . . e d d e 2 2 2 2 f . . . 
        . . . . f e e f 4 4 5 5 f f . . 
        . . . . f f f f f f f f f f . . 
        . . . . . f f . . . f f f . . . 
        `
    ]
    ]
    ]
}
mp.onButtonEvent(mp.MultiplayerButton.Right, ControllerButtonEvent.Pressed, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        currentPlayer = 0
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        currentPlayer = 1
        // Sprite Data Extension by Microsoft Makecode
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)), "projDirX", 1)
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)), "projDirY", 0)
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        currentPlayer = 2
    } else {
        currentPlayer = 3
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)), "projDirX", 1)
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)), "projDirY", 0)
    }
    animationHandler(mp.getPlayerSprite(player2), true, currentPlayer, 3, animationSpeed)
})
mp.onButtonEvent(mp.MultiplayerButton.Up, ControllerButtonEvent.Pressed, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        currentPlayer = 0
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        currentPlayer = 1
        // Sprite Data Extension by Microsoft Makecode
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)), "projDirX", 0)
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)), "projDirY", -1)
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        currentPlayer = 2
    } else {
        currentPlayer = 3
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)), "projDirX", 0)
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)), "projDirY", -1)
    }
    animationHandler(mp.getPlayerSprite(player2), true, currentPlayer, 0, animationSpeed)
})
function setUpSprintBar () {
    sprintBar = statusbars.create(20, 4, StatusBarKind.stamina)
    sprintBar2 = statusbars.create(20, 4, StatusBarKind.stamina)
    sprintBar3 = statusbars.create(20, 4, StatusBarKind.stamina)
    sprintBar4 = statusbars.create(20, 4, StatusBarKind.stamina)
    sprintBar.value = 100
    sprintBar.setColor(0, 0)
    sprintBar2.value = 100
    sprintBar2.setColor(0, 0)
    sprintBar3.value = 100
    sprintBar3.setColor(0, 0)
    sprintBar4.value = 100
    sprintBar4.setColor(0, 0)
    speed = 10
    animationSpeed = 100
    speed2 = 50
    speed3 = 50
    speed4 = 50
}
mp.onButtonEvent(mp.MultiplayerButton.Left, ControllerButtonEvent.Pressed, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        currentPlayer = 0
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        currentPlayer = 1
        // Sprite Data Extension by Microsoft Makecode
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)), "projDirX", -1)
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)), "projDirY", 0)
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        currentPlayer = 2
    } else {
        currentPlayer = 3
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)), "projDirX", -1)
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)), "projDirY", 0)
    }
    animationHandler(mp.getPlayerSprite(player2), true, currentPlayer, 2, animationSpeed)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
	
})
function animationHandler (animOn: Sprite, animate: boolean, playerNum: number, dir: number, animSpeed: number) {
    animation.stopAnimation(animation.AnimationTypes.MovementAnimation, animOn)
    if (animate) {
        // animation extension by Microsoft Makecode Arcade
        animation.runImageAnimation(
        animOn,
        animList[playerNum][dir],
        animSpeed,
        animate
        )
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.projectile2, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.UntilDone)
    scene.cameraShake(6, 500)
    mp.changePlayerStateBy(mp.getPlayerBySprite(sprite), MultiplayerState.life, -1)
    canHurtPlayers = false
    sprite.startEffect(effects.spray, 100)
})
function sprintfunction4 (sprite: Sprite) {
    if (sprintBar4.value > 0) {
        sprintBar4.attachToSprite(sprite, 5, 0)
        sprintBar4.setColor(4, 5)
        statEffect4 = true
    }
}
function summonBoss () {
    let playerScores: number[] = []
    scoreSum = 0
    scoresLoopCounter = 0
    for (let playerArrayLoopA of mp.allPlayers()) {
        playerScores[scoresLoopCounter] = mp.getPlayerState(playerArrayLoopA, MultiplayerState.score)
        scoresLoopCounter += 1
    }
    for (let scoresLoopB of playerScores) {
        scoreSum += scoresLoopB
    }
    if (scoreSum >= summonCondition) {
        summonCondition = 1e+57
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
        sprites.destroyAllSpritesOfKind(SpriteKind.spawner)
        scene.cameraShake(6, 5000)
        pause(2000)
        Florczak = sprites.create(assets.image`myImage3`, SpriteKind.Boss)
        Florczak.setPosition(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x - 75, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y)
        game.splash("Broken one, soul so unruly...")
        mp.moveWithButtons(mp.playerSelector(mp.PlayerNumber.One), 0, 0)
        pause(2000)
        animation.runImageAnimation(
        mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)),
        [img`
            . . . . . f f f f f . . . 
            . . . f f f f f f f f f . 
            . . f f f c f f f f f f . 
            . . f f c f f f c f f f f 
            f f c c f f f c c f f c f 
            f f f f f e f f f f c c f 
            . f f f e e f f f f f f f 
            . . f f e e f b f e e f f 
            . . . f 4 4 f 1 e 4 e f . 
            . . . f 4 4 4 4 e f f f . 
            . . . f f e e e e e f . . 
            . . . f 7 7 7 e 4 4 e . . 
            . . . f 7 7 7 e 4 4 e . . 
            . . . f 6 6 6 f e e f . . 
            . . . . f f f f f f . . . 
            . . . . . . f f f . . . . 
            `],
        500,
        false
        )
        game.showLongText("To what lows hath thou spelunked?", DialogLayout.Bottom)
        while (Florczak.x < mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x - 30) {
            animation.runImageAnimation(
            Florczak,
            [img`
                . . . . . . . . . . . . . 
                . . . f f f f f f . . . . 
                . f f f f f f f f f . . . 
                . f f f f f f c f f f . . 
                f f f f c f f f c f f f . 
                f c f f c c f f f c c f f 
                f c c f f f f c f f f f f 
                f f f f f f f c c f f f . 
                f f c c f 2 f c c f f f . 
                f f c b c 4 f b b f f . . 
                . f f f c b b b b f . . . 
                . b b b c c c c f f . . . 
                . c b b c 2 2 2 2 f . . . 
                . f c c f 4 4 4 4 f f . . 
                . f f f f f f f f f f . . 
                . . f f . . . f f f . . . 
                `,img`
                . . . . . . . . . . . . . 
                . . . f f f f f f . . . . 
                . f f f f f f f f f . . . 
                . f f f f f f c f f f . . 
                f f f f c f f f c f f f . 
                f c f f c c f f f c c f f 
                f c c f f f f c f f f f f 
                f f f f f f f c c f f f . 
                f f c c f 2 f c c f f . . 
                . f c b c 4 f b b f f . . 
                . f f f c c b b b f . . . 
                . . f c b b c c f f . . . 
                . . f c b b c 2 2 f . . . 
                . f f f c c f 4 4 f f . . 
                . f f f f f f f f f f . . 
                . . f f . . . f f f . . . 
                `,img`
                . . . f f f f f . . . . . 
                . f f f f f f f f f . . . 
                . f f f f f f c f f f . . 
                f f f f c f f f c f f . . 
                f c f f c c f f f c c f f 
                f c c f f f f c f f f f f 
                f f f f f f f c c f f f . 
                f f c c f 2 f c c f f . . 
                . f c b c 4 f b b f . . . 
                . f f f c b b b b f . . . 
                . . f c c c c c f f . . . 
                . . c b b c 2 2 2 f . . . 
                . . c b b c 2 2 2 f . . . 
                . . f c c f 4 4 4 f . . . 
                . . . f f f f f f . . . . 
                . . . . f f f . . . . . . 
                `],
            50,
            false
            )
            pause(100)
            Florczak.x += 10
        }
        game.showLongText("To cross over Joshua Grass...", DialogLayout.Bottom)
        pause(200)
        game.showLongText("To murder divine children...", DialogLayout.Bottom)
        animation.runImageAnimation(
        Florczak,
        [img`
            . . . . . f f f f f . . . 
            . . . f f f f f f f f f . 
            . . f f f c f f f f f f . 
            . . f f c f f f c f f f f 
            f f c c f f f c c f f c f 
            f f f f f c f f f f c c f 
            . f f f c c f f f f f f f 
            . . f f c c f 2 f c c f f 
            . . . f b b f 4 c b c f . 
            . . . f b b b b c f f f . 
            . . . f f c c c c c f . . 
            . . . f 2 2 2 c b b c . . 
            . . . f 2 2 2 c b b c . . 
            . . . f 4 4 4 f c c f . . 
            . . . . f f f f f f . . . 
            . . . . . . f f f . . . . 
            `],
        100,
        false
        )
        Florczak.setStayInScreen(true)
        pause(200)
        game.showLongText("After seeing such a soliloquy, I must raise my blade.", DialogLayout.Bottom)
        pause(200)
        game.showLongText("Traitorous fiend! Hopeless coward! Raise thy blade so that I may do better than the one who broke you!", DialogLayout.Bottom)
        game.splash("THEY FIGHT!")
        statusbar.attachToSprite(Florczak, 5, 0)
        statusbar.setColor(2, 5, 4)
        bossCanAttack = true
    }
}
mp.onLifeZero(function (player2) {
    sprites.destroy(mp.getPlayerSprite(player2), effects.rings, 1000)
    music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.InBackground)
})
function spawnSpawners () {
    for (let spawnerLocations of tiles.getTilesByType(assets.tile`spawnerGrassTile`)) {
        setUpEnemySpawners(spawnerLocations.x, spawnerLocations.y, randint(3, 6))
    }
}
function distance (sprite1: Sprite, sprite2: Sprite) {
    return Math.sqrt(Math.abs(sprite1.x - sprite2.x) ** 2 + Math.abs(sprite1.y - sprite2.y) ** 2)
}
function setUpPowerups (_type: number, posX: number, posY: number) {
    if (_type == 0) {
        itemSprite = sprites.create(assets.image`myImage2`, SpriteKind.Food)
        sprites.setDataNumber(itemSprite, "healthUp", 1)
    } else if (_type == 1) {
        itemSprite = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Food)
        sprites.setDataNumber(itemSprite, "healthUp", 2)
    } else {
        itemSprite = sprites.create(assets.image`myImage3`, SpriteKind.Food)
        sprites.setDataNumber(itemSprite, "healthUp", 3)
    }
    itemSprite.setPosition(posX, posY)
}
function sprintfunction3 (sprite: Sprite) {
    if (sprintBar3.value > 0) {
        sprintBar3.attachToSprite(sprite, 5, 0)
        sprintBar3.setColor(4, 5)
        statEffect3 = true
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.hearts, 200)
    myObject += 1
    mp.changePlayerStateBy(mp.getPlayerBySprite(sprite), MultiplayerState.life, sprites.readDataNumber(otherSprite, "healthUp"))
    music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.InBackground)
})
function setUpEnemySpawners (spawnerX: number, spawnerY: number, numOfEnemies: number) {
    enemySpawnerSprite = sprites.create(assets.image`EnemyGrass4S`, SpriteKind.spawner)
    enemySpawnerSprite.setPosition(spawnerX, spawnerY)
    for (let index = 0; index < numOfEnemies; index++) {
        while (true) {
            sprites.setDataNumber(enemySpawnerSprite, "spawnEnemyType", randint(0, 2))
            sprites.setDataNumber(enemySpawnerSprite, "radius", randint(0, 25))
            sprites.setDataNumber(enemySpawnerSprite, "angle", randint(0, 360))
            sprites.setDataNumber(enemySpawnerSprite, "spriteX", enemySpawnerSprite.x + sprites.readDataNumber(enemySpawnerSprite, "radius") * Math.cos(sprites.readDataNumber(enemySpawnerSprite, "angle")))
            sprites.setDataNumber(enemySpawnerSprite, "spriteY", enemySpawnerSprite.y + sprites.readDataNumber(enemySpawnerSprite, "radius") * Math.sin(sprites.readDataNumber(enemySpawnerSprite, "angle")))
            burnerSprite.setPosition(sprites.readDataNumber(enemySpawnerSprite, "spriteX"), sprites.readDataNumber(enemySpawnerSprite, "spriteY"))
            if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation(burnerSprite.tilemapLocation().column, burnerSprite.tilemapLocation().row)))) {
                break;
            }
        }
        setUpEnemy(sprites.readDataNumber(enemySpawnerSprite, "spawnEnemyType"), sprites.readDataNumber(enemySpawnerSprite, "spriteX"), sprites.readDataNumber(enemySpawnerSprite, "spriteY"))
    }
}
mp.onButtonEvent(mp.MultiplayerButton.Down, ControllerButtonEvent.Pressed, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        currentPlayer = 0
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        currentPlayer = 1
        // Sprite Data Extension by Microsoft Makecode
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)), "projDirX", 0)
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)), "projDirY", 1)
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        currentPlayer = 2
    } else {
        currentPlayer = 3
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)), "projDirX", 0)
        sprites.setDataNumber(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)), "projDirY", 1)
    }
    animationHandler(mp.getPlayerSprite(player2), true, currentPlayer, 1, animationSpeed)
})
mp.onButtonEvent(mp.MultiplayerButton.B, ControllerButtonEvent.Pressed, function (player2) {
    music.play(music.melodyPlayable(music.footstep), music.PlaybackMode.InBackground)
})
function initializeVariables () {
    startFollow = false
    playerFollow = 0
    enemyFollow = 0
    spawnerLocations2 = 0
    value2 = 0
    enemiesArray2 = 0
    burnerSprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.burner)
    currentPlayer = 0
    scene.setBackgroundImage(img`
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        `)
    spriteIndex = 0
    scene.setBackgroundColor(15)
    tiles.setCurrentTilemap(tilemap`Overworld`)
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    sprites.destroy(otherSprite, effects.trail, 100)
})
mp.onButtonEvent(mp.MultiplayerButton.Up, ControllerButtonEvent.Released, function (player2) {
    if (player2 == mp.playerSelector(mp.PlayerNumber.One)) {
        currentPlayer = 0
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Two)) {
        currentPlayer = 1
    } else if (player2 == mp.playerSelector(mp.PlayerNumber.Three)) {
        currentPlayer = 2
    } else {
        currentPlayer = 3
    }
    animationHandler(mp.getPlayerSprite(player2), false, currentPlayer, 0, animationSpeed)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (canHurtPlayers) {
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.UntilDone)
        scene.cameraShake(6, 500)
        mp.changePlayerStateBy(mp.getPlayerBySprite(sprite), MultiplayerState.life, -1)
        canHurtPlayers = false
        sprite.startEffect(effects.spray, 100)
        // Timer Extension by Microsoft Makecode
        // 
        timer.after(5000, function () {
            canHurtPlayers = true
        })
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Boss, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.UntilDone)
    scene.cameraShake(6, 500)
    mp.changePlayerStateBy(mp.getPlayerBySprite(sprite), MultiplayerState.life, -1)
    canHurtPlayers = false
    sprite.startEffect(effects.spray, 100)
})
let attackBall: Sprite = null
let randomNum = 0
let enemiesArray2 = 0
let value2 = 0
let spawnerLocations2 = 0
let enemyFollow = 0
let playerFollow = 0
let enemySpawnerSprite: Sprite = null
let myObject = 0
let statEffect3 = false
let itemSprite: Sprite = null
let scoresLoopCounter = 0
let scoreSum = 0
let statEffect4 = false
let speed4 = 0
let speed3 = 0
let speed2 = 0
let speed = 0
let sprintBar4: StatusBarSprite = null
let sprintBar3: StatusBarSprite = null
let animList: Image[][][] = []
let statEffect = false
let sprintBar: StatusBarSprite = null
let burnerSprite: Sprite = null
let spawnerSprite: Sprite = null
let statEffect2 = false
let sprintBar2: StatusBarSprite = null
let Florczak: Sprite = null
let bossStunned = false
let bossCanAttack = false
let projectile: Sprite = null
let summonCondition = 0
let rangedCooldown = 0
let meleeCooldown = 0
let enemySight = 0
let meleeHitRange = 0
let projectileSpeedConst = 0
let canHurtPlayers = false
let startFollow = false
let spriteIndex = 0
let playerSpriteList: Sprite[] = []
let playerArray: mp.Player[] = []
let enemySprite: Sprite = null
let animationSpeed = 0
let currentPlayer = 0
let statusbar: StatusBarSprite = null
initializeVariables()
scene.centerCameraAt(250, 825)
initializeSpritesList()
setUpCombatVars()
animSetup()
setUpSprintBar()
spawnSpawners()
spawnItemSpawners()
music.play(music.stringPlayable("C D E F G A B C5 ", 120), music.PlaybackMode.UntilDone)
game.splash("Town Game")
music.play(music.stringPlayable("E B C5 A B G A F ", 120), music.PlaybackMode.LoopingInBackground)
statusbar = statusbars.create(20, 4, StatusBarKind.Health)
// Status Bar Extension by Microsoft Makecode Arcade
statusbar.value = 100
statusbar.setColor(0, 0)
// On Game update is by Microsoft makecode Arcade
game.onUpdateInterval(5000, function () {
    for (let enemyFollow2 of sprites.allOfKind(SpriteKind.Enemy)) {
        for (let playerFollow2 of sprites.allOfKind(SpriteKind.Player)) {
            if (distance(playerFollow2, enemyFollow2) < enemySight) {
                enemyFollow2.follow(playerFollow2, sprites.readDataNumber(enemyFollow2, "speed"))
                music.play(music.melodyPlayable(music.spooky), music.PlaybackMode.InBackground)
            } else {
                enemyFollow2.setVelocity(randint(-1 * sprites.readDataNumber(enemyFollow2, "speed"), sprites.readDataNumber(enemyFollow2, "speed")), randint(-1 * sprites.readDataNumber(enemyFollow2, "speed"), sprites.readDataNumber(enemyFollow2, "speed")))
            }
        }
    }
})
forever(function () {
    mp.moveWithButtons(mp.playerSelector(mp.PlayerNumber.One), speed, speed)
    if (mp.isButtonPressed(mp.playerSelector(mp.PlayerNumber.One), mp.MultiplayerButton.B) && sprintBar.value > 0) {
        sprintfunction(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)))
        pause(100)
        // Status Bar Extension by Microsoft Makecode Arcade
        sprintBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        sprintBar.value += -5
        speed += 10
        animationSpeed = 100
    } else {
        speed = 50
        animationSpeed = 200
    }
    if (!(mp.isButtonPressed(mp.playerSelector(mp.PlayerNumber.One), mp.MultiplayerButton.B)) && sprintBar.value < 100) {
        pause(300)
        sprintBar.value += 5
    }
    if (statEffect) {
        if (sprintBar.value == 100) {
            sprintBar.setColor(3, 5)
        }
    }
})
forever(function () {
    mp.moveWithButtons(mp.playerSelector(mp.PlayerNumber.Three), speed3, speed3)
    if (mp.isButtonPressed(mp.playerSelector(mp.PlayerNumber.Three), mp.MultiplayerButton.B) && sprintBar3.value > 0) {
        sprintfunction3(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Three)))
        pause(100)
        // Status Bar Extension by Microsoft Makecode Arcade
        sprintBar3.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        sprintBar3.value += -5
        speed3 += 10
        animationSpeed = 100
    } else {
        speed3 = 50
        animationSpeed = 200
    }
    if (!(mp.isButtonPressed(mp.playerSelector(mp.PlayerNumber.Three), mp.MultiplayerButton.B)) && sprintBar3.value < 100) {
        pause(300)
        sprintBar3.value += 5
        if (statEffect3) {
            if (sprintBar3.value == 100) {
                sprintBar3.setColor(3, 5)
            }
        }
    }
})
forever(function () {
    mp.moveWithButtons(mp.playerSelector(mp.PlayerNumber.Two), speed2, speed2)
    if (mp.isButtonPressed(mp.playerSelector(mp.PlayerNumber.Two), mp.MultiplayerButton.B) && sprintBar2.value > 0) {
        sprintfunction2(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Two)))
        pause(100)
        // Status Bar Extension by Microsoft Makecode Arcade
        sprintBar2.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        sprintBar2.value += -5
        speed2 += 10
        animationSpeed = 100
    } else {
        speed2 = 50
        animationSpeed = 200
    }
    if (!(mp.isButtonPressed(mp.playerSelector(mp.PlayerNumber.Two), mp.MultiplayerButton.B)) && sprintBar2.value < 100) {
        pause(300)
        sprintBar2.value += 5
        if (statEffect2) {
            if (sprintBar2.value == 100) {
                sprintBar2.setColor(3, 5)
            }
        }
    }
})
forever(function () {
    mp.moveWithButtons(mp.playerSelector(mp.PlayerNumber.Four), speed4, speed4)
    if (mp.isButtonPressed(mp.playerSelector(mp.PlayerNumber.Four), mp.MultiplayerButton.B) && sprintBar4.value > 0) {
        sprintfunction4(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.Four)))
        pause(100)
        // Status Bar Extension by Microsoft Makecode Arcade
        sprintBar4.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        sprintBar4.value += -5
        speed4 += 10
        animationSpeed = 100
    } else {
        speed4 = 50
        animationSpeed = 200
    }
    if (!(mp.isButtonPressed(mp.playerSelector(mp.PlayerNumber.Four), mp.MultiplayerButton.B)) && sprintBar4.value < 100) {
        pause(300)
        sprintBar4.value += 5
        if (statEffect4) {
            if (sprintBar4.value == 100) {
                sprintBar4.setColor(3, 5)
            }
        }
    }
})
game.onUpdateInterval(300, function () {
    if (statusbar.value == 0) {
        sprites.destroy(Florczak, effects.spray, 500)
        game.gameOver(true)
        game.setGameOverEffect(true, effects.confetti)
    }
    randomNum = randint(0, 2)
    if (bossCanAttack) {
        if (statusbar.value > 0) {
            if (randomNum == 1) {
                Florczak.setPosition(randint(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x + 50, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x - 50), randint(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y + 50, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y - 50))
                animation.runImageAnimation(
                Florczak,
                [img`
                    . . . . f f f f . . . . . 
                    . . f f f f f f f f . . . 
                    . f f f f f f c f f f . . 
                    f f f f f f c c f f f c . 
                    f f f c f f f f f f f c . 
                    c c c f f f c c f f c c . 
                    f f f f f c c f f c c f . 
                    f f f 2 f c c f 2 f f f . 
                    . f b 4 f b b f 4 b f . . 
                    . f c b b b b b b c f . . 
                    . f f f c c c c f f f . . 
                    f c f a 2 2 2 2 a f c f . 
                    c b f 2 2 2 2 2 2 f b c . 
                    c c f 4 4 4 4 4 4 f c c . 
                    . . . f f f f f f . . . . 
                    . . . f f . . f f . . . . 
                    `,img`
                    . . . . . . . . . . . . . 
                    . . . . . f f f f . . . . 
                    . . . f f f f f f f f . . 
                    . . f f f f f f c f f f . 
                    f f f f f f f c c f f f c 
                    f f f f c f f f f f f f c 
                    . c c c f f f c c f f c c 
                    . f f f f f c c f f c c f 
                    . f f f 2 f c c f 2 f f f 
                    . f f b 4 f b b f 4 b f f 
                    . . f c b b b b b c c f c 
                    . f c f a 2 2 2 c b b b c 
                    . c b f 2 2 2 2 c b b c . 
                    . . . f b b b b b c c . . 
                    . . . f f f f f f f . . . 
                    . . . f f f . . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . 
                    . . . . f f f f . . . . . 
                    . . f f f f f f f f . . . 
                    . f f f c f f f f f f . . 
                    c f f f c c f f f f f f f 
                    c f f f f f f f c f f f f 
                    c c f f c c f f f c c c . 
                    f c c f f c c f f f f f . 
                    f f f 2 f c c f 2 f f f . 
                    f f b 4 f b b f 4 b f f . 
                    c f c c b b b b b c f . . 
                    c b b b c 2 2 2 a f c f . 
                    . c b b c 2 2 2 2 f b c . 
                    . . c c 4 4 4 4 4 f . . . 
                    . . . f f f f f f f . . . 
                    . . . . . . . f f f . . . 
                    `],
                100,
                true
                )
            } else if (randomNum == 0 && Math.percentChance(30)) {
                bossCanAttack = false
                bossStunned = true
                Florczak.setPosition(randint(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x + 50, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x - 50), randint(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y + 50, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y - 50))
                animation.runImageAnimation(
                Florczak,
                [img`
                    . . . . . 3 3 3 3 . . . . . 
                    . . . 3 3 f f f f 3 3 . . . 
                    . . 3 f f f f f f f f 3 . . 
                    . 3 f f f f f f c f f f 3 . 
                    3 f f f f f f c c f f f c 3 
                    3 f f f c f f f f f f f c 3 
                    3 c c c f f f c c f f c c 3 
                    3 f f f f f c c f f c c f 3 
                    3 f f f 2 f c c f 2 f f f 3 
                    . 3 f b 4 f b b f 4 b f 3 . 
                    . 3 f c b b b b b b c f 3 . 
                    . 3 f f f c c c c f f f 3 . 
                    3 f c f a 2 2 2 2 a f c f 3 
                    3 c b f 2 2 2 2 2 2 f b c 3 
                    3 c c f 4 4 4 4 4 4 f c c 3 
                    . 3 3 3 f f f f f f 3 3 3 . 
                    . . . 3 f f 3 3 f f 3 . . . 
                    . . . . 3 3 . . 3 3 . . . . 
                    `],
                100,
                true
                )
                timer.after(3000, function () {
                    bossCanAttack = true
                    bossStunned = false
                })
            } else {
                Florczak.setPosition(randint(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x + 50, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x - 50), randint(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y + 50, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y - 50))
                animation.runImageAnimation(
                Florczak,
                [img`
                    ..........ffff...........
                    ........ffffffff.........
                    .......ffffffcfff........
                    ......ffffffccfffc.......
                    ......fffcfffffffc.......
                    ......cccfffccffcc.......
                    ......fffffccffccf.......
                    ......fff2fccf2fff.......
                    .......fb4fbbf4bf........
                    .......fcbbbbbbcfccc.....
                    .......fffccccfffcbc.....
                    ......fcfa2222af.fcc.....
                    ......cbf222222f.........
                    ......ccf444444f.........
                    .........ffffff..........
                    .........ff..ff..........
                    `,img`
                    ..........ffff...........
                    ........ffffffff.........
                    .......ffffffcfff........
                    ......ffffffccfffc.......
                    ......fffcfffffffc.......
                    ......cccfffccffcc.......
                    ......fffffccffccf.......
                    ......fff2fccf2fff.......
                    .......fb4fbbf4bf........
                    ....cccfcbbbbbbcf........
                    ....cbcfffccccfff........
                    ....ccf.fa2222afcf.......
                    ........f222222fbc.......
                    ........f444444fcc.......
                    .........ffffff..........
                    .........ff..ff..........
                    `],
                100,
                true
                )
                attackBall = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . 2 2 . . . . . . . 
                    . . . . . . 3 1 1 3 . . . . . . 
                    . . . . . 2 1 1 1 1 2 . . . . . 
                    . . . . . 2 1 1 1 1 2 . . . . . 
                    . . . . . . 3 1 1 3 . . . . . . 
                    . . . . . . . 2 2 . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.projectile2)
                attackBall.setPosition(Florczak.x, Florczak.y)
                burnerSprite.setPosition(mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).x, mp.getPlayerSprite(mp.playerSelector(mp.PlayerNumber.One)).y)
                attackBall.follow(burnerSprite, 50)
                timer.after(500, function () {
                    sprites.destroyAllSpritesOfKind(SpriteKind.projectile2, effects.ashes, 100)
                })
            }
        }
    }
})

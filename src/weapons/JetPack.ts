/**
 * JetPack.js
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="../system/Graphics.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Physics.ts"/>
///<reference path="../Terrain.ts"/>
///<reference path="BaseWeapon.ts"/>

class JetPack extends BaseWeapon
{
    thurstScaler: number;
    bottomflame: Sprite;
    sideflame: Sprite;
    forceDir;

    fuel: number;
    
    INITAL_FUEL: number;

    constructor ()
    {
        super(
           "Jet Pack",
           2,
         Sprites.weaponIcons.jetPack,
         Sprites.worms.takeOutJetPack,
         Sprites.worms.defualtJetPack
       );

        this.thurstScaler = 0.15;
        this.forceDir = new b2Vec2(0, 0);
        this.bottomflame = new Sprite(Sprites.weapons.jetPackFlamesDown);
        this.sideflame = new Sprite(Sprites.weapons.jetPackFlamesSide);

        // No requirement for crosshairs aiming
        this.requiresAiming = false;

        this.INITAL_FUEL = 15;
        this.fuel = this.INITAL_FUEL;
    }

    activate(worm: Worm)
    {
        if (this.getIsActive())
        {
            this.setIsActive(false);
        } else
        {
            super.activate(worm);
        }
    }

    draw(ctx)
    {
        if (this.isActive)
        {
            if (this.forceDir.y != 0)
            {
                var pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
                pos.x -= (this.bottomflame.getImage().width / 2) + this.worm.direction * 10;
                pos.y -= 4;
                this.bottomflame.draw(ctx, pos.x, pos.y);
            }

            if (this.forceDir.x != 0)
            {
                var pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
                pos.x -= this.worm.direction * 13;
                pos.y -= 15;

                ctx.save()
                ctx.translate(pos.x, pos.y);

                if (this.worm.direction == this.worm.DIRECTION.right)
                {
                    // Used to flip the sprites       
                    ctx.scale(-1, 1);
                }
                this.sideflame.draw(ctx, 0, 0);
                ctx.restore();

            }

            var pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
            ctx.save()
            ctx.translate(pos.x, pos.y);
            ctx.drawImage(ThrowableWeapon.numberBox, 30, -40);
            ctx.fillStyle = 'rgba(255,0,0,255)';
            ctx.fillText(Math.floor(this.fuel), 42, -20);
            ctx.restore();

        }
    }

    update()
    {
        if (this.fuel <= 0)
        {
            this.setIsActive(false);
            this.fuel = this.INITAL_FUEL;
        }

        if (this.isActive)
        {
            this.forceDir = new b2Vec2(0, 0);

            if (keyboard.isKeyDown(Controls.aimUp.keyboard))
            {
                this.forceDir.y = -1;
            }

            if (keyboard.isKeyDown(Controls.walkLeft.keyboard))
            {
                this.forceDir.x = -1.2;
                this.worm.direction = -1;
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard))
            {
                this.forceDir.x = 1.2;
                this.worm.direction = 1;
            }

            if (this.forceDir.Length() > 0)
            {
                Utilies.pickRandomSound(["JetPackLoop1", "JetPackLoop2"]).play();
                this.fuel -= 0.1;
                this.forceDir.Multiply(this.thurstScaler);
                this.worm.body.ApplyImpulse(this.forceDir, this.worm.body.GetWorldCenter());
            }

            this.worm.setSpriteDef(Sprites.worms.defualtJetPack);
            this.worm.finished = true;

            if (this.forceDir.y != 0)
                this.bottomflame.update();

            if (this.forceDir.x != 0)
                this.sideflame.update();
        }
    }

}
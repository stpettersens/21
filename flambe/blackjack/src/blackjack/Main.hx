/*
    Blackjack
    Copyright 2015 Sam Saint-Pettersen
    Released under the MIT/X11 License.
    
    Flambe/Haxe implementation
*/
package blackjack;

import flambe.Entity;
import flambe.System;
import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.display.FillSprite;
import flambe.display.ImageSprite;

class Main
{
    static var debug: Bool = true;
    static var ai: Bool = false;
    static var playing: Bool = true;
    static var player_index: Int = 2;
    static var player_cards: Array<String>;
    static var dealer_index: Int = 2;
    static var dealer_cards: Array<String>;
    static var screentip: Screentip = null;
    static var instruction: Score = null;
    static var p_score: Score = null;
    static var d_score: Score = null;
    static var dealer_pile: Card = null;
    static var cards: Cards = null;
    static var player: Player = null;
    static var dealer: Dealer = null;
    static var timer: Int = 0;
    static var assets: AssetPack;

    static var SCREEN_WIDTH: Int = 780;
    static var SCREEN_HEIGHT: Int = 500;

    private static function main()
    {
        // Wind up all platform-specific stuff.
        System.init();

        // Load up the compiled pack in the assets directory named "bootstrap".
        var manifest = Manifest.fromAssets("bootstrap");
        var loader = System.loadAssetPack(manifest);
        loader.get(onSuccess);
    }

    private static function onSuccess(pack: AssetPack)
    {
        Debug.emit(debug, "Initialized Blackjack (Flambe/Haxe build).");
        assets = pack;

        // Add a solid color background.
        var background = new FillSprite(0x009900, System.stage.width, System.stage.height);
        System.root.addChild(new Entity().add(background));

        screentip = new Screentip(debug, ((SCREEN_WIDTH / 2) - 50), 190);
        instruction = new Score(debug, ((SCREEN_WIDTH / 2) - 155), 450);
        p_score = new Score(debug, 153, 315);
        d_score = new Score(debug, 153, 25);
        cards = new Cards();
        newGame();
    }

    private static function showCards(): Void
    {
        playing = false;
        dealer_cards[0] = dealer.revealFirstCard();
        var ds: Int = dealer.showCards();
        var ps: Int = player.showCards();

        if(ps == 21 && player_index == 2 && ds != 21)
            screentip.emit("PLAYER BLACKJACK!", "Player has 21. That's a Blackjack!");

        else if(ds == 21 && dealer_index == 2 && ps != 21)
            screentip.emit("DEALER BLACKJACK!", "Dealer has 21. That's a Blacjack!");

        else if((ps == ds) || (ps > 21 && ds > 21))
            screentip.emit("PUSH", "Neither dealer nor player won.");

        else if(ps <= 21 && ps > ds)
            screentip.emit("PLAYER WINS", "Player wins with $ps. Well done.");

        else if(ds <= 21 && ds > ps)
            screentip.emit("DEALER WINS", "Dealer wins with $ds. Too bad.");

        else if(ps > 21 && ds <= 21)
            screentip.emit("DEALER WINS", "Dealer wins. Player bust.");

        else if(ds > 21 && ps <= 21)
            screentip.emit("PLAYER WINS", "Player wins. Dealer bust.");

        if(cards.getPlayed() == 52)
            dealer_pile = new Card("d", 10, 10, assets);

        Debug.emit(debug, "Cards played $cards.getPlayed()");
        d_score.emit(dealer.calcTotal());
        instruction.emit("Play again? Yes [Y key or LMB] or No [N key or Escape key].");
    }

    private static function newGame(): Void
    {
        playing = true;
        player_index = 2;
        player_cards = new Array<String>();
        dealer_index = 2;
        dealer_cards = new Array<String>();
        dealer_pile = new Card("c", 10, 10, assets);
        dealer_pile.draw();

        screentip.clear();
        player = new Player(debug, assets);
        dealer = new Dealer(debug, assets);
        dealer.shuffle(cards);
        player_cards = player.receiveCards(dealer.deal(cards));
        /*dealer_cards = dealer.receiveCards();*/
   
        var pc1 = new Card("sA", 205, 310, assets);
        var pc2 = new Card("s2", 295, 310, assets);
        var pc3 = new Card("s3", 385, 310, assets);
        var pc4 = new Card("s4", 475, 310, assets);
        var pc5 = new Card("s5", 565, 310, assets);

        var dc1 = new Card("hA", 205, 10, assets);
        var dc2 = new Card("h2", 295, 10, assets);
        var dc3 = new Card("h3", 385, 10, assets);
        var dc4 = new Card("h4", 475, 10, assets);
        var dc5 = new Card("h5", 565, 10, assets);
        
        pc1.draw();
        pc2.draw();
        pc3.draw();
        pc4.draw();
        pc5.draw();
        
        dc1.draw();
        dc2.draw();
        dc3.draw();
        dc4.draw();
        dc5.draw();
    }

    private static function update(): Void
    {
        if(hasBlackjack() || isBust())
            showCards();

        p_score.emit(player.calcTotal());

        if(playing)
        {
            d_score.emit("?");
            instruction.emit("Hit [H key or LMB] or Stand [S key or RMB]?");
        }
    }

    private static function hasBlackjack(): Bool
    {
        var blackjack: Bool = false;
        if(player.hasBlackjack() || dealer.hasBlackjack())
            blackjack = true;

        return blackjack;
    }

    private static function isBust(): Bool
    {
        var bust: Bool = false;
        if(player.isBust() || dealer.isBust())
            bust = true;

        return bust;
    }

    private static function hit(): Void
    {
        if(player_index < 6)
        {
            player_cards[player_index] = player.hit(cards);
            player_index++;
            update();
        }
    }

    private static function stand(): Void
    {
        player.stand();
        /*var received: Array<String> = dealer.respond(cards);
        for(i in 0 ... received.length)
        {
            var xy: Array<Int> = dealer_cards[dealer_index].getXY();
            dealer_cards[dealer_index].setXY(xy[0], xy[1]);
            Debug.emit(debug, "Added image at $xy[0],$xy[1]");
            Debug.emit(debug, dealer_index);
            dealer_index++;
        }*/
        showCards();
    }

    private static function clear(): Void
    {
        // TODO
    }

    private static function exitToGitHub(): Void
    {
        // TODO
    }
}

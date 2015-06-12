-- Blackjack
-- Copyright 2015 Sam Saint-Pettersen
-- Released under the MIT/X11 License.
--
-- Powered by the LÖVE Game Engine

require 'cards'
require 'card'
require 'player'
require 'dealer'
require 'ai'
require 'screentip'
require 'score'

-- Window parameters
TITLE = 'Blackjack'
SCREEN_WIDTH = 780
SCREEN_HEIGHT = 500

-- Globals
debug = false
use_ai = false
playing = true
player_index = 3
player_cards = {}
dealer_index = 3
dealer_cards = {}
timer = 0

player = nil
dealer = nil
cards = nil
chips = nil

function love.load(args)
	-- Handle any command line arguments to the game.
	for i = 1, #args do
		if args[i] == '--debug' or args[i] == '-d' then
			debug = true
		elseif args[i] == '--ai' or args[i] == '-a' then
			use_ai = true
		end
	end

	love.window.setTitle(TITLE)
	love.window.setMode(SCREEN_WIDTH, SCREEN_HEIGHT)
	love.graphics.setBackgroundColor(0, 153, 0) -- 0, 153, 0
	
	screentip = Screentip.create(debug, ((SCREEN_WIDTH / 2) - 50), 190)
	instruction = Score.create(debug, ((SCREEN_WIDTH /2) - 145), 435)
	p_score = Score.create(debug, 153, 305)
	d_score = Score.create(debug, 153, 15)
	newGame()
end

function love.draw()
	screentip:draw()
	instruction:draw()
	p_score:draw()
	d_score:draw()
	dealer_pile:draw()
	for i = 1, #player_cards do
		player_cards[i]:draw()
	end
	for i = 1, #dealer_cards do
		dealer_cards[i]:draw()
	end
end

function love.update(dt)
	timer = timer + dt
	if timer >= 3 and use_ai and not playing then
		timer = timer - 3
		newGame()
	end

	if hasBlackjack() or isBust() then
		showCards()
	end

	p_score:emit(player:calcTotal())

	if playing then
		d_score:emit('?')
		if not use_ai then
			if not isTouchScreenDevice() then
				instruction:emit('Hit [H key or LMB] or Stand [S key or RMB]?')
			else
				instruction:emit('Hit [Single tap] or Stand [Double tap]?')
			end
		end
	else
		d_score:emit(dealer:calcTotal())
		if not use_ai then
			if not isTouchScreenDevice() then
				instruction:emit('Play again? Yes [Y key or LMB] or No [N or Escape key].')
			else
				instruction:emit('Play again? Single tap screen to continue.')
			end
		end
	end
end

function hasBlackjack()
	local blackjack = false
	if player:hasBlackjack() or dealer:hasBlackjack() then
		blackjack = true
	end
	return blackjack
end

function isBust()
	local bust = false
	if player:isBust() or dealer:isBust() then
		bust = true
	end
	return bust
end

function isTouchScreenDevice()
	local isTouch = false;
	local os = love.system.getOS()
	if os == 'Android' or os == 'iOS' then
		isTouch = true
	end
	return isTouch
end

function newGame()
	playing = true
	player_index = 3
	player_cards = {}
	dealer_index = 3
	dealer_cards = {}
	screentip:clear()
	dealer_pile = Card.create(Card_getImage('c'), 10, 10)
	cards = Cards.create()

	-- Use AI or human player depending on configuration.
	if not use_ai then
		player = Player.create(debug)
	else
		player = AI.create(debug)
	end

	dealer = Dealer.create(debug)
 	dealer:shuffle(cards)
	player_cards[1], player_cards[2] = player:receiveCards(dealer:deal(cards))
	dealer_cards[1], dealer_cards[2] = dealer:receiveCards()
	player_cards[3] = Card.create(Card_getImage('d'), 405, 310)
	player_cards[4] = Card.create(Card_getImage('d'), 495, 310)
	player_cards[5] = Card.create(Card_getImage('d'), 585, 310)
	dealer_cards[3] = Card.create(Card_getImage('d'), 405, 10)
	dealer_cards[4] = Card.create(Card_getImage('d'), 495, 10)
	dealer_cards[5] = Card.create(Card_getImage('d'), 585, 10)

	if use_ai then
		local received = player:respond(cards)
		if #received > 0 then
			for i = 1, #received do
				player_cards[player_index] = received[i]
				player_index = player_index + 1
			end
		end
		stand()
	end
end

function showCards()
	playing = false
	dealer_cards[1] = dealer:revealFirstCard()
	local ds = dealer:showCards()
	local ps = player:showCards()

	if ps == 21 and player_index == 3 and ds ~= 21 then
		screentip:emit('PLAYER BLACKJACK!', 'Player has 21. That\'s a Blackjack!')
	elseif ds == 21 and dealer_index == 3 and ps ~= 21 then
		screentip:emit('DEALER BLACKJACK!', 'Dealer has 21. That\'s a Blackjack!')
	elseif ps == ds or (ps > 21 and ds > 21) then
		screentip:emit('PUSH', 'Neither dealer nor player won.')
	elseif ps <= 21 and ps > ds then
		screentip:emit('PLAYER WINS', 'Player wins with ' .. tostring(ps) .. '. Well done.')
	elseif ds <= 21 and ds > ps then
		screentip:emit('DEALER WINS', 'Dealer wins with ' .. tostring(ds) .. '. Too bad.')
	elseif ps > 21 and ds <= 21 then
		screentip:emit('DEALER WINS', 'Dealer wins. Player bust.')
	elseif ds > 21 and ps <= 21 then
		screentip:emit('PLAYER WINS', 'Player wins. Dealer bust.')
	end
	if cards:getPlayed() == 52 then
		dealer_pile = Card.create(Card_getImage('d'), 10, 10)
	end
	_print('Cards played ' .. tostring(cards:getPlayed()))
end

function hit()
	if player_index < 6 then
		player_cards[player_index] = player:hit(cards)
		player_index = player_index + 1
	end
end

function stand()
	if not use_ai then
		player:stand()
	end
	local received = dealer:respond(cards)
	if #received > 0 then
		for i = 1, #received do
			x, y = dealer_cards[dealer_index]:getXY()
			dealer_cards[dealer_index] = received[i]
			dealer_cards[dealer_index]:setXY(x, y)
			dealer_index = dealer_index + 1
		end
	end
	showCards()
end

function love.keypressed(key)
	if playing and not use_ai then
		if key == 'h' then
			hit()
		elseif key == 's' then
			stand()

		elseif key == 'escape' then
			love.event.quit()
		end

	elseif not playing and not use_ai then
		if key == 'y' then
			newGame()
		elseif key == 'n' or key == 'escape' then
			love.event.quit()
		end
	else
		if key == 'escape' then
			love.event.quit()
		end
	end
end

function love.mousepressed(x, y, button)
	if playing and not use_ai then
		if button == 'l' then
			hit()
		elseif button == 'r' then
			stand()
		end

	elseif not playing and not use_ai then
		if button == 'l' then
			newGame()
		end
		-- Let N or Escape key handle quit.
	end		
end

function love.touchpressed(id, x, y)
	if playing and not use_ai then
		if love.touch.getTouchCount() == 1 then
			hit()
		elseif love.touch.getTouchCount() == 2 then
			stand()
		end

	elseif not playing and not use_ai then
		if love.touch.getTouchCount() == 1 then
			newGame()
		end
		-- Let device's usual button handle quit.
	end
end

function _print(message)
	if debug then
		print(message)
	end
end

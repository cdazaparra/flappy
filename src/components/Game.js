import kaboom from 'kaboom'
import React from 'react'

export const Game = () => {
	const canvasRef = React.useRef(null)

	// just make sure this is only run once on mount so your game state is not messed up
	React.useEffect(() => {
		const k = kaboom({
			// if you don't want to import to the global namespace
			global: false,
			// if you don't want kaboom to create a canvas and insert under document.body
			canvas: canvasRef.current,
		})

		k.add([k.text('oh hi'), k.pos(40, 10)])

		// write all your kaboom code here
		// load assets
		k.loadSprite('birdy', 'sprites/bird.png')
		k.loadSprite('bg', 'sprites/bg.png')
		k.loadSprite('pipe', 'sprites/pipe.png')
		k.loadSound('wooosh', 'sounds/wooosh.mp3')

		let highScore = 0
		k.scene('game', () => {
			const PIPE_GAP = 120
			let score = 0

			k.add([
				k.sprite('bg', { width: k.width(), height: k.height() + 300 }),
			])

			const scoreText = k.add([k.text(score, { size: 50 })])

			// add a game object to screen
			const player = k.add([
				// list of components
				k.sprite('birdy'),
				k.scale(2),
				k.pos(80, 40),
				k.area(),
				k.body(),
			])

			function producePipes() {
				const offset = k.rand(-100, 100)

				k.add([
					k.sprite('pipe'),
					k.pos(k.width(), k.height() / 2 + offset + PIPE_GAP / 2),
					'pipe',
					k.area(),
					{ passed: false },
				])

				k.add([
					k.sprite('pipe', { flipY: true }),
					k.pos(k.width(), k.height() / 2 + offset - PIPE_GAP / 2),
					k.origin('botleft'),
					'pipe',
					k.area(),
				])
			}

			k.loop(1.5, () => {
				producePipes()
			})

			k.action('pipe', (pipe) => {
				pipe.move(-160, 0)

				if (pipe.passed === false && pipe.pos.x < player.pos.x) {
					pipe.passed = true
					score += 1
					scoreText.text = score
				}
			})

			player.collides('pipe', () => {
				k.go('gameover', score)
			})

			player.action(() => {
				if (player.pos.y > k.height() + 30 || player.pos.y < -30) {
					k.go('gameover', score)
				}
			})

			k.keyPress('space', () => {
				k.play('wooosh')
				player.jump(400)
			})
		})
		k.scene('gameover', (score) => {
			if (score > highScore) {
				highScore = score
			}

			k.add([
				k.text(
					'gameover!\n' +
						'score: ' +
						score +
						'\nhigh score: ' +
						highScore,
					{
						size: 45,
					}
				),
			])

			k.keyPress('space', () => {
				k.go('game')
			})
		})

		k.go('game')
	}, [])

	return <canvas ref={canvasRef}></canvas>
}

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

		// write all your kaboom code here
		// Load assets
		k.loadSprite('bird', '/sprites/bird.png')
		k.loadSprite('ghosty', '/sprites/ghosty.png')
		k.loadSprite('grass', '/sprites/grass.png')
		k.loadSprite('vertical', '/sprites/vertical.png')
		k.loadSprite('horizontal', '/sprites/horizontal.png')
		k.loadSprite('bg', '/sprites/bg.png')
		k.loadSprite('nutria', '/sprites/nutria.png', {
			// The image contains 9 frames layed out horizontally, slice it into individual frames
			sliceX: 30,
			// Define animations
			anims: {
				idle: {
					// Starts from frame 0, ends at frame 3
					from: 0,
					to: 29,
					// Frame per second
					speed: 10,
					loop: true,
				},
				run: {
					from: 0,
					to: 29,
					speed: 10,
					loop: true,
				},
				// This animation only has 1 frame
				jump: 8,
			},
		})
		k.loadSprite('glotona', '/sprites/glotona.png', {
			// The image contains 9 frames layed out horizontally, slice it into individual frames
			sliceX: 18,
			// Define animations
			anims: {
				idle: {
					// Starts from frame 0, ends at frame 3
					from: 0,
					to: 17,
					// Frame per second
					speed: 10,
					loop: true,
				},
				run: {
					from: 0,
					to: 17,
					speed: 10,
					loop: true,
				},
				// This animation only has 1 frame
				jump: 8,
			},
		})
		k.loadSprite('dino', '/sprites/dino.png', {
			// The image contains 9 frames layed out horizontally, slice it into individual frames
			sliceX: 24,
			// Define animations
			anims: {
				idle: {
					// Starts from frame 0, ends at frame 3
					from: 0,
					to: 23,
					// Frame per second
					speed: 5,
					loop: true,
				},
				run: {
					from: 0,
					to: 23,
					speed: 10,
					loop: true,
				},
				// This animation only has 1 frame
				jump: 8,
			},
		})
		k.add([k.sprite('bg')])
		// Define player movement speed
		const SPEED = 320

		// Add player game object
		const player = k.add([
			k.sprite('dino'),
			k.pos(580, 540),
			k.color(),
			// area() component gives the object a collider, which enables collision checking
			k.area(),
			// solid() component makes the object can't move pass other solid objects
			k.solid(),
		])
		player.play('idle')
		// Register input handlers & movement
		const nutria = k.add([
			k.sprite('nutria'),
			k.pos(520, 500),
			k.color(),
			// area() component gives the object a collider, which enables collision checking
			k.area(),
			// solid() component makes the object can't move pass other solid objects
			k.solid(),
		])
		nutria.play('idle')
		// Register input handlers & movement
		const glotona = k.add([
			k.sprite('glotona'),
			k.pos(80, 40),
			k.color(),
			// area() component gives the object a collider, which enables collision checking
			k.area(),
			// solid() component makes the object can't move pass other solid objects
			k.solid(),
		])
		glotona.play('idle')

		k.onKeyDown('left', () => {
			player.move(-SPEED, 0)
		})

		k.onKeyDown('right', () => {
			player.move(SPEED, 0)
		})

		k.onKeyDown('up', () => {
			player.move(0, -SPEED)
		})

		k.onKeyDown('down', () => {
			player.move(0, SPEED)
		})

		// Add enemies
		for (let i = 0; i < 3; i++) {
			const x = k.rand(0, k.width())
			const y = k.rand(0, k.height())

			k.add([
				k.sprite('ghosty'),
				k.pos(x, y),
				// Both objects must have area() component to enable collision detection between
				k.area(),
				'enemy',
			])
		}

		k.add([
			k.sprite('grass'),
			k.pos(k.center()),
			k.area(),
			// This game object also has solid(), so our player won't be able to move pass this
			k.solid(),
		])
		k.add([
			k.sprite('vertical'),
			k.pos(180, 100),
			k.area(),
			// This game object also has solid(), so our player won't be able to move pass this
			k.solid(),
		])
		k.add([
			k.sprite('horizontal'),
			k.pos(450, 430),
			k.area(),
			// This game object also has solid(), so our player won't be able to move pass this
			k.solid(),
		])
		// .onCollide() is provided by area() component, it registers an event that runs when an objects collides with another object with certain tag
		// In this case we destroy (remove from game) the enemy when player hits one
		player.onCollide('enemy', (enemy) => {
			k.destroy(enemy)
		})

		// .clicks() is provided by area() component, it registers an event that runs when the object is clicked
		player.onClick(() => {
			k.debug.log('what up')
		})

		player.onUpdate(() => {
			// .isHovering() is provided by area() component, which returns a boolean of if the object is currently being hovered on
			if (player.isHovering()) {
				player.color = k.rgb(0, 0, 255)
			} else {
				player.color = k.rgb()
			}
		})

		// Enter inspect mode, which shows the collider outline of each object with area() component, handy for debugging
		// Can also be toggled by pressing F1
		k.debug.inspect = true

		// Check out https://kaboomjs.com#AreaComp for everything area() provides
	}, [])

	return <canvas ref={canvasRef} height='800'></canvas>
}

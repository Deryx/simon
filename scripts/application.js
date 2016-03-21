var simonModule = (function() {
	var buttons = [
		{color: "#008000", sound: "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"},
		{color: "#FF0000", sound: "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"},
		{color: "#0000FF", sound: "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"},
		{color: "#F5AB35", sound: "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"}
	];

	var lightTime = 500;


	var round = 1;
	var maxRounds = 20;

	var clicks = 0;
	
	// Control switch statuses
	var switchStatus = "off";
	var strictStatus = "off";
	var startStatus = "off";

	// Pattern counter
	var counter = document.querySelector( '.count p' );

	// Strict mode indicator
	var indicator = document.querySelector( '.strict > .indicator' );

	var computerPattern = [];
	var playerPattern = [];

	var playerSelection = 0;

	var turn;

	// Control buttons
	var switchButton = document.querySelector( '.case > .switch' );
	switchButton.addEventListener( "click", function() {
		if( switchStatus === "off") {
			this.style.float = "right";

			counter.textContent = showDoubleDigit( 0 );

			switchStatus = "on";
		} else {
			this.style.float = "left";

			counter.textContent = "--";

			switchStatus = "off";
			startStatus = "off";

			indicator.style.background = "red";
		}
	}, true);

	var strictButton = document.querySelector( '.strict > .button' );
	strictButton.addEventListener( 'click', function() {
		if( switchStatus === "on" ) {
			if( strictStatus === "off" ) {
				indicator.style.background = "green";
				strictStatus = "on";
			} else {
				indicator.style.background = "red";
				strictStatus = "off";
			}
		}
	}, true);

	var startButton = document.querySelector( '.start' );
	startButton.addEventListener( 'click', function( evt ) {
		computerPattern = [];

		if( switchStatus === "on" ) {
			computerPattern = [];
			playerPattern = [];
			round = 1;
		}

		(function playGame() {	
			(function playRound() {
				counter.textContent = showDoubleDigit( round );
				
				playComputerPattern( round );
				
				setTimeout( getButtonClick(), round * 1500 );
				
				if( round < maxRounds ) {
					if( arraysAreIdentical( computerPattern, playerPattern ) ) {
						setTimeout( playGame, round * 3000 );
						
						playerPattern = [];

						round++;
					} else {
						computerPattern = [];
						
						playerPattern = [];
						
						round = 1;
					}
				}
			})();
		})();
	});

	function addButton() {
		computerPattern.push( randomButton() );
	}

	function lightButton( btn ) {
		var originalColor = buttons[ btn ].color;

		var lightColor = LightenDarkenColor( originalColor, 90 );

		var button = document.querySelector( "[id='" + btn + "']" );
		button.style.background = lightColor;

		playSound( btn );

		setTimeout( function() {
			button.style.backgroundColor = originalColor;
		}, lightTime);
	}

	function LightenDarkenColor( col, amt ) {

		var usePound = false;

		if (col[0] == "#") {
			col = col.slice(1);
			usePound = true;
		}

		var num = parseInt(col,16);

		var r = (num >> 16) + amt;

		if (r > 255) r = 255;
		else if  (r < 0) r = 0;

		var b = ((num >> 8) & 0x00FF) + amt;

		if (b > 255) b = 255;
		else if  (b < 0) b = 0;

		var g = (num & 0x0000FF) + amt;

		if (g > 255) g = 255;
		else if (g < 0) g = 0;

		return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

	}

	function playSound( btn ) {
		var sound = buttons[ btn ].sound;

		var button = document.querySelector( "div[id='" + btn + "'] audio" );

		button.innerHTML = "<source src='" + sound + "'>";
		button.play();
	}
	
	function playComputerPattern( rnd ) {
		var index = 0;

		addButton();
		(function sequence() {
			var button = computerPattern[ index ];
			lightButton( button );

			if( index < rnd ) {
				setTimeout( sequence, 2000 );
				
				index++;
			}
		})();
	}

	function getButtonClick() {
		var btnClicked;
		var colorButton = document.querySelector( '[class=buttons]' );
		colorButton.onclick = function( event ) {
			event = event || window.event;
			var target = event.target || event.srcElement;

			if( !isNaN( target.id ) ) {
				btnClicked = target.id;
				playerPattern.push( btnClicked );
				lightButton( btnClicked );
			}
		};
	}
	
	function arraysAreIdentical( arr1, arr2 ) {
		if( arr1.length !== arr2.length ) return false;
		for( var i = 0, len = arr1.length; i < len; i++ ) {
			if( arr1[i] !== arr2[2] ) {
				return false;
			}
		}
		
		return true;
	}

	function showDoubleDigit( num ) {
		if( num >= 0 && num <= 9 ) {
			return "0" + num;
		} else {
			return num;
		}
	}

	function randomButton() {
		return Math.floor( Math.random() * 4 );
	}
})();

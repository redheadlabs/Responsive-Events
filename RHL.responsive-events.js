;( function( RHLResponsive, window, document, $, undefined ){

	var defaults = {},
		settings

	RHLResponsive.bFirstResize = true
	RHLResponsive.hasChanged = -1
	RHLResponsive.viewport_width = -1
	RHLResponsive.breakpoint_current = -1
	RHLResponsive.breakpoint_previous = -1
	RHLResponsive.breakPoints = {xs: 480, sm: 600, md: 1024, lg: 1280, xl: 1600}
	RHLResponsive.events = {}
	RHLResponsive.settings = {}
	RHLResponsive.init = function( options ){

		settings = RHLResponsive.settings = $.extend( {}, defaults, options )

		//Define Changes on Resize
		RHLResponsive.switchElements('sm', ['#top-nav', '.linksList'])
		RHLResponsive.onBreakpoint('md', function(){

			$('.Left').prepend(
				$('#SideCategoryList-Left').detach()
			)
		}, function(){

			$('#SideCategoryList-Left').detach().insertAfter('#SideCategoryList-Right')
			$('#SideCategoryList-Left .category-list').css('display', 'block')
		})

		//Events
		$( window ).on('load resize', this.eventWindowResize).trigger('resize')
	}
	//Custom (on all resize events)
	RHLResponsive.eventWindowResizeCustom = function(){

		$('.productOptionPreviewDisplay').css('display', 'none')
	}
	RHLResponsive.eventWindowResize = function(){

		RHLResponsive.viewport_width = RHLViewport.getDimensions().width
		RHLResponsive.breakpoint_previous = RHLResponsive.breakpoint_current

		if( RHLResponsive.viewport_width >= RHLResponsive.breakPoints.md  ){

			RHLResponsive.breakpoint_current = 'md'
		}else
		if( RHLResponsive.viewport_width <= RHLResponsive.breakPoints.sm ){

			RHLResponsive.breakpoint_current = 'xs'
		}else{

			RHLResponsive.breakpoint_current = 'sm'
		}

		RHLResponsive.hasChanged = RHLResponsive.breakpoint_previous !== RHLResponsive.breakpoint_current

		if( RHLResponsive.hasChanged === true || RHLResponsive.bFirstResize === true )
			RHLResponsive.runEvents()

		RHLResponsive.bFirstResize = false
	}
	RHLResponsive.runEvents = function(){

		RHLResponsive.eventWindowResizeCustom()

		if( RHLResponsive.breakpoint_previous in RHLResponsive.events ){

			$.each( RHLResponsive.events[ RHLResponsive.breakpoint_previous ].off, function( key, callback ){

				if( typeof callback === 'function' ) callback()
			})
		}
		if( RHLResponsive.breakpoint_current in RHLResponsive.events ){

			$.each( RHLResponsive.events[ RHLResponsive.breakpoint_current ].on, function( key, callback ){

				if( typeof callback === 'function' ) callback()
			})
		}
	}
	RHLResponsive.onBreakpoint = function( breakpoint, callbackOn, callbackOff ){

		if( !(breakpoint in RHLResponsive.breakPoints) ) return false

		var breakpointHasEvents = breakpoint in RHLResponsive.events

		if( breakpointHasEvents === false )
			RHLResponsive.events[ breakpoint ] = {on: [], off: []}

		if( typeof callbackOn === 'function' )
			RHLResponsive.events[ breakpoint ].on.push( callbackOn )

		if( typeof callbackOff === 'function' )
			RHLResponsive.events[ breakpoint ].off.push( callbackOff )
	}
	RHLResponsive.switchElements = function( onBreakpointTrigger, elems ){

		if( elems.length === 0 ) return false

		if( RHLResponsive.is('breakpoint', onBreakpointTrigger) ){

			RHLResponsive.onBreakpoint( onBreakpointTrigger,
				function(){
					//On
					RHLResponsive.switchElementsCallback('on')
				},
				function(){
					//Off
					RHLResponsive.switchElementsCallback('off')
				}
			)
		}
	}
	RHLResponsive.switchElementsCallback = function( mode, elems ){

		if( typeof elems === 'undefined' ) return false

		var $elem =
			$elemPrevious =
			elemExists =
			elemPreviousExists = -1,
			switchElementsKey = RHLResponsive.generate.key(),
			key_prefix =  switchElementsKey + '-'

		switch( mode ){
			case 'on':

				$.each( elems, function( idx, elem ){

					switchElementsCallbackEach()
				})

				break;
			case 'off':

				$( $('[id^="' + switchElementsKey + '"]').get().reverse() ).each( function( idx, elem ){

					switchElementsCallbackEach()
				})

				break;
		}

		switchElementsCallbackEach = function(){

			$elem = $( elem )
			elemExists = $elem.length !== 0

			if( elemExists === false ) return false

			$elem.wrap( $('<span />', {id: key_prefix + idx }) )

			if( elemPreviousExists !== -1 ){

				elemPreviousExists = $elemPrevious.length !== 0

				if( elemPreviousExists === true ){

					var $elemWrapper = $elem.parent(),
						$elemPreviousWrapper = $elemPrevious.parent()

					$elemWrapper.css({opacity: 0})
					$elemPreviousWrapper.css({opacity: 0})

					$elemWrapper.prepend( $elemPrevious.detach() )
					$elemWrapperPrevious.prepend( $elem.detach() )

					$elemWrapper.css({opacity: 1})
					$elemPreviousWrapper.css({opacity: 1})
				}
			}

			$elemPrevious = $elem
		}
	}
	RHLResponsive.is = function(){

		if( arguments.length === 0 ) return false

		var result 	= false,
			type 	= arguments[0],
			value 	= arguments[1]

		switch( type ){
			case 'breakpoint':

				result = value in RHLResponsive.breakPoints
				break;
		}

		return result
	}
	RHLResponsive.generate = {
		key: function(){

			var text = ""
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

			for( var i=0; i < 5; i++ )
				text += possible.charAt( Math.floor( Math.random() * possible.length ) )

			return text
		}
	}
}(
	window.RHLResponsive = window.RHLResponsive || {},
	window,
	document,
	jQuery
))
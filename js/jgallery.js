/*!
 * jGallery jQuery Plugin v1.0
 *
 * http://blog.igorescobar.com/
 *
 * Copyright 2010, Igor Escobar
 *
 * Date: Mon Jul 5 22:43:34 2010
 */

var jOptions = null;

jQuery.fn.createjGallery = function ( ) {
	
	$( 'body' ).prepend (  
	 '<div class="jgBackground"></div> \
		<div class="jgContainer"> \
			<div class="image"> \
				<div class="nav"> \
					<a href="javascript:void(0)" rel="prev"><img src="images/prev.gif" /></a> \
					<a href="javascript:void(0)" rel="next"><img src="images/next.gif" /></a> \
					<a href="javascript:void(0)" rel="close"><img src="images/close.gif" /></a> \
				</div> \
				<img src="images/loading.gif" width="36" height="36" id="jgallery"/> \
				<div class="legenda"></div> \
				<a href="javascript:void(0);" class="jgcarocel-prev"><img src="images/arrow-left.gif" /></a> \
				<a href="javascript:void(0);" class="jgcarocel-next"><img src="images/arrow-right.gif" /></a> \
				<div class="jgCarrocel"> \
					<div class="jgFullGallery"></div> \
				</div> \
			</div> \
	   </div>' );
		
}

jQuery.fn.setjGalleryEvents = function ( ) {
	
	// se a janela for redimencionada
	$( window ). bind ( 'resize' , function () {
		$( this )._setContainerCSS ( );
		$( this ).centralizaImageContainer ( );
	});
	
	// se clicar no background feche o jGallery
	$( '.jgBackground' ).bind ( 'click' , function () {
		$( 'div.jgContainer > *' ).fadeOut ( 'slow' , function () {
			$( 'div.jgBackground' ).fadeOut ( 'slow' );
		});
	});
	
	// passa para proxima imagem
	$('.jgContainer .image div.nav a[rel=next]').bind ('click', function () {
		if ( jgOptions.openedImage.next().length > 0 )
			$(this)._switchImage ( jgOptions.openedImage.next() );
	});
	
	// volta para a imagem anterior
	$('.jgContainer .image div.nav a[rel=prev]').bind ('click', function () {
		if ( jgOptions.openedImage.prev().length > 0 )
			$(this)._switchImage ( jgOptions.openedImage.prev() );
	});
	
	// anda com o corocel
	$('.jgContainer .image a.jgcarocel-prev').bind ('click' , function () {
		if(jgOptions.jgGallery.css('right') != '0px' ) {
			jgOptions.jgGallery.animate ( { right: '-=300' } , 1000 );
		}
	});
	// anda com o corocel
	$('.jgContainer .image a.jgcarocel-next').bind ('click' , function () {
		jgOptions.jgGallery.animate ( { right: '+=300' } , 1000 );
	});
	
	// fecha o jGallery
	$('.jgContainer .image div.nav a[rel=close]').bind ('click', function () {	
		$( '.jgBackground' ).trigger('click');
	});
	
}

jQuery.fn.extend({	
	_getProportionalSize: function ( width , height ) {
		
		var sizes = Array(width, height);

		if ( width > jgOptions.jgImageMaxWidth ) {
			sizes[0] = jgOptions.jgImageMaxWidth;		
			sizes[1] = ( ( sizes[0] * width ) / width );			
		}	
		if ( height > jgOptions.jgImageMaxHeight ) {
			sizes[0] = ( ( sizes[1] * height ) / height );				
			sizes[1] = jgOptions.jgImageMaxHeight;
		}

		return sizes;
	},
	_setContainerCSS: function ( ) {
		
		// Seta o alpha no background caso o usuário escolha
		if ( typeof jgOptions.jgBackgroundOpacity == "number" ) {
			jgOptions.jgBackground.css ( { opacity: jgOptions.jgBackgroundOpacity } );
		}
				
		var largura_carrocel = jgOptions.jgContainerImageObject.css('width');
		
		jgOptions.jgGallery.css({'width': $( window ).width () });
		jgOptions.jgCarrocelGallery.css({'width': largura_carrocel });
		
		jgOptions.jgBackground.css ({
			height: $( window ).height () ,
			width: $( window ).width ()
		});
		
	},
	_setImage: function ( src, w, h ) {
		
		jgOptions.jgContainerImageObject.attr ( 'src', src );
		jgOptions.jgContainerImageObject.attr ( 'width', w );
		jgOptions.jgContainerImageObject.attr ( 'height', h );
		
	},
	_setLoader: function ( ) {
		
		$( this )._setImage ( 'images/loading.gif' , 36, 36 );
		$( this ).centralizaImageContainer ( );
		
	},
	_switchImage: function ( oLinkClick ) {
		
		jgOptions.openedImage = oLinkClick;
				
		// remove todas as classes referente a click de imagem
 		$('img').removeClass('jgImageClicked');
		
		// acrescenta a classe referente a imagem que foi clicada
		jgOptions.openedImage.find('img').addClass('jgImageClicked');
		
		// faz o preload da imagem
		var image_title = oLinkClick.find( 'img' ).attr('title');
		
		var preload = new Image ();
			preload.src =  oLinkClick.attr('href');	
		
		// quando a imagem carregar
		$( preload ).bind ('load', function ( ) {
			
			var sizes = $(this)._getProportionalSize(preload.width, preload.height);
			
			// evita que a imagem fique maior do que o permitido
			preload.width = sizes[0];
			preload.height = sizes[1];
			
			jgOptions.jgGalleryHeight = jgOptions.openedImage.find('img').height();
			
			jgOptions.jgGallery.css ( { 'height' : jgOptions.jgGalleryHeight } );
				
			// esconde o container da imagem
			jgOptions.jgContainerImage.fadeOut('fast', function () {
				
				// carrega imagem clicada
				$( this )._setImage ( oLinkClick.attr ( 'href' ) , preload.width, preload.height );		
				
				// Atualiza as propriedades CSS e Container
				$( this ).centralizaImageContainer ( );
				$( this )._setContainerCSS ( );
				
				// Atacha a legenda
				$( '.jgContainer .image div.legenda' ).html ( image_title );
				$( '.jgContainer .image div.legenda' ).fadeIn ( 'slow' );
				
				// mostra a imagem grande
				jgOptions.jgContainerImage.fadeIn ( 'fast' );
			})
		});
	},
	centralizaImageContainer: function ( ) {
		
		var calc_top = ( ( $( window ).height () / 2) - ( jgOptions.jgContainerImage.innerHeight() / 2 ) );
				
			calc_top = (calc_top < 0 ) ? 0 : calc_top;
			
		jgOptions.jgContainerImage.css ( {
		 	left: ( $( window ).width () - jgOptions.jgContainerImageObject.attr('width') ) / 2,
			top: calc_top
		});
		
	},
	jGallery: function ( parametros ) {
	
		$(this).createjGallery();
		$(this).setjGalleryEvents();

		jgOptions = {
			jgImageMaxHeight: ( $( window ).height () / 100 ) * 70,
			jgImageMaxWidth: ( $( window ).width () / 100 ) * 90,
			jgCarrocelGallery : $( '.jgCarrocel' ),
			jgGallery : $( '.jgFullGallery' ),
			jgGalleryHeight : null,
			jgBackground : $( '.jgBackground' ),
			jgContainer : $( '.jgContainer' ),
			jgContainerImage : $( '.jgContainer .image'),
			jgContainerImageObject : $( '.jgContainer .image img#jgallery'),
			jgGalleryContainerHeight : $('.jgContainer div.jgFullGallery').css('height').replace('px',''),
			containerWidth : $( window ).width (),
			containerHeight : $( window ).height (),
			openedGallery : null,
			openedImage : null
		}
		
		$.extend( jgOptions, parametros );
		
		
		$( this )._setContainerCSS ( );
		$( this ).centralizaImageContainer ( );
		
		// suporte para mais de uma galeria por pagina	
		$( this ).each ( function () {

			jgOptions.openedGallery = $( this );
									
			// bloqueia o clique dos links da galeria
			$( this ).find ( 'a:has(img)' ).bind ( 'click' , function ( ) {	
				
				// objeto do link
				jgOptions.openedImage = $( this );
				
				// clona a galeria
				$('.jgFullGallery').html ( jgOptions.openedGallery.html () );
				
				// limpa o html de origem
				$('.jgFullGallery br').remove();
				
				// mostra o loader
				$( this )._setLoader ( );

				jgOptions.jgBackground.fadeIn ( 'slow' , function ( ) {
					
					// mostra o container
					jgOptions.jgContainer.fadeIn ( 2000 , function () {
						jgOptions.jgCarrocelGallery.slideDown ( 'slow' );
					});
					
					$( this )._switchImage ( jgOptions.openedImage );

				});
				
				return false;
				
			});
			
			// bloqueia o clique dos links da galeria
			$( '.jgFullGallery' ).find ( 'a:has(img)' ).live ( 'click' , function ( ) {				
				
				// objeto do link
				jgOptions.openedImage = $( this );
				
				$( this ).centralizaImageContainer ( );
				
				// mostra o loader
				//$( this )._setLoader ( );
				
				$( this )._switchImage ( jgOptions.openedImage );
					
				return false;
				
			});
		});
	}	
});
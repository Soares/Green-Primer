var controller = {
    canvas : null,
    context : null,

    init : function(){
        this.canvas = document.getElementById( "canvas" );
        this.context = this.canvas.getContext( "2d" );
        this.context.globalCompositeOperation = "lighter"; //"source-over", "lighter", "darker", "xor"  are good

        this.p1 = new ParticleSystem();
        this.p2 = new ParticleSystem();	

        // Set some properties - check the class
        this.p2.position = new Vector(300, 190);
        this.p2.startColourRandom = [ 255, 255, 255, 1 ];
        this.p2.endColourRandom = [ 255, 255, 255, 1 ];
        this.p2.size = 20;
        this.p2.maxParticles = 20;
        this.p2.duration = 10;

        this.p1.init();
        this.p2.init();

        this.main();
    },

    main : function(){
               this.update();
               this.draw();
               setTimeout( function(){ controller.main(); }, 100 );
           },

    update : function(){	
                 this.p1.update( 1 ); // "1" is used as a delta... should be calculated as time between frames
                 this.p2.update( 1 );
             },

    draw : function(){
               this.context.clearRect( 0, 0, 690, 452 );

               this.p1.render( this.context );
               this.p2.render( this.context );	 
           }
};

$(function() { controller.init(); });

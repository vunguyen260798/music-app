
<template>
	<v-card tile id="midiPlayer_div">
        <v-toolbar flat >
            <v-row >
                <v-col>
                    <v-btn-toggle dense id="midiPlayer_tool">
                        <v-btn id="midiPlayer_play"  v-on:click="playMidi"><v-icon>mdi-play</v-icon></v-btn>
                        <v-btn id="midiPlayer_stop" onClick="stop()"><v-icon>mdi-stop</v-icon></v-btn>
                        <v-btn id="midiPlayer_pause" onClick="pause()" ><v-icon>mdi-pause</v-icon></v-btn>
                    </v-btn-toggle>
                </v-col>
                <v-col class="d-flex align-center justify-center">
                        <span id="midiPlayer_playingTime">00:00</span>
                        <span>/</span>
                        <span id="midiPlayer_totalTime">03:00</span>
                </v-col>	 
            </v-row>
        </v-toolbar>
        <v-divider></v-divider>
            <v-progress-linear :value="progress"></v-progress-linear>
        <div id="svg_output" v-bind:style="{height:'900px',overflow:'scroll'}" align="center" >
             <v-progress-circular color="light-blue" :size="40" :width="5" :rotate="10" :indeterminate="true">
            </v-progress-circular>
        </div>
    </v-card>
</template>

<script>
export default {
    name:"sheet",
	components: {
        
    },
    data(){
        return {
            progress:0,
            vrvToolkit:null,
            isPlaying:false
        }
    },
    methods:{
        scrollTo(target){
           $("#svg_output").scrollTop(target)
        },
        updateProgress(value){
            this.progress=value
        },
        playMidi(){
           
            if(!this.isPlaying){

                var base64midi = this.vrvToolkit.renderToMIDI();
                var song = 'data:audio/midi;base64,' + base64midi;
                $("#player").midiPlayer.play(song);    
                this.isPlaying=true
            }
            else{
                play()
            }
        }
    },
	mounted(){
        let updateProgress=this.updateProgress
        let scrollTo=this.scrollTo
        this.vrvToolkit=new verovio.toolkit()
        let vrvToolkit=this.vrvToolkit
        // varible support scroll page
        let curPos=0
        let oldSystem=null
		/* create the toolkit instance */
			var page = 1;
			var zoom = 50;
			var pageHeight =  6000;
			var pageWidth =  $("#svg_output").width()*2
			////////////////////////////////////////////////
			/* A variable for storing the highlighted ids */
			////////////////////////////////////////////////
			var ids = [];
			var isPlaying = false;

			function setOptions() {
				let options = {
					pageHeight: pageHeight,
					pageWidth: pageWidth,
					scale: zoom,
					adjustPageHeight: true
				};
				vrvToolkit.setOptions(options);
			}

            function loadData(data) {
                setOptions();
                vrvToolkit.loadData(data);

                page = 1;
                loadPage();
            }

            function loadPage() {
                curPos=0
                let svg = vrvToolkit.renderToSVG(page, {});
                $("#svg_output").html(svg);
                ////////////////////////////////////////
                /* Bind a on click event to each note */
                ////////////////////////////////////////
                $(".note").click(function() {
                    var id = $(this).attr("id");
                    var time = vrvToolkit.getTimeForElement(id);
                    $("#midi-player").midiPlayer.seek(time);
                });
            };

            function loadFile() {
                let file = "/mei/Chopin_Etude_op.10_no.9.mei";
                $.ajax({
                    url: file
                    , dataType: "text"
                    , success: function(data) {
                        loadData(data);
                    }
                });
			}
			function play_midi() {
                if (isPlaying == false) {
                    var base64midi = vrvToolkit.renderToMIDI();
                    var song = 'data:audio/midi;base64,' + base64midi;
                   // $("#player").show();
                    $("#player").midiPlayer.play(song);
                    isPlaying = true;
                }
            }

            //////////////////////////////////////////////////////
            /* Two callback functions passed to the MIDI player */
            //////////////////////////////////////////////////////
            var midiUpdate = function(time,progress) {
                // time needs to - 400 for adjustment
                updateProgress(progress)
                var vrvTime = Math.max(0, time - 400);
                var elementsattime = vrvToolkit.getElementsAtTime(vrvTime);
                if (elementsattime.page > 0) {
                    if (elementsattime.page != page) {
                        page = elementsattime.page;
                        loadPage();
                    }
                    /**
                     * scroll sheet to current note
                     */
                    if(elementsattime.notes.length>0){
                        // let noteCur=elementsattime.notes[0]
                        // let parent=$("#"+noteCur).parents(".system")     
                        // if(oldSystem!=parent.attr("id")){
                        //     curPos+=100
                        //     scrollTo(curPos)  
                        //     oldSystem=parent.attr("id")
                        // }
                      
                    }
                    /**--------- */
                    if ((elementsattime.notes.length > 0) && (ids != elementsattime.notes)) {
                        ids.forEach(function(noteid) {
                            if ($.inArray(noteid, elementsattime.notes) == -1) {
                                $("#" + noteid).attr("fill", "#000").attr("stroke", "#000");
                            }
                        });
                        ids = elementsattime.notes;
                        ids.forEach(function(noteid) {
                            if ($.inArray(noteid, elementsattime.notes) != -1) {
                                $("#" + noteid).attr("fill", "#c00").attr("stroke", "#c00");
                            }
                        });
                    }
                }
            }

            var midiStop = function() {
                updateProgress(0)
                ids.forEach(function(noteid) {
                    $("#" + noteid).attr("fill", "#000").attr("stroke", "#000");
                });
             //   $("#player").hide();
                isPlaying = false;
            }

            $(document).ready(function() {

                // $(window).keyup(function(event){
                //     ////////////////////////////////
                //     /* Key events 'p' for playing */
                //     ////////////////////////////////
                //     if (event.keyCode == 80) {
                //         play_midi();
                //     }
                // });

                $(window).resize(function(){
                    applyZoom();
                });
                
                $("#player").midiPlayer({
                    color: "#c00",
                    onUpdate: midiUpdate,
                    onStop: midiStop,
                    width: $("#midiPlayer_div").width()
                });
                loadFile();
                
            });

	}
}
</script>

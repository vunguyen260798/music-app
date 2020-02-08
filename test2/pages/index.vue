
<template>
    <v-row >
		<v-col cols="8" v-bind:style="{padding:'0px'}">
			<v-card tile>
				<v-toolbar id="midiPlayer_div" flat >
					<v-row  >
						<v-col>
							<v-btn-toggle dense id="midiPlayer_tool">
								<v-btn id="midiPlayer_play" onClick="play()"><v-icon>mdi-play</v-icon></v-btn>
								<v-btn id="midiPlayer_stop" onClick="stop()"><v-icon>mdi-stop</v-icon></v-btn>
								<v-btn id="midiPlayer_pause" onClick="pause()"><v-icon>mdi-pause</v-icon></v-btn>
							</v-btn-toggle>
						</v-col>
						<v-col class="d-flex align-center justify-center">
								<span id="midiPlayer_playingTime">00:00</span>
								<span>/</span>
								<span id="midiPlayer_totalTime">03:00</span>
						</v-col>	
						
					</v-row>
					<v-row id="midiPlayer_bar">
						<div id="midiPlayer_progress"></div>
					</v-row>
                    <!-- <div id="midiPlayer_div">
                        <div id="midiPlayer_tool" >
                            <div class="">
                            <a id="midiPlayer_play" class="icon play" onclick="play()" ></a>
                            <a id="midiPlayer_stop" class="icon stop" onclick="stop()" ></a>
                            <a  id="midiPlayer_pause" class="icon pause" onclick="pause()"></a>
                            </div>
                            <div class="col-sm-3">
                                <span id="midiPlayer_playingTime">0:00</span>
                                <span id="midiPlayer_totalTime">03:00</span>
                            </div>
                        </div>
                        <div id="midiPlayer_bar">
                                <div class="progress_bar" id="midiPlayer_progress"></div>
                        </div>
                    </div> -->
				</v-toolbar>
				<v-divider></v-divider>
				<div id="svg_output" v-bind:style="{height:'900px',overflow:'scroll'}"></div>
			</v-card>
		</v-col>
		<v-col cols="4" v-bind:style="{padding:'0px'}">
			<div>
				<v-card-title>La La Land Suite</v-card-title>
				<v-card-subtitle>BY JACOB KOLLER - DIGITAL SHEET MUSIC</v-card-subtitle>
				<div class="text-center">
				<v-btn color="primary" class="text-center">Tải về</v-btn>
				</div>
			</div>
		</v-col>
    </v-row>
</template>

<script>
export default {
	components: {
	},
	mounted(){
		console.log("ok")
		/* create the toolkit instance */
		var vrvToolkit = new verovio.toolkit();  
			var page = 2;
			var zoom = 50;
			var pageHeight = 6000;
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
			loadFile()
			function play_midi() {
                if (isPlaying == false) {
                    var base64midi = vrvToolkit.renderToMIDI();
                    var song = 'data:audio/midi;base64,' + base64midi;
                    $("#player").show();
                    $("#player").midiPlayer.play(song);
                    isPlaying = true;
                }
            }

            //////////////////////////////////////////////////////
            /* Two callback functions passed to the MIDI player */
            //////////////////////////////////////////////////////
            var midiUpdate = function(time) {
                // time needs to - 400 for adjustment
                var vrvTime = Math.max(0, time - 400);
                var elementsattime = vrvToolkit.getElementsAtTime(vrvTime);
                if (elementsattime.page > 0) {
                    if (elementsattime.page != page) {
                        page = elementsattime.page;
                        loadPage();
                    }
                    if ((elementsattime.notes.length > 0) && (ids != elementsattime.notes)) {
                        ids.forEach(function(noteid) {
                            if ($.inArray(noteid, elementsattime.notes) == -1) {
                                $("#" + noteid).attr("fill", "#000").attr("stroke", "#000");
                            }
                        });
                        ids = elementsattime.notes;
                        ids.forEach(function(noteid) {
                            if ($.inArray(noteid, elementsattime.notes) != -1) {
                                $("#" + noteid).attr("fill", "#c00").attr("stroke", "#c00");;
                            }
                        });
                    }
                }
            }

            var midiStop = function() {
                ids.forEach(function(noteid) {
                    $("#" + noteid).attr("fill", "#000").attr("stroke", "#000");
                });
                $("#player").hide();
                isPlaying = false;
            }

            $(document).ready(function() {

                $(window).keyup(function(event){
                    ////////////////////////////////
                    /* Key events 'p' for playing */
                    ////////////////////////////////
                    if (event.keyCode == 80) {
                        play_midi();
                    }
                });

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
		/* read the MEI file */
	//	mei = fs.readFileSync("hello.mei");
		/* load the MEI data as string into the toolkit */
	//	vrvToolkit.loadData(mei.toString());
		/* render the fist page as SVG */
	///	svg = vrvToolkit.renderToSVG(1, {});
		/* save the SVG into a file */
	//	fs.writeFileSync("hello.svg", svg);
	}
}
</script>

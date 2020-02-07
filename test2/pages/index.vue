<template>
    <v-row >
		<v-col cols="8" v-bind:style="{padding:'0px'}">
			<v-card tile>
				<v-toolbar flat></v-toolbar>
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

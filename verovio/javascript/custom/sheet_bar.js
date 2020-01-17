$(function(){
    let width_sheet_bar=$(".sheet_bar").width()
    let positionX=0
    let progress=0
    $(".sheet_bar").hover(function(){
        $(".sheet_bar .progress_bar").toggleClass("sheet_bar_hover")
        $(".sheet_bar .knot").toggleClass("knot_hover");
    })

    $(".sheet_bar").click(function(e){
        positionX=e.clientX-this.getBoundingClientRect().left
        progress=( positionX / width_sheet_bar) * 100
        console.log(progress)

    })
})

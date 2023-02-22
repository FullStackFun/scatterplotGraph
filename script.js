let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let request = new XMLHttpRequest()
let arrayValues = []
let xScale
let yScale

let height=750
let width=1000
let padding=50


let svg=d3.select('svg')
let tooltip = d3.select('#tooltip')


let drawBoard = function() {
    svg.attr('width', width)
        .attr('height', height)
}

let makeScales = () => {
    xScale = d3.scaleLinear()
                .range([padding, width-padding])
                .domain([d3.min(arrayValues, (x) => {
                    return x['Year']
                }


                ) - 1, d3.max(arrayValues, (x) => {
                    return x['Year']
                }


                )+1 ])



    yScale = d3.scaleTime()
                .range([padding, height-padding])
                .domain ([d3.min(arrayValues, (x) => {
                    return new Date(x['Seconds'] * 1000)
                }), d3.max(arrayValues, (x) => {
                    return new Date(x['Seconds'] * 1000)
                })
            
            ])
             

}

let drawDots = function() {


    svg.selectAll('circle')
        .data(arrayValues)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '10')
        .attr('data-xvalue', (x) => {
            return x['Year']
        })
        .attr('data-yvalue', (x) => {
            return new Date(x['Seconds'] * 1000)
        })
        .attr('cx', (x) => {
            return xScale(x['Year'])
        })
        .attr('cy', (y) => {
            return yScale(new Date(y['Seconds'] * 1000))

        })
        .attr('fill', (x) => {
            if(x['Doping'].length > 2 ) {
                return 'yellow'
            } else {
                return 'salmon'
            }
        })
        .on('mouseover', (x) => {
            tooltip.transition()
                .style('visibility', 'visible')
                if (x['Doping'].length > 2) {
                    tooltip.text(x['Year'] + ' ' + x['Name']  + ' ' + x['Time'] + ' ' + x['Doping'])
                } else {
                    tooltip.text(x['Year'] + ' ' +  x['Name'] + ' ' + 'No doping allegations')
                }
                tooltip.attr('data-year', x['Year'])
        })
        .on('mouseout', (x) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
        


}

let makeAxes = () => {
    xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
        svg.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr("transform", 'translate(0,' + (height-padding)+')')

        
            

    yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S'))
        svg.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + padding + ',0)')



}

request.open('GET', url, true)
request.onload = () => {
//    console.log(request.responseText)
        arrayValues = JSON.parse(request.responseText)
        console.log(arrayValues)
    drawBoard()
    makeScales()
    drawDots()
    makeAxes()
}
request.send()

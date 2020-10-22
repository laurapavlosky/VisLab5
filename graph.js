// create margins, height and width of svg
const margin = ({top: 20, right: 20, bottom: 20, left: 40});
const width = 650 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select('.chart')
.append('svg')
.attr('width', width + margin.left + margin.right)
.attr('height', height + margin.top + margin.bottom)
.append('g')
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const xScale = d3.scaleBand();

const yScale = d3.scaleLinear();

const xAxis = d3.axisBottom();

const yAxis = d3.axisLeft();



// loading data
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {

    console.log('coffeehouses', data);

    
    // create scales
    xScale.domain(data.map(d => d.company)) 
        .rangeRound([0,width])  
        .paddingInner(0.1);

    yScale.domain([d3.max(data, d => d.revenue), 0])
        .range([0,height]);

    // creating axis
    xAxis.scale(xScale)
        .ticks(5,'s');

    yAxis.scale(yScale)
        .ticks(10,'s');

    // rendering axis
    svg.append('g')
        .attr('class', 'axis x-axis')
        .call(xAxis)
        .attr('transform', `translate(0, ${height})`);

    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis);

    // axis label
    svg.append('text')
        .attr('class', 'yax')
        .attr('x', 10)
        .attr('y', -5)
        .attr('font-size', 14)
        .text('Billion USD');
    

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.company))
        .attr('y', d => yScale(d.revenue))
        .attr('width', d => xScale.bandwidth(d))
        .attr('height', d => height - yScale(d.revenue))
        .attr('fill', "#000");
    

    // (Later) define update parameters 

    let selection1 = document.querySelector("#group-by");
    let type = selection1.value;

    selection1.addEventListener("change", function() {
        type = this.value;
        update(data, type);
    });

    let sort = false;
    d3.select('#sort').on("click", function() {
        if (sort == false) {sort = true;}
        else {sort = false;}
        update(data, type, sort)
    })


    // chart update function
    function update(data, type, sort) {

        // update domains
        xScale.domain(data.map(d => d.company)) 
        .rangeRound([0,width])  
        .paddingInner(0.1);

        yScale.domain([d3.max(data, d => d[type]), 0])
        .range([0,height]);

        const bars = svg.selectAll('rect')
            .data(data,function(d) {
                return d.company;
            })
        
        bars.enter()
            .append('rect')
            .attr('x', d => xScale(d.company))
            .attr('y', d => yScale(d[type]))
            .attr('width', d => xScale.bandwidth(d))
            .attr('height', d => height - yScale(d[type]))
            .attr('fill', '#000')
        bars.attr('class', 'bar')
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("x", function(d) {
                return xScale(d.company);
              })
             .attr("y", d=>yScale(d[type]))
             .attr("width", xScale.bandwidth())
             .attr("height", d=>height - yScale(d[type]))
             .style("opacity", 1);

        bars.exit()
            .transition()
            .duration(1000)
            .remove();

        // if (type == 'revenue') {
        //     data.sort(function(a,b) {
        //         return a.revenue - b.revenue;
        //     })
        // }

        // if (type == 'stores') {
        //     data.sort(function(a,b) {
        //         return a.stores - b.stores;
        //     })
        // }

        svg.select('.yax')
            .remove()
            .exit();
        
        svg.append('text')
            .attr('class', 'yax')
            .attr('x', 10)
            .attr('y', -5)
            .attr('font-size', 14)
            .text(function(type) {
                if (type == 'stores' ) {return "Stores"}
                else {return "Billion USD"}
            });

        xAxis.scale(xScale)
            .ticks(5,'s');
    
        yAxis.scale(yScale)
            .ticks(10,'s');
        

        svg.select('.x-axis')
            .attr('transform',`translate(0, ${height})`)
            .call(xAxis);

        svg.select('.y-axis')
            .call(yAxis);
        


        // implement enter update exit sequence
        // update bars
        // update axes and axis title

    }

    // chart updates


})

// y axis and scales seem to be messed up
// cannot remove and change y axis label
// transitions
// sorting 

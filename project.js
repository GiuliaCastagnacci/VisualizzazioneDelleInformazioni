var margin = 50;
var width = 600;
var height = 300;

var svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin + 400)
  .attr("height",  height + margin + 300)
  .append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")");

d3.json("data.json", function(error, data) {
  if (error) {
    console.log(error);
    return;
  }

  var colors = ["#6495ed", "#daa520", "#ba55d3", "#ffd700", "#00fa9a"];

  var dataset = d3.layout.stack()(["elettrodomestici", "vestiti", "prodottiTecnologici", "ProdottiCuraPersonale", "libri"].map(function(fruit) {
    return data.map(function(d) {
      return { x: d3.time.format("%Y").parse(d.year), y: +d[fruit] };
    });
  }));

  var labels = ["elettrodomestici", "vestiti", "prodottiTecnologici", "ProdottiCuraPersonale", "libri"];

  var xScale = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([0, width], 0.5);

  var yScale = d3.scale.linear()
    .domain([0, 600])
    .range([height, 0]);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(6)
    .tickSize(-width, 0, 0)
    .tickFormat(function(d) { return "$" + d; });

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y"));

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 30)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Year');

  
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'translate(-30,' + height / 2 + ')rotate(-90)')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Sale');

 
    var selectedGroup = null;
    var groups = svg.selectAll("g.bars")
      .data(dataset)
      .enter().append("g")
      .attr("class", "bars")
      .style("fill", function(d, i) { return colors[i]; })
      .style("stroke", "#000");

      var rect = groups.selectAll("rect")
      .data(function(d) { 
      return d.map(function(dataPoint) {
      
      dataPoint.lastDelta = 0;
      return dataPoint;
    });
    })
    .enter()
    .append("rect")
    .attr("x", function(d) { return xScale(d.x); })
    .attr("y", function(d) { return yScale(d.y0 + d.y); })
    .attr("height", function(d) { return yScale(d.y0) - yScale(d.y0 + d.y); })
    .attr("width", xScale.rangeBand())
    .attr("lastDelta", function(d) { return 0; })
    .on('click', function(d, i) {
    var selectedRect = d3.select(this);
    var delta = yScale(0) - yScale(d.y0); 

   
    groups.selectAll("rect")
      .transition()
      .duration(500)
      .attr("y", function(d) {
        if (d.x.getTime() === selectedRect.data()[0].x.getTime()) {
          d.lastDelta=delta;
          return yScale(d.y0 + d.y) + delta; 
        } else {
          return yScale(d.y0 + d.y) + d.lastDelta; 
        }
      });

  });


    var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width+ margin) + "," + 5 + ")");

    var legendItems = legend.selectAll(".legend-item")
    .data(labels)
    .enter().append("g")
    .attr("class", "legend-item")
    .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; });

    legendItems.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i) { return colors[i]; });

    legendItems.append("text")
    .attr("x", 20)
    .attr("y", 10)
    .style("font-size", "12px")
    .text(function(d) { return d; });

});

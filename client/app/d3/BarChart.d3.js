export default function BarchartD3() {


  // variables
  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  }

  var container = null;

  var x = null;
  var y = null;

  var width = null;
  var height = null;

  var yValue = function(d) {
    return Number(d.y);
  }

  var xValue = function(d) {
    return d.x;
  }

  var yAxisLabel = "";

  var defaults = {showYAxis: true, xScale: 'ordinal', showXAxis: true, tickCount: null}

  var markerOffset = 3;

  function tickFormatter (d,i) {
    if ((d / 1000000) >= 1)
      d = d / 1000000 + "M";
    else if ((d / 1000) >= 1)
      d = d / 1000 + "K";
    return d;
  }


  var setMarker = function(targetElement, exactElement, label) {
    var xPos = x(xValue(targetElement));
    var yPos = y(yValue(exactElement ? exactElement : targetElement))

    container.select("g.marker")
             .attr("transform", "translate(" + (+xPos) + "," + (yPos) + ")");
    container.select("g.marker circle")
             .style("opacity", 1)

    if (label) {
      container.select("g.marker text")
               .text(label)
      container.select("g.marker text")
               .style("opacity", 1)

    }


  }

  var clearMarker = function() {
    container.select("g.marker circle")
             .style("opacity", 0)
    container.select("g.marker text")
               .style("opacity", 0)
  }

  function chart(theContainer, data, elementToHighlight, options) {
    var me = this;

    options = $.extend(defaults, options)

    container = theContainer;

    container.selectAll("svg").remove();

    if (data == null ||  data.length == 0) {
      return;
    }


    // Calc width and height
    let outerWidth  = width ? width : +container.node().offsetWidth;
    let outerHeight = height ? height : +container.node().offsetHeight;

    let innerWidth  = outerWidth - margin.left - margin.right;
    let innerHeight = outerHeight - margin.top - margin.bottom - markerOffset;


    x = null;
    var barWidth = null;
    if (options.xScale == 'linear') {
      x = d3.scale.linear()
            .domain(d3.extent(data, function(d) {
              return xValue(d);
            }))
            .range([0, innerWidth]);
      barWidth = width / data.length;
    } else {
      x = d3.scale.band()
            .domain(data.map(xValue))
            .rangeRound([0, innerWidth])
            .padding(0.1);
      barWidth =  x.bandwidth();
    }


    var yMax = d3.max(data, function(d) {
      return yValue(d);
    });
    var yMin = d3.min(data, yValue);
    if (yMin > 0) {
      yMin = 0;
    }
    if (elementToHighlight) {
      yMax = Math.max(yMax, yValue(elementToHighlight))
    }

    y = d3.scale.linear()
          .rangeRound([innerHeight, 0])
          .domain([yMin, yMax]);



    // Select the svg element, if it exists.
    container.selectAll("svg").remove();
    var svg = container.selectAll("svg").data([0]);

    let g = svg.enter()
       .append("svg")
       .attr("width", outerWidth)
       .attr("height", outerHeight)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + (margin.top + markerOffset) + ")");



    if (options.showXAxis) {
      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .tickFormat(tickFormatter)

      if (options.tickCount) {
        xAxis.ticks(options.tickCount)
      }
      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(xAxis)
    }



    if (options.showYAxis) {
      var yAxis = d3.svg.axis()
                    .scale(y)
                    .tickValues([yMin, 0, yMax])
                    .orient("right");

      g.select(".y.axis").remove()

      g.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(yAxisLabel);

    }

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function(d) {
        let classes = "bar";
        if (yValue(d) < 0) {
          classes += " negative";
        } else {
          classes += " positive";
        }
        return classes;
      })
      .attr("x", function (d,i) {
        return x(xValue(d));
      })
      .attr("y", function(d) {
        return y(Math.max(0, yValue(d)));
      })
      .attr("width", function(d) {
        return barWidth;
      })
      .attr("height", function(d) {
         return Math.abs(y(yValue(d)) - y(0));
      })
      .on("mouseover", function(d) {
       d3.select(".tooltip")
         .style("left", d3.event.pageX + "px")
         .style("top", d3.event.pageY - 70 + "px")
         .style("display", "inline-block")
         .html(("y: " + yValue(d) + "<br>" + "x: " + xValue(d)));
      })
      .on("mouseout", function(d) {
       d3.select(".tooltip")
         .style("display", "none")
      })

    let marker = g.selectAll(".marker")
     .data([0])
     .enter()
     .append("g")
     .attr("class", "marker");

    marker.append("circle")
     .attr("cx", 0)
     .attr("cy", 0)
     .attr("r", "3")
     .style("opacity", 0)

    marker.append("text")
     .attr("x", -12)
     .attr("y", -6)
     .style("opacity", 0)

  }


  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };


  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };


  chart.xValue = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };


  chart.yValue = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return chart;
  };


  chart.setMarker = function(_) {
    if (!arguments.length) return setMarker;
    setMarker = _;
    return chart;

  }


  chart.clearMarker = function(_) {
    if (!arguments.length) return clearMarker;
    clearMarker = _;
    return chart;

  }

  return chart;
}

function stackedBarChartD3() {
  var dispatch = d3.dispatch("d3click");

  var defaults = {};

  var container = null;

  var categories = null;

  var margin = {top: 30, right: 20, bottom: 20, left: 50},
      width = 200,
      height = 100;

  var formatXTick = null;

  var xAxisLabel = null;
  var yAxisLabel = null;

  var xValue = null;
  var xValueStart = null;
  var xValueEnd   = null;

  var showXAxis = true;
  var showYAxis = true;

  var xTickCount = null;
  var yTickCount = null;

  var xStart = null;
  var xEnd = null;

  var barWidth = 10;
  var barWidthMin = null;
  var barHeightMin = null;

  var widthPercent = null;
  var heightPercent = null;

  var options = null;


  function chart(selection, theOptions) {

    options = $.extend( defaults, theOptions);
    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.left - margin.right;


    selection.each(function(data) {

      container = d3.select(this);

      // Select the svg element, if it exists.
      var svg = container.selectAll("svg").data([0]);

      svg.enter()
        .append("svg")
        .attr("width", widthPercent)
        .attr("height", heightPercent)
        .attr('viewBox', "0 0 " + parseInt(width+margin.left+margin.right) + " " + parseInt(height+margin.top+margin.bottom))
        .attr("preserveAspectRatio", "none")
        .append("g")
        .attr("class", "group")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var g = svg.select("g.group");

      // The chart dimensions could change after instantiation, so update viewbox dimensions
      // every time we draw the chart.
      d3.select(this).selectAll("svg")
        .filter(function() {
            return this.parentNode === container.node();
        })
        .attr('viewBox', "0 0 " + parseInt(width+margin.left+margin.right) + " " + parseInt(height+margin.top+margin.bottom));


      var tooltip = container.selectAll(".tooltip").data([0])
          .enter().append('div')
          .attr("class", "tooltip")
          .style("pointer-events", "none")
          .style("opacity", 0);


      //var x = d3.scale.ordinal()
      //    .rangeBands([0, innerWidth], 0, 0);
      var x = d3.scale.linear()
          .range([0, innerWidth]);

      var y = d3.scale.linear()
          .rangeRound([innerHeight, 0]);


      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("top");
      if (xTickCount == 0 ) {
        xAxis.tickValues([]);
      } else if (xTickCount > 1 ) {
        xAxis.ticks(xTickCount);
      }

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("right");
      if (yTickCount) {
          yAxis.ticks(yTickCount)
      }

      if (xStart && xEnd) {
        x.domain([xStart, xEnd]);
      } else {
        x.domain(d3.extent(data, function(d) { return xValue(d); }));
      }
      var yMax = d3.max(data, function(d) { return d.total; })
      y.domain([0, yMax]);

      // What is the min y value that will equal a min height (the height of the chart is 0, so subtract min from height)
      var minY = barHeightMin ? y.invert(y.range()[0] - barHeightMin) : 0;
      var stackedData = categories.map(function(category) {
        return data.map(function(d) {
          var stackRow = { x: xValue(d),
                           y: +d[category] > 0 ? Math.max(+d[category], minY) : 0,
                           values: categories.map(function(cat) {
                              var v = {};
                              v[cat] = d[cat];
                              return v;
                           })
                         };
          if (xValueStart && xValueEnd) {
            stackRow.start = xValueStart(d);
            stackRow.end   = xValueEnd(d);
          }

          return stackRow;
        });
      });


      var layers = d3.layout.stack()(stackedData);


/*
      var revisedLayers = layers.map(function(layer) {
        layer.scaledY       = y(layer.y);
        layer.scaledYStart  = y(layer.y0);
        layer.scaledYEnd    = y(layer.y + layer.y0);

        layer.height        = layer.scaledYStart - layer.scaledYEnd;
        layer.yPos          = layer.scaledYEnd;
      })

*/





      if (options.transition && options.transition.pushUp) {
        g.selectAll(".layer").remove();
      }
      var layer = g.selectAll(".layer").data(layers);
      layer.enter().append("g")
           .attr("class", function(d, i) { return "layer " + categories[i] })
           .attr("transform", function(d,i) {
            if (options.transition && options.transition.pushUp) {
              return "translate(0," + innerHeight + ")";
            } else {
              return "translate(0,0)";
            }

          });
      layer.exit().remove();

      var bar = layer.selectAll("g.stacked-bar")
                          .data(function(d) { return d; },  function(d) { return d.x });


      bar.enter().append("g")
                  .attr("class", "stacked-bar")
                  .attr("transform", function(d,i) {
                    if (options.transition && options.transition.pushRight) {
                      return 'translate(0,0)';
                    }
                    else {
                      return "translate(" + Math.floor( (x(d.x)) - (chart.calcBarWidth(x, d)/2) ) + ",0)";
                    }
                  })
                  .append("rect")
                  .attr("class", "stacked-element")
                  .attr("x", function(d) { return 0; })
                  .attr("y", function(d, i) {
                    return y(d.y + d.y0);
                  })
                  .attr('height', function(d) {
                    return y(d.y0) - y(d.y + d.y0);
                  })
                  .attr("width", function(d) {
                    return chart.calcBarWidth(x, d);
                  }).attr("pointer-events", "all")
                  .attr("cursor", "pointer");
      bar.exit().remove();

      bar.selectAll('.stacked-bar rect.stacked-element')
                  .on("mouseover", function(d, i) {

                      var tooltip = container.selectAll(".tooltip");
                      tooltip.html( tooltipText(d, i) );



                      var w = tooltip.node().getBoundingClientRect().width;
                      var h = tooltip.node().getBoundingClientRect().height;
                      tooltip.style("left", (d3.event.pageX - w)+ "px")
                             .style("text-align", 'left')
                            .style("top", (d3.event.pageY - (h + innerHeight)) + "px");


                      tooltip.transition()
                         .duration(200)
                         .style("opacity", .9);
                   })
                   .on("mouseout", function(d) {
                      container.selectAll(".tooltip").transition()
                         .duration(500)
                         .style("opacity", 0);
                   })
                   .on("click", function(d) {
                      var on = d3.select(this).attr("class") != "selected";

                      svg.selectAll(".stacked-bar rect.stacked-element").classed("selected", false);
                      d3.select(this).classed("selected", on);

                      dispatch.d3click(d, on);
                   });


      if (options.transition && options.transition.pushUp) {
        g.selectAll(".layer").transition()
          .duration(700)
          .attr('transform', 'translate(0,0)');
      }

      if (options.transition && options.transition.pushRight) {
        layer.selectAll('g.stacked-bar')
             .transition()
             .duration(700)
             .attr("transform", function(d,i) {
                return "translate(" + Math.floor( (x(d.x)) - (chart.calcBarWidth(x,d)/2) ) + ",0)";
             })

      }



      svg.selectAll(".axis").remove();
      if (showXAxis) {
        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + margin.left + "," + (innerHeight + margin.top) + ")")
            .call(xAxis);

      }

      if (showYAxis) {
        svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(0," + margin.top + ")")
            .call(yAxis);

        d3.selectAll('g.axis--y .tick')
           .filter(function(d, i) {
              return i == 0;
           })
           .remove();
      }




    });
  };

  chart.calcBarWidth = function(x, d) {
    var bw = 0;
    if (options.hasOwnProperty('featureBarWidth') && options.featureBarWidth == true) {
      bw = x(d.end) - x(d.start);
    } else if (barWidth) {
      bw = barWidth;
    }

    if (barWidthMin) {
      return Math.max(+bw, +barWidthMin);
    } else {
      return bw;
    }
  }

  chart.categories = function(_) {
    if (!arguments.length) return categories;
    categories = _;
    return chart;
  };
  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

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

  chart.xValue = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };
  chart.xValueStart = function(_) {
    if (!arguments.length) return xValueStart;
    xValueStart = _;
    return chart;
  };
  chart.xValueEnd = function(_) {
    if (!arguments.length) return xValueEnd;
    xValueEnd = _;
    return chart;
  };



  chart.barWidth = function(_) {
    if (!arguments.length) return barWidth;
    barWidth = _;
    return chart;
  };


  chart.barWidthMin = function(_) {
    if (!arguments.length) return barWidthMin;
    barWidthMin = _;
    return chart;
  };

  chart.barHeightMin = function(_) {
    if (!arguments.length) return barHeightMin;
    barHeightMin = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };

  chart.xAxis = function(_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return chart;
  };

  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };



  chart.xStart = function(_) {
    if (!arguments.length) return xStart;
    xStart = _;
    return chart;
  };

  chart.xEnd = function(_) {
    if (!arguments.length) return xEnd;
    xEnd = _;
    return chart;
  };


  chart.xTickCount = function(_) {
    if (!arguments.length) return xTickCount;
    xTickCount = _;
    return chart;
  }

  chart.yTickCount = function(_) {
    if (!arguments.length) return yTickCount;
    yTickCount = _;
    return chart;
  }

  chart.formatXTick = function(_) {
    if (!arguments.length) return formatXTick;
    formatXTick = _;
    return chart;
  }

  chart.xAxisLabel = function(_) {
    if (!arguments.length) return xAxisLabel;
    xAxisLabel = _;
    return chart;
  }

  chart.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return chart;
  }

  chart.showXAxis = function(_) {
    if (!arguments.length) return showXAxis;
    showXAxis = _;
    return chart;
  };

  chart.showYAxis = function(_) {
    if (!arguments.length) return showYAxis;
    showYAxis = _;
    return chart;
  };


  chart.widthPercent = function(_) {
    if (!arguments.length) return widthPercent;
    widthPercent = _;
    return chart;
  };

  chart.heightPercent = function(_) {
    if (!arguments.length) return heightPercent;
    heightPercent = _;
    return chart;
  };

  chart.tooltipText = function(_) {
    if (!arguments.length) return tooltipText;
    tooltipText = _;
    return chart;
  };

  // This adds the "on" methods to our custom exports
  d3.rebind(chart, dispatch, "on");

  return chart;
}
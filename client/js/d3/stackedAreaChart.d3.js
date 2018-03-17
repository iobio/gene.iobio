function stackedAreaChartD3() {

  var defaults = {};

  var container = null;

  var categories = null;

  var margin = {top: 30, right: 20, bottom: 20, left: 50},
      width = 200,
      height = 100;

  var formatXTick = null;

  var xAxisLabel = null;
  var yAxisLabel = null;

  var xValue      = null;

  var showXAxis = true;
  var showYAxis = true;

  var xTickCount = null;
  var yTickCount = null;

  var widthPercent = null;
  var heightPercent = null;

  function chart(selection, options) {

    options = $.extend(defaults,options);
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


      var x = d3.scale.ordinal()
          .rangeBands([0, innerWidth], 0, 0);


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


      var area = d3.svg.area()
          .interpolate("monotone")
          .x(function(d)  { return x(d.x); })
          .y0(function(d) { return y(d.y0); })
          .y1(function(d) { return y(d.y0 + d.y); });


      var stack = d3.layout.stack()
          .values(function(d) { return d.values; });

      var stacks = stack(categories.map(function(category) {
        return {
          name: category,
          values: data.map(function(d) {
            return {x: xValue(d), y: +d[category]};
          })
        };
      }));

      // Determine the max value across all categories
      var categoryMap = {};
      categories.forEach(function(cat) {
        categoryMap[cat] = true;
      })
      var maxY = d3.max(data, function(d) {
        var vals = d3.keys(d).map(function(key){
          return categoryMap.hasOwnProperty(key) ? d[key] : 0
        });
        return d3.sum(vals);
      });



      x.domain(data.map(function(d) { return xValue(d) }));
      y.domain([0, maxY]);



      g.selectAll(".layer").remove();
      var layer = g.selectAll(".layer").data(stacks);
      layer.enter().append("g")
                   .attr("class", function(d, i) { return "layer " + categories[i] })
                   .attr("transform", function(d,i) {
                      if (options.transition && options.transition.pushUp) {
                        return "translate(0," + innerHeight + ")";
                      } else if(options.transition && options.transition.pushRight) {
                        return "translate(" + (innerWidth * -1) + ",0)";
                      }else {
                        return "translate(0,0)";
                      }
                    });

      layer.append("path")
           .attr("class", function(d, i) { return "stacked-area stacked-element " + categories[i] })
           .attr("d", function(d) {
             return area(d.values);
           });



      if (options.transition) {
        layer.transition()
          .duration(700)
          .attr('transform', 'translate(0,0)');
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


  return chart;
}
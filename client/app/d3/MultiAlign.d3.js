export default function MultiAlignD3() {

  var container = null;

  // variables
  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  }

  var baseValue = function(d) {
    return d.base;
  }

  var xValue = function(d) {
    return d.offset;
  }

  var x = null;


  var yAxisLabel = "";

  var trackHeight = 14;
  var trackOffset = 5;
  var baseWidth   = 12;
  var fontSize    = 11;

  var defaults = {scrollable: false, showXAxis: true}

  var setMarker = function(d) {
    if (d) {
      var mousex = x(xValue(d));

      container.select("g.marker")
               .attr("transform", "translate(" + (+mousex-1) + "," + "2" + ")");

      container.select("g.marker rect")
               .style("opacity", 1)

      container.select("g.marker text")
               .attr("text-anchor", "middle")
               .text(d.variant.ref + "->" + d.variant.alt)

      container.select("g.marker text")
               .style("opacity", 1)

    }
  }

  var showMarker = function(x) {

    container.select("g.marker")
             .attr("transform", "translate(" + (+x-2) + "," + "3" + ")");

    container.select("g.marker rect")
             .style("opacity", 1)

    container.select("g.marker text")
             .attr("text-anchor", "middle")
             .text(d.variant.ref + "->" + d.variant.alt)


    container.select("g.marker text")
             .style("opacity", 1)
  }


  function tickFormatter (d,i) {
    if ((d / 1000000) >= 1)
      d = d / 1000000 + "M";
    else if ((d / 1000) >= 1)
      d = d / 1000 + "K";
    return d;
  }




  function chart(theContainer, data, options) {
    var me = this;

    container = theContainer;

    options = $.extend(defaults, options)

    container.selectAll("svg").remove();

    if (data == null || data.length == 0) {
      return;
    }


    let sequenceLength = d3.max(data, function(d) {
      return d.sequence.length;
    })

    let sequenceNames = data.map(function(sequence) {
      return sequence.name;
    })

    // Calc width and height
    let outerWidth  = null;
    let outerHeight = null;
    if (options.scrollable) {
      outerWidth  = (sequenceLength * baseWidth) + margin.left + margin.right;
      outerHeight = (trackHeight * data.length) + margin.top + margin.bottom + trackOffset;
    } else {
      outerWidth  = +container.node().offsetWidth;
      outerHeight = +container.node().offsetHeight;
    }
    let width  = outerWidth  - margin.left - margin.right;
    let height = outerHeight - margin.top  - margin.bottom;

    x = d3.scale.linear()
          .domain(d3.extent(data[0].sequence, function(d) {
            return xValue(d);
          }))
          .range([0, width]);



    // Select the svg element, if it exists.
    var svg = container.selectAll("svg").data([0]);

    let g = null;

    if (options.scrollable) {
      g = svg.enter()
          .append("svg")
          .attr("width", outerWidth)
          .attr("height", outerHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      let dimWidth = (sequenceLength * baseWidth) + margin.left + margin.right;
      let dimHeight = (trackHeight * data.length) + margin.top + margin.bottom + trackOffset;
      g = svg.enter()
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", "0 0 " + dimWidth + " " + dimHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    container.selectAll("svg").append("g")
      .attr("class", "sequence-names")
      .attr("transform", "translate(5," + margin.top + ")")
      .selectAll(".sequence-name")
      .data(sequenceNames)
      .enter()
      .append("text")
      .attr("class", "sequence-name")
      .attr("x", function(d,i) {
        return 0;
      })
      .attr("y", function(d,i) {
        return trackHeight * (i+1);
      })
      .text(function(d) {
         return d;
      })


    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  .tickFormat(tickFormatter)
                  .ticks(sequenceLength / 10)

    if (options.showXAxis) {
      g.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    }


    let seq = g.selectAll(".sequence")
      .data(data)
      .enter().append("g")
      .attr("class", "sequence")
      .attr("transform", function(d,i) {
        return "translate(0," + trackHeight * i + ")";
      });


    let base = seq.selectAll(".base")
       .data(function(d) {
         return d.sequence;
       })
       .enter()
       .append("g")
       .attr("class", function(d) {
          return "base " + (d.clazz ? d.clazz : "");
       })
       .attr("transform", function(d,i) {
          return "translate(" + x(xValue(d)) + "," + (trackHeight - fontSize) + ")";
       })

    base.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", baseWidth)
        .attr("height", trackHeight)
        .on("mouseover", function(d,i) {
          //var mousex = x(xValue(d));
          //showMarker(mousex)
        })

    base.append("text")
        .attr("x", 0)
        .attr("y", fontSize)
        .text(function(d,i) {
          return baseValue(d);
        })
        .on("mouseover", function(d,i) {
          //var mousex = x(xValue(d));
          //showMarker(mousex)
        })


    let marker = g.selectAll(".marker")
       .data([0])
       .enter()
       .append("g")
       .attr("class", "marker");

    marker.append("rect")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", baseWidth)
       .attr("height", trackHeight * data.length)
       .style("opacity", 0)

    marker.append("text")
       .attr("x", 5)
       .attr("y", -7)
       .style("opacity", 0)


  }

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

  return chart;
}

export default function PedigreeGenotypeChartD3() {


  // variables
  var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }

  let nodeWidth = 58;
  let nodePadding = 30;
  let hetNodeWidth = nodeWidth/2;

  let nodeVerticalPadding = 30;

  let container = null;

  let defaults = {};

  let createNode = function(parent) {
    let nodeData = parent.data()[0]
    if (nodeData.sex == 'male' || nodeData.rel == 'father') {
      createRect(parent);
    } else if (nodeData.sex == 'female' || nodeData.rel == "mother") {
      createCircle(parent)
    } else {
      createDiamond(parent)
    }
    if (nodeData.affectedStatus == 'affected') {
      parent.append("g")
            .attr("transform", "translate(-" + (nodeWidth/2) + ", -" + (nodeWidth/2) + ")")
            .append("use")
            .attr("xlink:href", "#affected-symbol")
            .attr("class", "level-high")
            .attr("width", 20)
            .attr("height", 20)
            .style("pointer-events", "none");
    }

  }


  let createCircle = function(parent) {

    let nodeData = parent.data()[0]
    if (nodeData.zygosity == 'het') {
      let left = parent.append("g")
                         .attr("class", "half-circle left")
                         .attr("transform", "translate(0,0), rotate(90," + (nodeWidth/4+2) + "," + (nodeWidth/4+2) + ")")
      left.append("path")
           .attr("d", "M0,0 a" + nodeWidth/2 + "," + nodeWidth/2 + " 0 0,0 " + (nodeWidth + 3) + ",0")
      left.append("path")
           .attr("class",function(d,i) {
              return nodeData.rel + " " + nodeData.zygosity + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');
            })
           .attr("d", "M0,0 a" + nodeWidth/2 + "," + nodeWidth/2 + " 0 0,0 " + + (nodeWidth + 3) + ",0")

      let right = parent.append("g")
                         .attr("class", function(d,i) {
                           return "half-circle right";
                         })
                         .attr("transform", function(d,i) {
                            if (nodeData.rel == 'proband') {
                              return "translate(" + (nodeWidth/2 + 2) + "," +  (nodeWidth/2 - 1) + "), rotate(-90," + (nodeWidth/4+2) + "," + (nodeWidth/4+2) + ")"
                            } else {
                              return  "translate(" + (nodeWidth/2 + 1) + "," + (nodeWidth/2 - 1) + "), rotate(-90," + (nodeWidth/4+2) + "," + (nodeWidth/4+2) + ")";
                            }
                         })
      right.append("path")
            .attr("class",function(d,i) {
              return nodeData.rel  + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');
            })
           .attr("d", function(d,i) {
              return "M0,0 a" + (nodeWidth/2) + "," + (nodeWidth/2) + " 0 0,0 " + (nodeWidth + 3) + ",0";
           })
    } else {
      parent.append("circle")
            .attr("class", function(d,i) {
              return nodeData.rel + " " + nodeData.zygosity + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');;
            })
            .attr("r", nodeWidth/2)
            .attr("cx", nodeWidth/2)
            .attr("cy", nodeWidth/2)
    }

    return parent;

  }

  let createRect = function(parent, d) {
    let nodeData = parent.data()[0]
    if (nodeData.zygosity == 'het') {

      parent.append("rect")
            .attr("class", function(d,i) {
              return "left " + " " + nodeData.zygosity  + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');
            })
            .attr("x", .5)
            .attr("y", .5)
            .attr("width", nodeWidth / 2 - 1)
            .attr("height", nodeWidth - 1)

      parent.append("rect")
          .attr("class", function(d,i) {
            return nodeData.rel  + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');
          })
          .attr("width", nodeWidth)
          .attr("height", nodeWidth)
          .attr("x", 0)
          .attr("y", 0)
      
    } else {
       parent.append("rect")
            .attr("class", function(d,i) {
              return nodeData.rel + " " + nodeData.zygosity + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');;
            })
            .attr("width", nodeWidth)
            .attr("height", nodeWidth)
            .attr("x", 0)
            .attr("y", 0)
    }
    return parent;
  }

  let createDiamond = function(parent) {



    let nodeData = parent.data()[0]
    if (nodeData.zygosity == 'het') {

      let halfWidth = (nodeWidth/3);
      let diamondHeight = (nodeWidth/2) + (nodeWidth/4)
      let grouping = parent.append("g")
                           .attr("transform", "translate(" + ((halfWidth/2)+2) + "," + (halfWidth/2+2) + ")");
      let left = grouping.append("g")
                         .attr("class", "half-diamond left")
                         .attr("transform", function(d,i) {
                           return "translate(0," + (nodeWidth/2) + "),rotate(-90)"
                         })
      left.append("path")
           .attr("d", "M0,-" + halfWidth + "L" + diamondHeight + "," + halfWidth + " -" + diamondHeight + "," + halfWidth + "Z");
      left.append("path")
           .attr("class",function(d,i) {
              return nodeData.rel + " " + nodeData.zygosity + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');
            })
           .attr("d", "M0,-" + halfWidth + "L" + diamondHeight + "," + halfWidth + " -" + diamondHeight + "," + halfWidth + "Z");

      let right = grouping.append("g")
           .attr("class", function(d,i) {
             return "half-diamond right";
           })
           .attr("transform", function(d,i) {
              return "translate(" + (halfWidth*2) + "," + (nodeWidth/2) + "), rotate(90)";
           })
        
      right.append("path")
            .attr("class",function(d,i) {
              return nodeData.rel  + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');
            })
            .attr("d", "M0,-" + halfWidth + "L" + diamondHeight + "," + halfWidth + " -" + diamondHeight + "," + halfWidth + "Z");

    } else {
       parent.append("rect")
            .attr("class", function(d,i) {
              return nodeData.rel + " " + nodeData.zygosity + (nodeData.inheritance.indexOf('n/a') == -1 ? ' critical' : '');;
            })
            .attr("transform", "translate(" + (nodeWidth/2 + 2)  + "),rotate(45)")
            .attr("width", nodeWidth)
            .attr("height", nodeWidth)
            .attr("x", 0)
            .attr("y", 0)
    }

    return parent;

  }

  let createAlleleCountBar = function(parent, position) {
    let nodeData = parent.data()[0]

    if (nodeData.totalCount != null && nodeData.altCount != null) {
      let group = parent.append("g")
            .attr("class", "allele-count-bar")
            .attr("transform", function(d,i) {
              if (position == "top") {
                return "translate(-10,-12)";
              } else {
                return "translate(-10," + (nodeWidth+8) + ")";
              }
            })

      group.append("rect")
           .attr("width", (nodeWidth+20))      
           .attr("height", 5)

      group.append("rect")
           .attr("class", "alt-count")
           .attr("width", (nodeWidth+20) * nodeData.altRatio)      
           .attr("height", 5)

      group.append("text")
           .attr("x", (nodeWidth+20)/2)
           .attr("y", function(d,i) {
              if (position == "top") {
                return -5;
              } else {
                return 16;
              }
           })
           .text(function(d,i) {
              return nodeData.altCount + " of " + nodeData.totalCount
           })
    }


  }



  function chart(theContainer, pedigreeData, options) {
    var me = this;

    options = $.extend(defaults, options)

    container = theContainer;


    let childData = []
    for( var key in pedigreeData) {
      let element = pedigreeData[key];
      if (element.rel == 'proband' || element.rel == 'sibling') {
        childData.push(element)
      }
    }


    let childWidth = (childData.length * nodeWidth) + ((childData.length-1) * nodePadding);
    let parentWidth = (2 * nodeWidth) + nodePadding;
    let width = Math.max(childWidth, parentWidth)
    width += 10;
    let height = (nodeWidth * 2) + (nodeVerticalPadding*2);
    height += 10;

    let outerWidth = width + margin.left + margin.right;
    let outerHeight = height + margin.top + margin.bottom;


    let childLineWidth = (childData.length * nodeWidth) + ((childData.length-1) * nodePadding) - (nodeWidth);
    let center = width / 2;
    let parentX = center - (nodeWidth + (nodePadding/2));

    container.selectAll("svg").remove();

    if (pedigreeData.father == null && pedigreeData.mother == null) {
      return;
    }

    let svg =  container.selectAll("svg")
                         .data([pedigreeData]);

    let svgEnter = svg.enter()
                      .append("svg")
                      .attr("width", "100%")
                      .attr("height", "100%")
                      .attr("viewBox", "0 0 " + outerWidth + " " + outerHeight);

    let group = svgEnter.append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


    let parents = group.append("g")
                          .attr("class", "parents")
                          .attr("transform", "translate(" + parentX + ",0)")

    let children = group.append("g")
                           .attr("class", "children")
                           .attr("transform", "translate(0," + (nodeWidth/2 + nodeVerticalPadding) + ")");



    let father = parents.selectAll("g.father")
                        .data([pedigreeData.father]);

    father.enter()
          .append("g")
          .each( function(d,i) {
            createNode(d3.select(this))
            createAlleleCountBar(d3.select(this), "top")
          })


    let mother = parents.selectAll("g.mother")
                        .data([pedigreeData.mother]);

    mother.enter()
          .append("g")
          .attr("transform", "translate(" + ((nodeWidth + nodePadding)) + ",0" + ")")
          .each( function(d,i) {
            createNode(d3.select(this))
            createAlleleCountBar(d3.select(this), "top")
          })



    let parentLines = parents.selectAll("g.parent-lines")
                             .data([0]);
    let parentLinesEnter = parentLines.enter()
               .append("g")
               .attr("class", "parent-lines")
               .attr("transform", "translate(" + (nodeWidth) + "," +  nodeWidth/2   + ")");

    parentLinesEnter.append("line")
                    .attr("x1", 0)
                    .attr("x2", nodePadding)
                    .attr("y1", 0)
                    .attr("y2", 0)

    parentLinesEnter.append("line")
                    .attr("x1", nodePadding/2)
                    .attr("x2", nodePadding/2)
                    .attr("y1", 0)
                    .attr("y2", nodeVerticalPadding)




    let childLines = children.append("g")
                             .attr("class", "child-lines")
                             .attr("transform", "translate(" + nodeWidth / 2 + ",0)");



    if (childData.length > 1) {
      childLines.append("line")
                .attr("x1", 0)
                .attr("x2", childLineWidth)
                .attr("y1", 0)
                .attr("y2", 0);


      childLines.selectAll(".child-line")
                .data(childData)
                .enter()
                .append("line")
                .attr("class", "child-line")
                .attr("x1", function(d,i) {
                  if (i > 0) {
                    return (i * nodeWidth) + (i * nodePadding);
                  } else {
                    return 0;
                  }
                })
                .attr("x2", function(d,i) {
                  if (i > 0) {
                    return (i * nodeWidth) + (i * nodePadding);
                  } else {
                    return 0;
                  }
                })
                .attr("y1", 0)
                .attr("y2", 30);

    }



   let childNodeGroup = children.append("g")
                            .attr("class", "child-nodes")
                            .attr("transform", function(d,i) {
                              if (childData.length > 1) {
                                return "translate(0,30)";
                              } else {
                                return "translate(" + (center - nodeWidth/2)  + ",0)";
                              }
                            });

   let childNodes = childNodeGroup.selectAll(".child-node-group")
                       .data(childData)
                       .enter()
                       .append("g")
                       .attr("class", "child-node-group")
                       .attr("transform", function(d,i) {
                          let xPos = 0;
                          if (i > 0) {
                            xPos = (i * nodeWidth) + (i * nodePadding);
                          } else {
                            xPos = 0;
                          }
                          return "translate(" + xPos + ",0)";
                       })
    childNodes.each(function(d,i) {
      createNode(d3.select(this))
      createAlleleCountBar(d3.select(this), "bottom")
    })

  }


  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = _;
    return chart;
  };

  chart.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = _;
    return chart;
  };

  chart.nodeVerticalPadding = function(_) {
    if (!arguments.length) return nodeVerticalPadding;
    nodeVerticalPadding = _;
    return chart;
  };


  return chart;
}

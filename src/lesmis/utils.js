import * as d3 from "d3";

export const mouseover = (p) => {
  d3.selectAll(".row text").classed("active", function (d, i) {
    return i == p.y;
  });
  d3.selectAll(".column text").classed("active", function (d, i) {
    return i == p.x;
  });
};

export const mouseout = () => {
  d3.selectAll("text").classed("active", false);
};

export const rowHandler = (row, nodes, x, z, c) => {
  var cell = d3
    .select(this)
    .selectAll(".cell")
    .data(
      row.filter(function (d) {
        return d.z;
      })
    )
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("width", x.bandwidth())
    .attr("height", x.bandwidth())
    .style("fill-opacity", function (d) {
      return z(d.z);
    })
    .style("fill", function (d) {
      return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null;
    })
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);
};

export const order = (value, x, svg, orders) => {
  x.domain(orders[value]);

  var t = svg.transition().duration(2500);

  t.selectAll(".row")
    .delay(function (d, i) {
      return x(i) * 4;
    })
    .attr("transform", function (d, i) {
      return "translate(0," + x(i) + ")";
    })
    .selectAll(".cell")
    .delay(function (d) {
      return x(d.x) * 4;
    })
    .attr("x", function (d) {
      return x(d.x);
    });

  t.selectAll(".column")
    .delay(function (d, i) {
      return x(i) * 4;
    })
    .attr("transform", function (d, i) {
      return "translate(" + x(i) + ")rotate(-90)";
    });
};

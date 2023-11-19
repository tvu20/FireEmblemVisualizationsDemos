import * as d3 from "d3";

export const mouseover = (p) => {
  console.log("mouseover", p);

  //   console.log(d3.selectAll(".row"));

  //   d3.selectAll(".row").classed("active", (d) => console.log(d));

  //   d3.selectAll(".row text").classed("active", function (d, i) {
  //     return i == p.y;
  //   });
  //   d3.selectAll(".column text").classed("active", function (d, i) {
  //     return i == p.x;
  //   });
};

export const mouseout = () => {
  d3.selectAll("text").classed("active", false);
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

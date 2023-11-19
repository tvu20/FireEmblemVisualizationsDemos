// import * as d3 from "d3";

// export const mouseover = (p) => {
//   const pX = p.srcElement.getAttribute("idX");
//   const pY = p.srcElement.getAttribute("idY");
//   d3.selectAll(".row text").classed("active", function (d, i) {
//     return i == pY;
//   });
//   d3.selectAll(".column text").classed("active", function (d, i) {
//     return i == pX;
//   });
// };

// export const mouseout = () => {
//   d3.selectAll("text").classed("active", false);
// };

// export const intToGroup = function(area) {
//   if(area == 1){
//       return "exatas";
//   }else if (area == 2){
//       return "educacao";
//   }else if (area == 3){
//       return "humanas";
//   }else if (area == 4){
//       return "biologicas";
//   }else if (area == 5){
//       return "linguagem";
//   }else if (area == 6){
//       return "saude";
//   }
// };

export const capitalize_Words = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
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

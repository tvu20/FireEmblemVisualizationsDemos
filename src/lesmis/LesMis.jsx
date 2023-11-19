// import "./App.css";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import "./styles.css";

import { order, capitalize_Words } from "./utils";
import miserables from "./miserables.json";

// 1: greil's mercenaries
// 2: crimea
// 3: gallia
// 4: daein
// 5: goldoa
// 6: bird trbes
// 7: begnion
// 8: merchants

function LesMis() {
  const ref = useRef();

  useEffect(() => {
    // set dimensions/margins of graph
    const margin = { top: 80, right: 0, bottom: 10, left: 80 },
      width = 720,
      height = 720;

    // append svg to body of page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("margin-left", -margin.left + "px")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // THIS IS WHERE THE d3.JSON SECTION STARTS
    // console.log("miserables", miserables);

    const matrix = [],
      nodes = miserables.nodes,
      n = nodes.length;

    // Compute index per node.
    nodes.forEach(function (node, i) {
      node.index = i;
      node.count = 0;
      matrix[i] = d3.range(n).map(function (j) {
        return { x: j, y: i, z: 0 };
      });
    });

    // Convert links to matrix; count character occurrences.
    miserables.links.forEach(function (link) {
      matrix[link.source][link.target].z += link.value;
      matrix[link.target][link.source].z += link.value;
      // matrix[link.source][link.source].z += 1;
      // matrix[link.target][link.target].z += 1;
      // matrix[link.source][link.source].z += link.value;
      // matrix[link.target][link.target].z += link.value;
      nodes[link.source].count += link.value;
      nodes[link.target].count += link.value;
    });

    // Precompute the orders.
    const orders = {
      name: d3.range(n).sort(function (a, b) {
        return d3.ascending(nodes[a].name, nodes[b].name);
      }),
      count: d3.range(n).sort(function (a, b) {
        return nodes[b].count - nodes[a].count;
      }),
      group: d3.range(n).sort(function (a, b) {
        return nodes[a].group - nodes[b].group;
      }),
    };

    const x = d3.scaleBand().range([0, width]);
    const z = d3.scaleLinear().domain([0, 20]).range([0.3, 1.0]).clamp(true);
    // const z = d3.scaleLinear().domain([0, 4]).clamp(true);
    const c = d3.scaleOrdinal(d3.schemeTableau10);
    // const c = d3.scaleOrdinal(d3.schemeCategory10);

    // The default sort order.
    x.domain(orders.group);

    // CONSTRUCTING THE GRAPH
    svg
      .append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

    // ROW
    var row = svg
      .selectAll(".row")
      .data(matrix)
      .enter()
      .append("g")
      .attr("class", "row")
      .attr("transform", function (d, i) {
        return "translate(0," + x(i) + ")";
      });
    // .each(row);

    row.append("line").attr("x2", width);
    row
      .append("text")
      .attr("x", -6)
      .attr("y", x.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function (d, i) {
        return nodes[i].name;
      });

    // COLUMN
    const column = svg
      .selectAll(".column")
      .data(matrix)
      .enter()
      .append("g")
      .attr("class", "column")
      .attr("transform", function (d, i) {
        return "translate(" + x(i) + ")rotate(-90)";
      });

    column.append("line").attr("x1", -width);

    column
      .append("text")
      .attr("x", 6)
      .attr("y", x.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function (d, i) {
        return nodes[i].name;
      });

    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const mouseover = (p) => {
      const pX = p.srcElement.getAttribute("idX");
      const pY = p.srcElement.getAttribute("idY");
      const pZ = p.srcElement.getAttribute("idZ");
      d3.selectAll(".row text").classed("active", function (d, i) {
        return i == pY;
      });
      d3.selectAll(".column text").classed("active", function (d, i) {
        return i == pX;
      });
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          nodes[pY].name + " and " + nodes[pX].name + "</br>" + pZ + " chapters"
        )
        .style("left", p.pageX + 30 + "px")
        .style("top", p.pageY - 50 + "px");
    };

    const mouseout = () => {
      d3.selectAll("text").classed("active", false);
      tooltip.transition().duration(500).style("opacity", 0);
    };

    row
      .selectAll(".cell")
      .data((d) => d.filter((item) => item.z))
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => x(d.x))
      .attr("width", x.bandwidth())
      .attr("height", x.bandwidth())
      .attr("idX", (d) => d.x)
      .attr("idY", (d) => d.y)
      .attr("idZ", (d) => d.z)
      .style("fill-opacity", function (d) {
        return z(d.z);
      })
      .style("fill", function (d) {
        return nodes[d.x].group == nodes[d.y].group
          ? miserables.colormap[nodes[d.x].group].color
          : "#363636";
      })
      // .style("fill", function (d) {
      //   return nodes[d.x].group == nodes[d.y].group
      //     ? c(nodes[d.x].group)
      //     : "#363636";
      // })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    d3.select("#order").on("change", function () {
      order(this.value, x, svg, orders);
    });
  }, []);

  const createLegend = () => {
    return (
      <div className="legend">
        <b>Legend</b>
        {Object.keys(miserables.colormap).map(function (key) {
          const item = miserables.colormap[key];
          return (
            <div key={key} className="row">
              <div className="label" style={{ backgroundColor: item.color }} />
              <p>{item.name}</p>
            </div>
          );
          // console.log(key, miserables.colormap[key]);
        })}
      </div>
    );

    // return (
    //   <>
    //     {miserables.colormap.foreach((item) => {
    //       <p>{item.name}</p>;
    //     })}
    //   </>
    // );
  };

  return (
    <div className="ocks-org">
      <h1>
        <i>Fire Emblem</i> Co-occurrence
      </h1>

      <aside style={{ marginTop: "80px" }}>
        <p>
          Order:{" "}
          <select id="order">
            <option value="name">by Name</option>
            <option value="count">by Frequency</option>
            <option value="group">by Cluster</option>
          </select>
        </p>
        {/* <p>
          This matrix diagram visualizes character co-occurrences in Victor
          Hugo’s{" "}
          <i>
            <a href="https://en.wikipedia.org/wiki/Les_Misérables">
              Les Misérables
            </a>
          </i>
        </p>. */}

        <p>
          Each colored cell represents two characters that appeared in the same
          chapter; darker cells indicate characters that co-occurred more
          frequently.
        </p>
        <p>
          Use the drop-down menu to reorder the matrix and explore the data.
        </p>
        <p>
          Built with <a href="https://d3js.org/">d3.js</a>.
        </p>
        {createLegend()}
      </aside>

      <svg
        style={{ marginLeft: "30px" }}
        width={800}
        height={800}
        id="barchart"
        ref={ref}
      />

      {/* <p className="attribution">
        Source:{" "}
        <a href="http://www-cs-staff.stanford.edu/~uno/sgb.html">
          The Stanford GraphBase
        </a>
        .
      </p>

      <p>
        A network can be represented by an{" "}
        <i>
          <a href="https://en.wikipedia.org/wiki/Adjacency_matrix">
            adjacency matrix
          </a>
        </i>
        , where each cell <i>ij</i> represents an edge from vertex <i>i</i> to
        vertex <i>j</i>. Here, vertices represent characters in a book, while
        edges represent co-occurrence in a chapter.
      </p>

      <p>
        Given this two-dimensional representation of a graph, a natural
        visualization is to show the matrix! However, the effectiveness of a
        matrix diagram is heavily dependent on the order of rows and columns: if
        related nodes are placed closed to each other, it is easier to identify
        clusters and bridges.
      </p>

      <p>
        This example lets you try different orderings via the drop-down menu.
        This type of diagram can be extended with manual reordering of rows and
        columns, and expanding or collapsing of clusters, to allow deeper
        exploration.{" "}
        <a href="https://en.wikipedia.org/wiki/Jacques_Bertin">
          Jacques Bertin
        </a>{" "}
        (or more specifically, his fleet of assistants) did this by hand with
        paper strips.
      </p>

      <p>
        While path-following is harder in a matrix view than in a{" "}
        <a href="https://mbostock.github.com/d3/ex/force.html">
          node-link diagram
        </a>
        , matrices have other advantages. As networks get large and highly
        connected, node-link diagrams often devolve into giant hairballs of line
        crossings. Line crossings are impossible with matrix views. Matrix cells
        can also be encoded to show additional data; here color depicts clusters
        computed by a community-detection algorithm.
      </p>

      <p>
        Want more? See this analysis of{" "}
        <a href="../shuffle/compare.html">shuffling algorithms</a> using matrix
        diagrams.
      </p>

      <footer>
        <aside>January 12, 2012</aside>
        <a href="../" rel="author">
          Mike Bostock
        </a>
      </footer> */}
    </div>
  );
}

export default LesMis;

import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Button,
  Icon
} from "semantic-ui-react";

import Dropzone from "react-dropzone";
import classNames from "classnames";
import Papa from "papaparse";
const d3 = require("d3");
const d3delaunay = require("d3-delaunay");
import Mapbox from "mapbox-gl";
Mapbox.accessToken =
  "pk.eyJ1IjoiZWx4YXZpY2lvIiwiYSI6ImNqcmhjdjM0bzJ1Z2IzeXBkMTcwMm91ejAifQ.MqNic1DI-myNldTKihJ-7w";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hideMap: true };
  }

  onCSVLoaded = results => {
    // Extract only the lat and long fields
    let rawPoints = [];
    for (let i = 0; i < results.data.length; i++) {
      let row = results.data[i];
      rawPoints.push([
        parseFloat(row["stop_lon"]),
        parseFloat(row["stop_lat"])
      ]);
    }

    // Filter elements with NaN values
    const filteredPoints = rawPoints.filter(
      item => !isNaN(item[0]) && !isNaN(item[1])
    );

    let map = new Mapbox.Map({
      container: "map",
      center: [-4, 40],
      zoom: 5,
      style: "mapbox://styles/mapbox/light-v9",
      scrollZoom: true
    });
    map.addControl(new Mapbox.NavigationControl(), "top-right");

    map.setCenter([-4, 40]);
    map.setZoom(5);

    map.on("render", function(e) {
      const pixelbbox = map.getContainer().getBoundingClientRect();
      const width = pixelbbox.width;
      const height = pixelbbox.height;

      const geobbox = map.getBounds();

      const projectPoint = ([x, y]) => [
        ((x - geobbox._sw.lng) / (geobbox._ne.lng - geobbox._sw.lng)) * width,
        height -
          ((y - geobbox._sw.lat) / (geobbox._ne.lat - geobbox._sw.lat)) * height
      ];

      let projectedPoints = [];
      for (let i = 0; i < filteredPoints.length; i++) {
        projectedPoints.push(projectPoint(filteredPoints[i]));
      }

      const delaunay = d3delaunay.Delaunay.from(projectedPoints);
      const voronoi = delaunay.voronoi([0, 0, width, height]);
      const voronoiPath = voronoi.render();

      let canvasContainer = map.getCanvasContainer();
      d3.select("svg").remove();
      let svg = d3
        .select(canvasContainer)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      svg.attr("style", "position: relative;");
      let pathSvg = svg
        .append("path")
        .attr("d", voronoiPath)
        .attr("stroke", "indianred");
      projectedPoints.map(([x, y]) =>
        svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 2)
          .attr("fill", "indianred")
      );
    });

    // TODO adjust map view according to points we are dispalying
    // map.fitBounds(mapBounds);
    // map.setZoom(map.getBoundsZoom(mapBounds));

    this.setState({ hideMap: false });
  };

  onFileDrop = (acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      Papa.parse(file, {
        header: true,
        error: function(err, file, inputElem, reason) {
          console.log(err, reason);
        },
        complete: this.onCSVLoaded
      });
    });
  };

  render() {
    return (
      <div>
        {this.state.hideMap && (
          <Container text style={{ marginTop: "7em" }} textAlign="center">
            <Header
              as="h1"
              content="Create your Voronoi diagram now"
              style={{
                fontSize: "4em",
                fontWeight: "normal",
                marginBottom: 0,
                marginTop: "1em"
              }}
            />
            <Header
              as="h2"
              content="Just import your data and it's done!"
              style={{
                fontSize: "1.7em",
                fontWeight: "normal",
                marginTop: "1.5em"
              }}
            />
            <Dropzone onDrop={this.onFileDrop}>
              {({ getRootProps, getInputProps, isDragActive }) => {
                return (
                  <div
                    {...getRootProps()}
                    className={classNames("dropzone", {
                      "dropzone--isActive": isDragActive
                    })}
                  >
                    <input {...getInputProps()} />
                    <Segment placeholder>
                      {isDragActive ? (
                        <Header icon>
                          <Icon name="file text" />
                          Drop files here...
                        </Header>
                      ) : (
                        <Header icon>
                          <Icon name="file text" />
                          Drop or click your data file. It has to be in CSV
                          format and contain one column named lat and another
                          named lng with valid coordinates
                        </Header>
                      )}
                    </Segment>
                  </div>
                );
              }}
            </Dropzone>
          </Container>
        )}
        <div
          id="map"
          style={{
            marginTop: "5em",
            height: "600px"
          }}
        />
      </div>
    );
  }
}

export default Content;

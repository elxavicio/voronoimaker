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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const d3 = require("d3");
const d3delaunay = require("d3-delaunay");

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
        parseFloat(row["stop_lat"]),
        parseFloat(row["stop_lon"])
      ]);
    }

    // Filter elements with NaN values
    const filteredPoints = rawPoints.filter(
      item => !isNaN(item[0]) && !isNaN(item[1])
    );

    // Get mapBounds from list of points
    let mapBounds = L.latLngBounds(filteredPoints).pad(0.1);

    // Create the map
    let map = new L.Map("map");

    map.setView(mapBounds.getCenter(), 5);

    let tileLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    tileLayer.on("load", function(e) {
      console.log();
      const { x, y } = map.getSize();

      let projectedPoints = [];
      for (let i = 0; i < filteredPoints.length; i++) {
        const { x, y } = map.latLngToContainerPoint(filteredPoints[i]);
        projectedPoints.push([x, y]);
      }
      console.log(projectedPoints);

      const delaunay = d3delaunay.Delaunay.from(projectedPoints);
      console.log(delaunay);
      const voronoi = delaunay.voronoi([0, 0, x, y]);

      const voronoiPath = voronoi.render();
      console.log(voronoiPath);

      filteredPoints.forEach(point => {
        L.circle([point[0], point[1]], { radius: 5 }).addTo(map);
      });

      let svg = d3
        .select(map.getPanes().overlayPane)
        .append("svg")
        .attr("width", x)
        .attr("height", y);
      let pathSvg = svg
        .append("path")
        .attr("d", voronoiPath)
        .attr("stroke", "indianred");
    });

    tileLayer.addTo(map);

    // TODO adjust map view according to points we are dispalying
    // map.fitBounds(mapBounds);
    // map.setZoom(map.getBoundsZoom(mapBounds));

    setTimeout(() => {
      map.invalidateSize();
      console.log("Invalidate size");
    }, 400);

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
        <div
          id="map"
          style={{ height: this.state.hideMap ? "0px" : "800px" }}
        />
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
      </div>
    );
  }
}

export default Content;

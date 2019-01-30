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

const onCSVLoaded = results => {
  let data = [];
  results.data.map(row =>
    data.push([parseFloat(row["stop_lon"]), parseFloat(row["stop_lat"])])
  );
};

const onFileDrop = (acceptedFiles, rejectedFiles) => {
  console.log("File dropped");
  acceptedFiles.forEach(file => {
    Papa.parse(file, {
      header: true,
      error: function(err, file, inputElem, reason) {
        console.log(err, reason);
      },
      complete: onCSVLoaded
    });
  });
};

const Content = () => (
  <div>
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
      <Dropzone onDrop={onFileDrop}>
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
                    Drop or click your data file. It has to be in CSV format and
                    contain one column named lat and another named lng with
                    valid coordinates
                  </Header>
                )}
              </Segment>
            </div>
          );
        }}
      </Dropzone>
    </Container>
  </div>
);

export default Content;

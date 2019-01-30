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

onFileDrop = (acceptedFiles, rejectedFiles) => {
  acceptedFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      console.log(fileContent);
    };
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");

    reader.readAsText(file);
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
          marginTop: "3em"
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
      <Dropzone onFileDrop={this.onFileDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div
              {...getRootProps()}
              className={classNames("dropzone", {
                "dropzone--isActive": isDragActive
              })}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop files here...</p>
              ) : (
                <p>
                  Try dropping some files here, or click to select files to
                  upload.
                </p>
              )}
            </div>
          );
        }}
      </Dropzone>
    </Container>
  </div>
);

export default Content;

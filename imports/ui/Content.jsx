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
      <Button primary size="huge">
        <Icon name="file alternate outline" />
        Import your data now
      </Button>
    </Container>
  </div>
);

export default Content;

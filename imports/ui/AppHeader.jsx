import React from "react";
import { Container, Menu } from "semantic-ui-react";

const AppHeader = () => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item as="a" header>
        Voronoi.us
      </Menu.Item>
    </Container>
  </Menu>
);

export default AppHeader;

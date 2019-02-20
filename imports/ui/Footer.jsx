import React from "react";

import {
  Container,
  Divider,
  Grid,
  Header,
  Image,
  List,
  Segment
} from "semantic-ui-react";

const Footer = () => (
  <Segment
    inverted
    vertical
    style={{ bottom: "0", position: "absolute", width: "100%" }}
  >
    <Container textAlign="center">
      <Grid divided inverted stackable>
        <Grid.Column width={13}>
          <Header
            inverted
            as="h4"
            content="Made with love by Javier Carceller"
          />
          <p>Get in touch and let me know how to improve this!</p>
        </Grid.Column>
        <Grid.Column width={3}>
          <List link inverted>
            <List.Item as="a">
              <a href="https://github.com/elxavicio">GitHub</a>
            </List.Item>
            <List.Item as="a">
              <a href="https://www.linkedin.com/in/javiercarceller/">
                LinkedIn
              </a>
            </List.Item>
            <a href="https://javiercarceller.com/">Portfolio</a>
          </List>
        </Grid.Column>
      </Grid>
    </Container>
  </Segment>
);

export default Footer;

import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header"

function CommonLayout(props) {
  return (
    <Container>
      <Header />
      {props.children}
      <h1>footer</h1>
    </Container>
  );
}

export default CommonLayout;

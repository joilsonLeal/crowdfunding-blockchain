import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";

import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import { Link } from "../../../routes";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;

    const campaign = Campaign(address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return {
      address,
      requests,
      requestsCount,
      approversCount,
    };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button
              floated="right"
              content="Create Request"
              icon="add square"
              primary
            />
          </a>
        </Link>
        <h3>Request List</h3>
        <Table celled structured>
          <Header>
            <Row>
              <HeaderCell textAlign="center">ID</HeaderCell>
              <HeaderCell textAlign="center">Description</HeaderCell>
              <HeaderCell textAlign="center">Amount</HeaderCell>
              <HeaderCell textAlign="center">Recipient</HeaderCell>
              <HeaderCell textAlign="center">Approval</HeaderCell>
              <HeaderCell textAlign="center">Approve</HeaderCell>
              <HeaderCell textAlign="center">Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div> Found requests: {this.props.requestsCount}</div>
      </Layout>
    );
  }
}

export default RequestIndex;

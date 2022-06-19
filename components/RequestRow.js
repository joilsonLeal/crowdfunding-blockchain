import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";

import { Router } from "../routes";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class RequestRow extends Component {
  onApprove = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    });
    Router.pushRoute(`/campaigns/${this.props.address}/requests`);
  };

  onFinalize = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0],
    });
    Router.pushRoute(`/campaigns/${this.props.address}/requests`);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;

    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell textAlign="center">{id + 1}</Cell>
        <Cell textAlign="center">{request.description}</Cell>
        <Cell textAlign="center">
          {`${web3.utils.fromWei(request.value, "ether")} ETH`}
        </Cell>
        <Cell textAlign="center">{request.recipient}</Cell>
        <Cell textAlign="center">
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell textAlign="center">
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell textAlign="center">
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              {" "}
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;

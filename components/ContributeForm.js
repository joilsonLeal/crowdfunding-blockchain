import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = {
    contribution: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.contribution, "ether"),
      });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            placeholder="value in ether"
            label={{ content: "ether" }}
            labelPosition="right"
            type="number"
            step="0.001"
            value={this.state.contribution}
            onChange={(event) =>
              this.setState({ contribution: event.target.value })
            }
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button
          loading={this.state.loading}
          primary
          content="Contribute!"
          style={{ marginTop: "10px" }}
          floated="right"
          icon="payment"
        />
      </Form>
    );
  }
}

export default ContributeForm;

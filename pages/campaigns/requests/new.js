import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";
import web3 from "../../../ethereum/web3";

class CreateRequest extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
    description: "",
    recipient: "",
  };

  static async getInitialProps(props) {
    return {
      address: props.query.address,
    };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });

      Router.push(`/campaigns/${this.props.address}/requests`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a> Back </a>
        </Link>
        <h3>Create Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              placeholder="Description of the request"
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Amount in Ether</label>
            <Input
              placeholder="value in ether"
              type="number"
              step="0.001"
              label={{ content: "ether" }}
              labelPosition="right"
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <input
              placeholder="Recipient address"
              value={this.state.recipient}
              onChange={(event) =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button
            loading={this.state.loading}
            primary
            content="Create!"
            style={{ marginTop: "10px" }}
            icon="payment"
          />
        </Form>
      </Layout>
    );
  }
}

export default CreateRequest;

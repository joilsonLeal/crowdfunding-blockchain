import React, { Component } from "react";
import Layout from "../../components/Layout";
import ContributeForm from "../../components/ContributeForm";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;

    const campaign = Campaign(address);
    const summary = await campaign.methods.getSummary().call();

    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address,
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "Manager can create campaign and can create requests to spend amount.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver.",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Request must be approved by approvers.",
      },
      {
        header: approversCount,
        meta: "Contributors",
        description:
          "Number of people who have already donated to this campaign.",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "Balance present in the campaign, this is the amount untilised yet.",
      },
    ];

    return items;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>
        <Grid>
          <Grid.Column width={10}>
            <Card.Group items={this.renderCards()} />
            <Link route={`/campaigns/${this.props.address}/requests`}>
              <Button
                content="View Requests"
                primary
                style={{ marginTop: "10px" }}
              />
            </Link>
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={this.props.address} />
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;

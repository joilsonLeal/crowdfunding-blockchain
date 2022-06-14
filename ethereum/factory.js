import web3 from './web3';
import compiledFactory from "./build/CampaignFactory.json";
import config from './config';

let instance;
if(web3) {
  instance = new web3.eth.Contract(
    compiledFactory.abi,
    config.contract
  );
}

export default instance;

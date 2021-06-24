import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth"

import styled from "../styles/Home.module.css";

export default function Metrics() {

  return (
    <div className={styled.container}>
      <h1>Metrics</h1>
    </div>
  );
};

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
});

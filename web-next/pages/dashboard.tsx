import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth"

import styled from "../styles/Home.module.css";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
  }, []);

  return (
    <div className={styled.container}>
      <h1>Dashboard: {user?.email}</h1>
      <button onClick={signOut}>SignOut</button>
    </div>
  );
};

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');
  return {
    props: {}
  }
});

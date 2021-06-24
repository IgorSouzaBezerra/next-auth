import { destroyCookie } from "nookies";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthTokenError } from "../errors/AuthTokenError";
import { setupAPIClient } from "../services/api";
import styled from "../styles/Home.module.css";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className={styled.container}>
      <h1>Dashboard: {user?.email}</h1>
    </div>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const response = await apiClient.get('/me');
    console.log('try')
  } catch (err) {
    destroyCookie(ctx, 'nextauth.token');
    destroyCookie(ctx, 'nextauth.refreshToken');
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
});

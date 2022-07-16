import { Layout } from "../components/Layout";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import axios from "axios";
export const admin = () => {
  useEffect(() => {}, []);
  return (
    <Layout>
      <div></div>
      {!getCookie("isAdmin") ? (
        <div className="bg-red-200 p-3 text-center rounded-lg">
          You can't access this if you're not the admin.
        </div>
      ) : (
        <div className="bg-green-200 p-3 text-center rounded-lg">
          You can access this if you're the admin.
        </div>
      )}
    </Layout>
  );
};
export default admin;

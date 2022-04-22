import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const UserData = () => {


  const [users, setUsers] = useState([]);
  useEffect(() => {
    // axios.get(`${BASE_URL}/api/users`).then((res) => {
    //   console.log("user", res.data);

    //   setUsers(res.data);
    // });

    const fetchUsers = async () => {

      await axios.get(`http://localhost:5000/api/users`)
        .then(res => setUsers(res.data));


    };

    fetchUsers();
  }, []);
  return { users: users };

}

export default UserData;
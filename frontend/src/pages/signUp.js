// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * signUp.js
 *
 * This exports the sign up page.
 * To be developed:
 * "re-enter password" checks that the passwords are equal
 * passwords have criteria (ex: 8 characters long)
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import "bootstrap/dist/css/bootstrap.css";
import FacebookIcon from "./../design/icons/icons8-facebook-30.png";
import GoogleIcon from "./../design/icons/icons8-google-48.png";
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "./../design/styleSheets/signInUp.css";
import HelpIcon from "@material-ui/icons/Help";

// +-------------------+----------------------------------------------------------------------
// | signUp.js         |
// +-------------------+
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [passwordInfo, setPasswordInfo] = useState(false);

  //Updates the state as the user types
  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "firstname":
        setFirstname(value);
        break;
      case "lastname":
        setLastname(value);
        break;
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }
  };

  // when the user submits the form, post to database
  const handleSubmit = (event) => {
    // prevent the page from refreshing
    event.preventDefault();

    // build the user
    let user = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
      email: email,
      token: ''
    };

    //post user to database
    fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signUp", ...user }),
    })
      .then((res) => res.json())
      .then((message) => {
        if (message !== "User Created") {
          alert(message);
        } else {
          window.location.href = "/";
        }
      });
  };

  return (
    <Container
      fluid
      style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}
    >
      {/* Title and Subtitle */}
      <h1>Sign Up</h1>
      <p>
        {" "}
        Welcome to MIST! <br /> Get started by creating an account.{" "}
      </p>

      {/* Facebook and Google Icons */}
      <div className="icons">
        <img src={GoogleIcon} alt="Google Logo" className="icon"></img>
        <img src={FacebookIcon} alt="Facebook Logo" className="icon"></img>
      </div>
      <p>OR</p>
      {/* Start of the form */}
      <Form className="form" onSubmit={handleSubmit}>
        {/* first name */}
        <Form.Group>
          <Form.Label>First name</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={firstname}
            name="firstname"
            required="required"
            placeholder="Enter first name"
          />
        </Form.Group>

        {/* last name */}
        <Form.Group>
          <Form.Label>Last name</Form.Label>
          <Form.Control
            onChange={handleChange}
            v
            alue={lastname}
            name="lastname"
            required="required"
            placeholder="Enter last name"
          />
        </Form.Group>

        {/* username */}
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={username}
            name="username"
            required="required"
            placeholder="@username"
          />
        </Form.Group>

        {/* email */}
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={email}
            name="email"
            required="required"
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={password}
            name="password"
            required="required"
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <div className="row">
          <HelpIcon
            style={{ fontSize: 30, paddingLeft: 10 }}
            onMouseOut={() => setPasswordInfo(false)}
            onMouseOver={() => setPasswordInfo(true)}
          />
          {passwordInfo?
          (<div
            style={{
              backgroundColor: "#e3e296",
              borderRadius: 15
            }}
            className="col-md-3"
          ><ul>
            <li>At least 8 characters</li>
            <li>At least one digit</li>
            <li>At least one special character</li>
          </ul></div>):(<div></div>)}
        </div>

        {/* commented out until we can check passwords
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Re-enter Password</Form.Label>
            <Form.Control required="required" type="password" placeholder="Re-enter password" />
          </Form.Group> */}

        {/* checkboxes */}
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            required="required"
            label="By checking this box I confirm that I am 13 years of age or older."
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check
            required="required"
            type="checkbox"
            label={
              <label>
                By checking this box I confirm that I have read and accept the{" "}
                <a href="/community">Community Guidelines</a>
              </label>
            }
          />
        </Form.Group>

        {/* submit */}
        <Form.Group>
          <Button variant="outline-dark" type="submit" id="submitButton">
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default SignUp;

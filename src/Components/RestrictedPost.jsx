import React from "react";
import { PaystackButton } from "react-paystack";
import { useAuth } from "../contexts/AuthContext";

import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./styles/RestrictedPost.css";

export default function RestrictedPost(props) {
  const { user } = useAuth();
  const { email } = user;

  const publicKey = "pk_test_cbe5987272422eb4324b6fe91e9d3fc0f60265a1";
  const amount = 500 * 100; // Remember, set in kobo!
  const phone = "07064924947";

  const componentProps = {
    email,
    amount,
    metadata: {
      email,
      phone,
    },
    publicKey,
  };

  return (
    <div className="bg-white border-bottom pb-3 mt-2 mb-5">
      <Container>
        <Row>
          <Col md={12} className="mt-0 px-0 pb-0 mb-0">
            {/* <Alert variant="light mt-0 px-0 pb-0 mb-1">
              <Alert.Heading className="restricted-heading text-success">
                Paid Content
              </Alert.Heading>
              <small className="text-success">
                This content has been restricted. You need to pay to see it.
              </small>
              <br />
              <hr className="mt-3" />
            </Alert> */}

            <div
              className="Box py-3 px-3 border rounded-lg"
              style={{ backgroundColor: "rgba(108,198,68,.1)" }}
            >
              <div
                id="client-secret-1180296"
                className="Box-row d-flex flex-items-center client-secret px-0 pb-3"
                style={{ fontSize: "0.875em" }}
              >
                <div className="pt-2 px-3">
                  <span className="js-user-key-icon clearfix d-block text-center ">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      version="1.1"
                      data-view-component="true"
                      height="32"
                      width="32"
                      className="octicon octicon-key"
                    >
                      <path d="M16.75 8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"></path>
                      <path
                        fillRule="evenodd"
                        d="M15.75 0a8.25 8.25 0 00-7.851 10.79L.513 18.178A1.75 1.75 0 000 19.414v2.836C0 23.217.784 24 1.75 24h1.5A1.75 1.75 0 005 22.25v-1a.25.25 0 01.25-.25h2.735a.75.75 0 00.545-.22l.214-.213A.875.875 0 009 19.948V18.5a.25.25 0 01.25-.25h1.086c.464 0 .91-.184 1.237-.513l1.636-1.636A8.25 8.25 0 1015.75 0zM9 8.25a6.75 6.75 0 114.288 6.287.75.75 0 00-.804.168l-1.971 1.972a.25.25 0 01-.177.073H9.25A1.75 1.75 0 007.5 18.5v1H5.25a1.75 1.75 0 00-1.75 1.75v1a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-2.836a.25.25 0 01.073-.177l7.722-7.721a.75.75 0 00.168-.804A6.73 6.73 0 019 8.25z"
                      ></path>
                    </svg>
                  </span>
                  <span
                    title="Label: Client secret"
                    data-view-component="true"
                    className="Label Label--secondary px-2 border rounded-3"
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      width: "94px",
                      borderRadius: "16px",
                      fontSize: "0.92em",
                      textAlign: "center",
                    }}
                  >
                    Paid content
                  </span>{" "}
                </div>
                <div className="flex-auto px-4">
                  {/* <code>*****868786d5</code> */}
                  <Alert.Heading
                    className="restricted-heading mb-2"
                    style={{ fontWeight: 900 }}
                  >
                    Paid Content
                  </Alert.Heading>
                  <p className="color-text-secondary mb-0">
                    Added{" "}
                    <relative-time
                      datetime="2021-07-07T18:25:09Z"
                      className="no-wrap"
                    >
                      Jul 7, 2021
                    </relative-time>{" "}
                    by <strong>Chizaram-Igolo</strong>
                    {/* <span className="d-block ">Never used</span> */}
                  </p>
                  <p className="mt-2 mb-1 post-p">
                    This content has been restricted. You need to pay to see it.
                  </p>
                </div>

                {/* <div class="action">
                  <div class="undeletable">
                    <button
                      type="button"
                      data-view-component="true"
                      class="btn-success btn-sm btn"
                    >
                      Delete
                    </button>
                  </div>
                </div> */}
              </div>

              <div className="d-flex justify-content-end mt-0">
                {/* <Button variant="success" className="mt-0">
                  
                </Button> */}

                <PaystackButton
                  text="Pay ₦500 to access"
                  className="btn btn-success"
                  {...componentProps}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/* <div className="d-flex justify-content-end mt-0">
        <Button variant="success" size="sm" className="mt-0">
          Pay ₦500 to access
        </Button>
      </div> */}
    </div>
  );
}

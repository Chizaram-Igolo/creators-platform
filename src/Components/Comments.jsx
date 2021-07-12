import React from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/img1.jpeg";

export default function Comments() {
  return (
    <div>
      <div className="media-block px-5 pt-3">
        <Link className="media-left" to="/">
          <img className="rounded-circle img-sm" src={img1} alt="" />
        </Link>
        <div className="media-body">
          <div className="mar-btm">
            <Link
              to="/"
              className="btn-link text-semibold media-heading box-inline"
            >
              Lisa D.
            </Link>
            <p className="text-muted text-sm">
              <i className="fa fa-mobile fa-lg"></i> Mobile - 11 min ago
            </p>
          </div>
          <p className="comment-p">
            consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
            enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          </p>
          <div className="pad-ver">
            <div className="d-flex justify-content-end socials p-2 py-3">
              <Link className="mr-2" to="/">
                You like it
              </Link>
              <Link className="" to="/">
                Comment
              </Link>
            </div>
          </div>
          <hr />

          <div>
            <div className="media-block">
              <Link className="media-left" to="/">
                <img className="rounded-circle img-sm" src={img1} alt="" />
              </Link>
              <div className="media-body">
                <div className="mar-btm">
                  <Link
                    to="/"
                    className="btn-link text-semibold media-heading box-inline"
                  >
                    Bobby Marz
                  </Link>
                  <p className="text-muted text-sm">
                    <i className="fa fa-mobile fa-lg"></i>
                    Mobile - 7 min ago
                  </p>
                </div>
                <p className="comment-p">
                  Sed diam nonummy nibh euismod tincidunt ut laoreet dolore
                  magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
                  quis nostrud exerci tation ullamcorper suscipit lobortis nisl
                  ut aliquip ex ea commodo consequat.
                </p>
                <div className="pad-ver">
                  <div className="d-flex justify-content-end socials p-2 py-3">
                    <Link className="mr-2" to="/">
                      You like it
                    </Link>
                    <Link className="" to="/">
                      Comment
                    </Link>
                  </div>
                </div>
                <hr />
              </div>
            </div>

            <div className="media-block">
              <Link className="media-left" to="/">
                <img className="rounded-circle img-sm" src={img1} alt="" />
              </Link>
              <div className="media-body">
                <div className="mar-btm">
                  <Link
                    to="/"
                    className="btn-link text-semibold media-heading box-inline"
                  >
                    Lucy Moon
                  </Link>
                  <p className="text-muted text-sm">
                    <i className="fa fa-globe fa-lg"></i> Web - 2 min ago
                  </p>
                </div>
                <p className="comment-p">
                  Duis autem vel eum iriure dolor in hendrerit in vulputate ?
                </p>
                <div className="pad-ver">
                  <div className="d-flex justify-content-end socials p-2 py-3">
                    <Link className="mr-2" to="/">
                      You like it
                    </Link>
                    <Link className="" to="/">
                      Comment
                    </Link>
                  </div>
                  <div className="btn-group"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  // "@keyframes ripple": {
  //   "0%": {
  //     transform: "scale(.8)",
  //     opacity: 1,
  //   },
  //   "100%": {
  //     transform: "scale(2.5)",
  //     opacity: 0,
  //   },
  // },
}))(Badge);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(0),
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "0.98em",
    // fontWeight: "bolder",
  },
  medium: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    // fontSize: "1.2em",
    // fontWeight: "bolder",
  },
  large: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    fontSize: "2.6em",
    // fontWeight: "bolder",
  },
}));

export default function AvatarComponent({
  displayName,
  imgSrc,
  size,
  showOnlineStatus = false,
  avatarColour,
  anchorElement,
}) {
  const classes = useStyles();

  const innerElem = (
    <>
      {size === "small" && (
        <Avatar
          alt={displayName}
          src={imgSrc}
          className={classes.small}
          style={{ backgroundColor: avatarColour }}
        />
      )}
      {size === "medium" && (
        <Avatar
          alt={displayName}
          src={imgSrc}
          className={classes.medium}
          style={{ backgroundColor: avatarColour }}
        />
      )}
      {size === "large" && (
        <Avatar
          alt={displayName}
          src={imgSrc}
          className={classes.large}
          style={{ backgroundColor: avatarColour }}
        />
      )}
    </>
  );

  return (
    <div className={classes.root}>
      {showOnlineStatus && !anchorElement && (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
          badgeContent={anchorElement}
        >
          {innerElem}
        </StyledBadge>
      )}

      {!showOnlineStatus && !anchorElement && innerElem}

      {anchorElement && (
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            anchorElement
            // <SmallAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          }
        >
          {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}

          <StyledBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
            badgeContent={anchorElement}
          >
            {innerElem}
          </StyledBadge>
        </Badge>
      )}
    </div>
  );
}

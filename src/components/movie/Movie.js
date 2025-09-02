/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from "react";
import axios from "axios";
import { isImageURL, greekFromEnglish, API_ENDPOINTS } from "../../utils";
import { Link } from "react-router-dom";
import Rating from "material-ui-rating";
import Style from "./movie.styles";
import MovieSidebar from "../movieSidebar/MovieSidebar";
export default class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratings_api: API_ENDPOINTS.ocena,
      ratings: {},
      referralID: null,
      loadingReferralID: false,
      hover: false,
      showMovieSidebar: false,
    };
    this._isMounted = false;
  }

  toggleHover = () => {
    this.setState({ hover: !this.state.hover });
  };
  this._isMounted = false;
 }

 toggleHover = () => {
  this.setState({ hover: !this.state.hover });
 };

 toggleSidebar = () => {
  this.setState({ showMovieSidebar: !this.state.showMovieSidebar });
 };

 // Add download to API to make it trackable
 addDownload = () => {
  axios
   .post(
    this.state.ratings_api + "/download/",
    {
     ip_address: this.props.ip_address,
     referral_id: this.props.data.referral_id
    },
    {
     auth: {
      username: import.meta.env.VITE_OCENA_USERNAME,
      password: import.meta.env.VITE_OCENA_PASSWORD
     }
    }
   )
   .then(() => {
    console.log(`added ${this.props.data.name} to downloads on ocena`);
   });
 };

 getAverage = () => {
  const { data } = this.props;
  axios
   .post(
    this.state.ratings_api + "/movie/ratings/average/",
    {
     referral_id: data.referral_id
    },
    {
     auth: {
      username: import.meta.env.VITE_OCENA_USERNAME,
      password: import.meta.env.VITE_OCENA_PASSWORD
     }
    }
   )
   .then((res) => {
    this.setState({
     ratings: res.data
    });
   })
   .catch((err) => {
    if (err) {
     this.setState({
      error: true
     });
    }
   });
 };

 getShareID = (action) => {
  const { data } = this.props;

  axios
   .post(
    this.state.ratings_api + "/referral/",
    {
     ip_address: this.props.ip_address,
     referral_id: data.referral_id
    },
    {
     auth: {
      username: import.meta.env.VITE_OCENA_USERNAME,
      password: import.meta.env.VITE_OCENA_PASSWORD
     }
    }
   )
   .then((res) => {
    const { data } = res;
    if (action) {
     this.setState({ loadingReferralID: false });
    }
    this.setState({ referralID: data }, () => {
     if (action) {
      this.shareMovie();
     }
    });
   })
   .catch((err) => {
    this.setState(
     {
      loadingReferralID: false,
      referralID: data.referral_id
     },
     () => {
      // error thrown leading to a  bug of share modal always displayed on first renders
      // this.shareMovie();
     }
    );
    console.log(err);
   });
 };

 shareMovie() {
  if (this.state.referralID) {
   this.props.shareMovie({
    ...this.props.data,
    referralID: this.state.referralID
   });
  } else {
   this.setState({ loadingReferralID: true });
   this.getShareID("share");
  }
 }

 componentDidMount() {
  this.getAverage();
  this.getShareID();
  this._isMounted = true;
 }

 componentWillUnmount() {
  this._isMounted = false;
 }

 render() {
  const { cover_photo_link, size, name, engine, Index } = this.props.data;
  const { server, ip_address, shareMovie } = this.props;

  var translateStyle;
  if (this.state.hover) {
   translateStyle = { transform: "translateY(-10px)" };
  } else {
   translateStyle = { transform: "translate(0px)" };
  }
}

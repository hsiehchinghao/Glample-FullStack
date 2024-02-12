import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "../services/PostService";

const AllPosts = ({ searchContent }) => {
  const navigate = useNavigate();
  const { search } = useParams();

  useEffect(() => {
    PostService.searching(search)
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [searchContent]);

  return (
    <div className="allPostsPage">
      {searchContent && <div className="searchingDecoration"></div>}
    </div>
  );
};

export default AllPosts;

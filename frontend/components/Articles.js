import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PT from 'prop-types'
import axios from 'axios'
import {axiosWithAuth} from '../axios'

export default function Articles(props) {
  const { articles, setArticles, values, setValues, editing, setEditing } = props;
  // ✨ where are my props? Destructure them here

  // ✨ implement conditional logic: if no token exists
  // we should render a Navigate to login screen (React Router v.6)

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    axios.get('http://localhost:9000/api/articles',{
      headers:{
        authorization: token
      }
    })
    .then(res => {
      console.log(res)
      setArticles(res.data.articles)
      props.setMessage(res.data.message)
    })
    // ✨ grab the articles here, on first render only
  },[])

  const onDelete = ( articleId ) =>{
    const token = localStorage.getItem('token'); 
    axios.delete(`http://localhost:9000/api/articles/${articleId}`,{
      headers:{
        authorization: token
      }
    })
    .then(res => {
      props.setMessage(res.data.message)
      setArticles(articles.filter(art => art.article_id !== articleId ))
    })
  }
  

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {
        !articles.length
          ? 'No articles yet'
          : articles.map(art => {
            console.log( art );
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button disabled={false} onClick={ () => setValues( { title: art.title, text: art.text, topic: art.topic } )}>Edit</button>
                  <button disabled={false} onClick={ () => onDelete(art.article_id) }>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}

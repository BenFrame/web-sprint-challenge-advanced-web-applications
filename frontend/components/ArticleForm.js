import React, { useEffect, useState } from 'react'
import PT from 'prop-types'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const { articles, setArticles, editing, setEditing } = props; 
  const {values, setValues} = props
  const navigate = useNavigate()
 
  // ✨ where are my props? Destructure them here

  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
  })

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    if(editing){
      evt.preventDefault()
      const token = localStorage.getItem('token');
      axios.put(`http://localhost:9000/api/articles/${editing}`,
      {
        title: values.title, 
        text: values.text,
        topic: values.topic 
      },{
        headers:{
          authorization: token
        }
      })
      .then(res => {
        console.log(res)
        setArticles( [...articles.filter(art => art.article_id !== editing), res.data.article ])
        props.setMessage(res.data.message)
        setValues(initialFormValues)
        setEditing(false)
      })
    }else{
    evt.preventDefault()
    const token = localStorage.getItem('token');
    axios.post('http://localhost:9000/api/articles',
      {
        title: values.title, 
        text: values.text,
        topic: values.topic
      },
      {
      headers:{
        authorization: token
      },
      
    },)
    .then(res => {
      console.log(res);
      // localStorage.setItem('token', res.data.token)
      setArticles( [...articles, res.data.article ])
      props.setMessage(res.data.message)
      setValues(initialFormValues)
      
      // navigate('/articles')
    })
    .catch(err=> {
      console.log(err)
    })
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
  }}

  const isDisabled = () => {
    // const selectTopic = document.getElementById('topic')
    // const value = selectTopic.value
    if( values.text.trim() && values.title.trim() && values.topic ){
      return false
    }else{
      return true
    }
    // ✨ implement
    // Make sure the inputs have some values
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} onClick={onSubmit} id="submitArticle">Submit</button>
        <button onClick={Function.prototype}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}

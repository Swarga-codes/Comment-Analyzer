import { useState,useEffect, useRef } from 'react'
import '@tensorflow/tfjs'
import {load} from '@tensorflow-models/toxicity'
import './App.css'

function App() {
  const [commentInput,setCommentInput]=useState("")
  const [comments,setComments]=useState([])
  const [modelHasLoaded,setModelHasLoaded]=useState(false)
  const [verdict,setVerdict]=useState("")
  const model=useRef(null)
  async function loadModel(){
    // The minimum prediction confidence.
const threshold = 0.9;
// Set a state that indicates the model is being loaded...
model.current = await load(threshold);
setModelHasLoaded(true);
// Set the state to false to let the user know that they can check the text

  }
  async function sendComment(){
    if(!commentInput){
      return
    }
    const predictions=await model.current.classify([commentInput])
    const predictionsFilter=predictions.filter(prediction=>prediction.results[0].match===true) 
    if(predictionsFilter.length===0){
    setComments([...comments,{comment:commentInput,isNegative:false}])
    }
    else{
      const labels=predictionsFilter.map(prediction=>prediction.label)
      setComments([...comments,{comment:commentInput,labels:labels,isNegative:true}])
    }
    setCommentInput('')
  }
 useEffect(() => {
loadModel()
 }, [])
 

  return (
    <>
    <h1>Comment Analyzer</h1>
    <p>✅Positive Comments: {comments.filter(comment=>comment.isNegative===false).length}</p>
    <p>❌Negative Comments: {comments.filter(comment=>comment.isNegative===true).length}</p>
    <p>{verdict}</p>
   {comments?.map(
    (comment,idx)=>(
      <div key={idx} className='comment'>
        <p>{comment.comment} {"  "}  {comment.isNegative === true && "(labels: "+comment.labels.map((label, index) => {
        if (index !== comment.labels.length - 1) {
          return label + ", ";
        }
        return label + ".)";
      })}</p>
       
      </div>
    )
   )}
  {modelHasLoaded? <form onSubmit={(e)=>{
      e.preventDefault()
      sendComment()
    }}>
    <input type="text" value={commentInput} onChange={(e)=>setCommentInput(e.target.value)} placeholder='Enter your comment...'/>
    <button type="submit">Send</button>
    </form>
    :
    <p>Model is loading, please wait...</p>
    }
    </>
  )
}

export default App

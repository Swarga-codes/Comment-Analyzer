import { useState,useEffect } from 'react'
import '@tensorflow/tfjs'
import '@tensorflow-models/toxicity'
import './App.css'

function App() {
  const [commentInput,setCommentInput]=useState("")
  const [comments,setComments]=useState([])
  function detectToxicity(){
    // The minimum prediction confidence.
const threshold = 0.9;

// Load the model. Users optionally pass in a threshold and an array of
// labels to include.
toxicity.load(threshold).then(model => {
  const sentences = ['you suck'];

  model.classify(sentences).then(predictions => {
  

    console.log(predictions);
    /*
    prints:
    {
      "label": "identity_attack",
      "results": [{
        "probabilities": [0.9659664034843445, 0.03403361141681671],
        "match": false
      }]
    },
    {
      "label": "insult",
      "results": [{
        "probabilities": [0.08124706149101257, 0.9187529683113098],
        "match": true
      }]
    },
    ...
     */
  });
});
  }
  function sendComment(){
    if(!commentInput){
      return
    }
    setComments([...comments,commentInput])
    setCommentInput('')
  }
//  useEffect(() => {

//  }, [])
 

  return (
    <>
    <h1>Comment Analyzer</h1>
   {comments?.map(
    (comment,idx)=>(
      <li key={idx}>{comment}</li>
    )
   )}
   <form onSubmit={(e)=>{
      e.preventDefault()
      sendComment()
    }}>
    <input type="text" value={commentInput} onChange={(e)=>setCommentInput(e.target.value)} placeholder='Enter your comment...'/>
    <button type="submit">Send</button>
    </form>
    </>
  )
}

export default App

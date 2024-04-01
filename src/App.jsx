import { useState,useEffect, useRef } from 'react'
import './App.css'
import { pipeline } from '@xenova/transformers'
import { env } from '@xenova/transformers'
import Sentiment from 'sentiment'
import Pie from './Pie'
env.localModelPath = import.meta.env.PUBLIC_URL + '/models/'
function App() {

  const [commentInput,setCommentInput]=useState("")
  const [comments,setComments]=useState([])
  const [neutralCount,setNeutralCount]=useState(0)
  const [verdict,setVerdict]=useState("")
  const [positive,setPositive]=useState(0)
  const [negative,setNegative]=useState(0)
  const [neutral,setNeutral]=useState(0)

  // async function sendComment(){
  //   if(!commentInput){
  //     return
  //   }
  //   const predictions=await model.current.classify([commentInput])
  //   const predictionsFilter=predictions.filter(prediction=>prediction.results[0].match===true) 
  //   if(predictionsFilter.length===0){
  //   setComments([...comments,{comment:commentInput,isNegative:false}])
  //   }
  //   else{
  //     const labels=predictionsFilter.map(prediction=>prediction.label)
  //     setComments([...comments,{comment:commentInput,labels:labels,isNegative:true}])
  //   }
  //   setCommentInput('')
  // }
  function commentVerdict(){
    let positive=comments?.filter(comment=>comment?.isNegative===false).length
    let negative=comments?.filter(comment=>comment?.isNegative===true).length
    if(!positive && !negative){
      return
    }
    if(positive>negative){
      setVerdict(`Your product has ${Math.floor((positive/comments.length)*100)}% of customer support!`)
    }
    else if(positive<negative){
      setVerdict(`Your product has ${Math.floor((negative/comments.length)*100)}% of negative reviews you should work upon those and improve the product!`)
    }
    else{
      setVerdict(`Your product has nearly the same amount of positive and negative feedback,you need to pay attention to it and correct the flaws!`)
    }
  }
  function analyseSentimentUsingAFINN(){
    if(!commentInput){
      return
    }
    const analyse=new Sentiment()
    const result=analyse.analyze(commentInput)
    if(result.score>0){
     return {label: 'POSITIVE',score:result.score}
    // setComments([...comments,{comment:commentInput+" (positive comment)",isNegative:false}])
    }
    else if(result.score<0){
      return {label:'NEGATIVE',score:result.score}
     
    // setComments([...comments,{comment:commentInput+" (negative comment)",isNegative:true}])
    }
    else{
    // setComments([...comments,{comment:commentInput+" (neutral comment)"}])
    // setNeutralCount(neutralCount+1)
    return {label:'NEUTRAL',score:result.score}
    }
  }
async function analyseSentimentUsingBERT(){
  if(!commentInput){
    return 
  }
  let pipe=await pipeline('sentiment-analysis')

  let res=await pipe(commentInput)

 return res
}
async function analyseHybridResults(){
  const afinnResult=analyseSentimentUsingAFINN()
  const bertResult=await analyseSentimentUsingBERT()
  if(afinnResult.label==='NEUTRAL' && Math.floor(afinnResult.score)===0 && bertResult[0].label!=='NEGATIVE'){
    setComments([...comments,{comment:commentInput+" (😐Neutral comment)"}])
  setNeutralCount(neutralCount+1)
}
  else if((bertResult[0].label==='POSITIVE')){
    setComments([...comments,{comment:commentInput+" (✅Positive comment)",isNegative:false}])
  }
  else if((bertResult[0].label==='NEGATIVE')){
    setComments([...comments,{comment:commentInput+" (❌Negative comment)",isNegative:true}])
  }
  setCommentInput('')
}
function updateStats() {
  const totalComments = comments.length;
  const positiveCount = comments.filter(comment => comment.isNegative === false).length;
  const negativeCount = comments.filter(comment => comment.isNegative === true).length;

  setPositive((positiveCount / totalComments) * 100);
  setNegative((negativeCount / totalComments) * 100);
  setNeutral((neutralCount / totalComments) * 100);
}
 useEffect(()=>{
commentVerdict()
updateStats()
 },[commentVerdict, comments, updateStats])

  return (
    <>
    <h1>Comment Analyzer</h1>
    <p>Using BERT+AFINN based hybrid model for sentimental analysis of the comments based on POSITIVE, NEGATIVE and NEUTRAL Feedback!</p>
    <h2>{verdict}</h2>
    <div className='progress'>
    <Pie percentage={positive} colour="#689f38" label={"✅Positive"}/>
    <Pie percentage={negative} colour="red" label={"❌Negative"}/>
    <Pie percentage={neutral} colour="yellow" label={"😐Neutral"}/>
    </div>
    {/* <p>✅Positive Comments: {comments.filter(comment=>comment.isNegative===false).length}</p>
    <p>❌Negative Comments: {comments.filter(comment=>comment.isNegative===true).length}</p>
    <p>😐Neutral Comments: {neutralCount}</p> */}
    {/* <p>{verdict}</p> */}
    <div className='comments'>
   {comments?.map(
    (comment,idx)=>(
      <div key={idx} className='comment'>
        {/* <p>{comment.comment} {"  "}  {comment.isNegative === true && "(labels: "+comment.labels.map((label, index) => {
        if (index !== comment.labels.length - 1) {
          return label + ", ";
        }
        return label + ".)";
      })}</p>
       */}
<p>{comment.comment}</p>       
      </div>
      
    )
   )}
  </div>
   <form onSubmit={async(e)=>{
      e.preventDefault()
      await analyseHybridResults()
    }}>
    <input type="text" value={commentInput} onChange={(e)=>setCommentInput(e.target.value)} placeholder='Enter your comment...' style={{padding:'0.5rem'}}/>
    <button type="submit">Post Comment!</button>
    
    </form>
  </>
  )
}

export default App

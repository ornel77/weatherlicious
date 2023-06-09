import React from 'react'
import netflix from '../assets/netflix.svg'
import snowman from '../assets/snowman.svg'
import relaxing_walk from '../assets/relaxing_walk.svg'
import surf from '../assets/surf.svg'
import walk_city from '../assets/walk_city.svg'

function ActivityWrapper({condition}) {
    console.log(condition);
    let newCondition = condition.toLowerCase()
    let images =[]
    if(newCondition.includes('rain')) {
        images = [{image: surf, description: "fais du surf"}, {image: snowman, description: "bonhomme de neige"}]
    } else if(newCondition.includes('cloudy') || newCondition.includes('overcast'))  {
        images = [{image: walk_city, description: "walk"}]
    } else if(newCondition.includes('clear')) {
        images = [{image: walk_city, description: "it's a party"}]
    } else if(newCondition.includes('snow')) {
        images = [{image: snowman, description: "bonhomme de neige"}]
    }
    
  return (
    <div className='activity-container'>
        {/* <img src={snowman} alt="" style={ condition.includes('cloudy') ? {display: 'block', height: '100px'} : {display: 'none'}} className='activity-img'/>
        <img src={netflix} alt="" style={ condition.includes('rain') ? {display: 'block', height: '100px'} : {display: 'none'}} className='activity-img'/> */}
    {
        images.map((obj, index) => (
            <div key={index} className='activity-item'>
                 <img  src={obj.image} alt="" />
                 <p>{obj.description}</p>
            </div>
        ))
    }
    </div>
  )
}

export default ActivityWrapper